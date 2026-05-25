import { StreamChunk } from '@/types/api';
import { MODELS } from '@/config/models.config';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function normalizeContent(content: string | any[]): string | any[] {
  if (typeof content === 'string') return content;
  return content.map((part) => {
    if (part.type === 'image_url') {
      return { type: 'image_url', image_url: { url: part.image_url.url } };
    }
    return { type: 'text', text: part.text || '' };
  });
}

export async function* generateStream(
  modelId: string,
  messages: { role: string; content: string | any[] }[],
  signal?: AbortSignal,
): AsyncGenerator<StreamChunk> {
  const model = MODELS[modelId];
  if (!model) {
    yield { type: 'error', error: `Unknown model: ${modelId}` };
    return;
  }

  const apiKey = process.env[model.apiKeyEnv];
  if (!apiKey) {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const preview = typeof lastMsg === 'string' ? lastMsg.slice(0, 100) : '(attachments)';
    const mockResponse = `Hello! I'm Axion AI. You said: "${preview}". To enable AI responses, set \`${model.apiKeyEnv}\` in Vercel with a Groq API key. Until then, I'm running in offline demo mode.`;
    for (const char of mockResponse) {
      yield { type: 'token', content: char };
      await new Promise((r) => setTimeout(r, 15));
    }
    yield { type: 'done' };
    return;
  }

  const cleanMessages = messages.map(({ role, content }) => ({
    role,
    content: normalizeContent(content),
  }));

  const body: any = {
    model: model.underlying,
    messages: cleanMessages,
    stream: true,
    max_tokens: model.maxTokens || 4096,
  };

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        yield { type: 'error', error: 'RATE_LIMITED' };
      } else {
        const text = await response.text();
        yield { type: 'error', error: `API error: ${text}` };
      }
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      yield { type: 'error', error: 'No response body' };
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const jsonStr = trimmed.slice(6);
        if (jsonStr === '[DONE]') continue;

        try {
          const json = JSON.parse(jsonStr);
          const content = json.choices?.[0]?.delta?.content || '';
          const reasoning = json.choices?.[0]?.delta?.reasoning_content || '';

          if (reasoning) {
            yield { type: 'reasoning', content: reasoning };
          }
          if (content) {
            yield { type: 'token', content };
          }
        } catch {
          // skip
        }
      }
    }

    yield { type: 'done' };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      yield { type: 'done' };
    } else {
      yield { type: 'error', error: err.message };
    }
  }
}
