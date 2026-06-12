import { createGroqStream } from "./groq";
import { createGeminiStream } from "./gemini";

export async function createStreamResponse(
  provider: "groq" | "gemini",
  model: string,
  messages: Record<string, unknown>[]
): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  if (provider === "groq") {
    const stream = await createGroqStream(model, messages);

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });
  }

  if (provider === "gemini") {
    const stream = await createGeminiStream(model, messages);

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
