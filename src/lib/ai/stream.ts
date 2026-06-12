import { createGroqStream } from "./groq";
import { createGeminiStream } from "./gemini";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.js";

export async function createStreamResponse(
  provider: "groq" | "gemini",
  model: string,
  messages: ChatCompletionMessageParam[]
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
    const geminiMessages = messages.map(m => ({ role: String(m.role), content: typeof m.content === "string" ? m.content : "" }));
    const stream = await createGeminiStream(model, geminiMessages);

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
