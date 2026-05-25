import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { selectModel } from '@/lib/router';
import { generateStream } from '@/lib/streaming';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, mode, model: preferredModel, history, attachments, customInstructions, customInstructionsEnabled } = await request.json();

    if (!message && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: 'Message or attachments required' }, { status: 400 });
    }

    const { model: selectedModel, chain } = await selectModel(message || '', mode || 'chat', preferredModel);

    let systemPrompt = getSystemPrompt(mode || 'chat');
    if (customInstructionsEnabled && customInstructions?.trim()) {
      systemPrompt += `\n\nCustom instructions from the user:\n${customInstructions}`;
    }

    let userContent: string | any[] = message || '';
    if (attachments && attachments.length > 0) {
      const parts: any[] = [];
      if (message) parts.push({ type: 'text', text: message });
      parts.push(...attachments);
      userContent = parts;
    }

    const messagesForApi = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-20).map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userContent },
    ];

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Web search for research mode
          let searchResults: { title: string; url: string }[] = [];
          if (mode === 'research') {
            const tavilyKey = process.env.TAVILY_API_KEY;
            if (tavilyKey) {
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'search-start' })}\n\n`));

                const tavilyRes = await fetch('https://api.tavily.com/search', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    api_key: tavilyKey,
                    query: message || '',
                    search_depth: 'basic',
                    max_results: 6,
                    include_answer: false,
                  }),
                });

                if (tavilyRes.ok) {
                  const tavilyData = await tavilyRes.json();
                  searchResults = (tavilyData.results || []).map((r: any, i: number) => ({
                    title: r.title || `Source ${i + 1}`,
                    url: r.url || '',
                  }));

                  for (const result of searchResults) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'search-result', ...result })}\n\n`));
                  }

                  if (searchResults.length > 0) {
                    const sourcesBlock = '\n\n## Web Search Results\n\n' +
                      searchResults.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join('\n') +
                      '\n\nUse these sources to inform your answer. Cite them inline where relevant.';

                    messagesForApi[0] = {
                      role: 'system',
                      content: systemPrompt + sourcesBlock,
                    };
                  }
                }
              } catch {
                // search failed silently
              }
            }
          }

          // Start model chain
          let modelIndex = 0;
          while (modelIndex < chain.length) {
            const currentModelId = chain[modelIndex];
            try {
              for await (const chunk of generateStream(currentModelId, messagesForApi)) {
                if (chunk.type === 'token') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', content: chunk.content })}\n\n`));
                } else if (chunk.type === 'reasoning') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'reasoning', content: chunk.content })}\n\n`));
                } else if (chunk.type === 'done') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
                  controller.close();
                  return;
                } else if (chunk.type === 'error') {
                  if (chunk.error === 'RATE_LIMITED') {
                    modelIndex++;
                    if (modelIndex < chain.length) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'model-switch', model: chain[modelIndex] })}\n\n`));
                      continue;
                    }
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'All models rate limited' })}\n\n`));
                    controller.close();
                    return;
                  }
                  throw new Error(chunk.error);
                }
              }
            } catch (err: any) {
              if (err.message === 'RATE_LIMITED') {
                modelIndex++;
                if (modelIndex < chain.length) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'model-switch', model: chain[modelIndex] })}\n\n`));
                  continue;
                }
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`));
              controller.close();
              return;
            }
            break;
          }
        } catch (err: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getSystemPrompt(mode: string): string {
  switch (mode) {
    case 'code':
      return 'You are an expert software engineer. Write clean, well-structured code. Provide explanations and best practices.';
    case 'research':
      return 'You are AXION DeepResearch, an advanced research assistant. Provide thorough, structured analysis with clear reasoning. Structure your response with: 1. Executive Summary 2. Key Findings 3. Detailed Analysis 4. Conclusions. Use clear headings, bullet points, and evidence-based reasoning. Cite sources where possible.';
    default:
      return 'You are Axion AI, a helpful, intelligent assistant. Provide clear, accurate, and thoughtful responses.';
  }
}
