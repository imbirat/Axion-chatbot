import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { selectModel } from '@/lib/router';
import { generateStream } from '@/lib/streaming';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId, message, mode, model: preferredModel, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { model: selectedModel, chain } = await selectModel(message, mode || 'chat', preferredModel);

    await connectDB();

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      }
    } else {
      chat = await Chat.create({
        userId: (session.user as any).id,
        title: message.slice(0, 100),
        mode: mode || 'chat',
        model: selectedModel.id,
      });
    }

    chat.messages.push({ role: 'user', content: message });
    await chat.save();

    const messagesForApi = [
      { role: 'system', content: getSystemPrompt(mode || 'chat') },
      ...(history || []).slice(-20),
      { role: 'user', content: message },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let usedModel = selectedModel;
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
                  
                  chat.messages.push({
                    role: 'assistant',
                    content: '', // full content would be tracked client-side
                    model: currentModelId,
                  });
                  chat.title = chat.title === 'New Chat' ? message.slice(0, 100) : chat.title;
                  await chat.save();
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
      return 'You are a deep research assistant. Provide thorough, structured analysis with clear reasoning. Cite sources where possible.';
    default:
      return 'You are Axion AI, a helpful, intelligent assistant. Provide clear, accurate, and thoughtful responses.';
  }
}
