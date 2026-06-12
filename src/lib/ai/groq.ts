import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.js";

let groqInstance: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
}

export async function createGroqStream(
  model: string,
  messages: ChatCompletionMessageParam[],
  maxTokens: number = 8192
) {
  const groq = getGroqClient();

  const stream = await groq.chat.completions.create({
    model,
    messages,
    stream: true,
    max_tokens: maxTokens,
  });

  return stream;
}
