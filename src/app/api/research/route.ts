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

    const { query, depth = 'deep' } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const { model: selectedModel, chain } = await selectModel(query, 'research');

    let sourcesHtml = '';
    let searchResults: { title: string; url: string }[] = [];

    const tavilyKey = process.env.TAVILY_API_KEY;
    if (tavilyKey) {
      try {
        const tavilyRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: tavilyKey,
            query,
            search_depth: depth === 'comprehensive' ? 'advanced' : 'basic',
            max_results: 8,
            include_answer: false,
          }),
        });

        if (tavilyRes.ok) {
          const tavilyData = await tavilyRes.json();
          searchResults = (tavilyData.results || []).map((r: any, i: number) => ({
            title: r.title || `Source ${i + 1}`,
            url: r.url || '',
          }));

          if (searchResults.length > 0) {
            sourcesHtml = '\n\n## Web Search Results\n\n' +
              searchResults.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join('\n') +
              '\n\nUse these sources to inform your answer. Cite them inline where relevant.';
          }
        }
      } catch {
        // Tavily search failed silently, continue without sources
      }
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Emit search events
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'search-start' })}\n\n`));
          for (const result of searchResults) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'search-result', ...result })}\n\n`));
          }

          const systemPrompt = `You are AXION DeepResearch, an advanced research assistant. 
Depth: ${depth === 'comprehensive' ? 'Extremely thorough, academic-level analysis' : depth === 'deep' ? 'Detailed multi-perspective analysis' : 'Balanced overview with key insights'}

Structure your response with:
1. Executive Summary
2. Key Findings
3. Detailed Analysis
4. Conclusions

Use clear headings, bullet points, and evidence-based reasoning.${sourcesHtml}`;

          const messagesForApi = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ];

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
                  }
                  throw new Error(chunk.error);
                }
              }
              break;
            } catch (err: any) {
              if (err.message === 'RATE_LIMITED') {
                modelIndex++;
                if (modelIndex < chain.length) continue;
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`));
              controller.close();
              return;
            }
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
