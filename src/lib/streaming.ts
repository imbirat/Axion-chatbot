import { StreamChunk } from '@/types/api';
import { MODELS } from '@/config/models.config';

export function createStreamResponse(): { stream: ReadableStream; writer: WritableStreamDefaultWriter<Uint8Array> } {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const writer = {
        write(chunk: string) {
          controller.enqueue(encoder.encode(chunk));
        },
        close() {
          controller.close();
        },
        error(err: Error) {
          controller.error(err);
        },
      };
      streamController = writer;
    },
  });

  let streamController: any;

  return { stream, writer: streamController };
}

export function formatStreamChunk(chunk: StreamChunk): string {
  return `data: ${JSON.stringify(chunk)}\n\n`;
}

function getGroqUrl(model: string): string {
  const base = 'https://api.groq.com/openai/v1/chat/completions';
  return base;
}

function getNvidiaUrl(model: string): string {
  const modelMap: Record<string, string> = {
    'nvidia/glm-5-1': 'nvidia/glm-5-1',
    'nvidia/kimi-k2-6': 'nvidia/kimi-k2-6',
    'nvidia/deepseek-v4-fast': 'nvidia/deepseek-v4-fast',
  };
  const mapped = modelMap[model] || model;
  return `https://integrate.api.nvidia.com/v1/chat/completions`;
}

export async function streamFromProvider(
  modelId: string,
  messages: { role: string; content: string }[],
  onToken: (token: string) => void,
  onReasoning?: (token: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const model = MODELS[modelId];
  if (!model) throw new Error(`Unknown model: ${modelId}`);

  const apiKey = process.env[model.apiKeyEnv];
  if (!apiKey) throw new Error(`Missing API key for ${model.name}`);

  const isNvidia = model.provider === 'nvidia';
  const url = isNvidia ? getNvidiaUrl(model.underlying) : 'https://api.groq.com/openai/v1/chat/completions';

  const body: any = {
    model: model.underlying,
    messages,
    stream: true,
    max_tokens: model.maxTokens || 4096,
  };

  if (model.supportsReasoning && isNvidia) {
    body.stream_options = { include_usage: true };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 429) {
      throw new Error('RATE_LIMITED');
    }
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

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

        if (reasoning && onReasoning) {
          onReasoning(reasoning);
        }
        if (content) {
          onToken(content);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }
}

export async function* generateStream(
  modelId: string,
  messages: { role: string; content: string }[],
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
    const mockResponse = `Hello! I'm Axion AI. You said: "${lastMsg.slice(0, 100)}". To enable AI responses, set the \`${model.apiKeyEnv}\` environment variable in Vercel with a valid API key from ${
      model.provider === 'nvidia' ? 'NVIDIA' : 'Groq'
    }. Until then, I'm running in offline demo mode.`;
    for (const char of mockResponse) {
      yield { type: 'token', content: char };
      await new Promise((r) => setTimeout(r, 15));
    }
    yield { type: 'done' };
    return;
  }

  const isNvidia = model.provider === 'nvidia';
  const url = isNvidia
    ? `https://integrate.api.nvidia.com/v1/chat/completions`
    : 'https://api.groq.com/openai/v1/chat/completions';

  const body: any = {
    model: model.underlying,
    messages,
    stream: true,
    max_tokens: model.maxTokens || 4096,
  };

  try {
    const response = await fetch(url, {
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
