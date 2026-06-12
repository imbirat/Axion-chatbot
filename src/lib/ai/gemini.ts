import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
    );
  }
  return genAIInstance;
}

export function getGeminiModel(model: string = "gemini-2.5-flash") {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({ model });
}

export async function createGeminiStream(
  model: string,
  messages: { role: string; content: string }[],
  thinkingBudget?: number
) {
  const genAI = getGeminiClient();
  const geminiModel = genAI.getGenerativeModel({
    model,
    ...(thinkingBudget ? { systemInstruction: { thinkingBudget } } : {}),
  });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user" as const,
    parts: [{ text: m.content }],
  }));

  const chat = geminiModel.startChat({ history });
  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);

  return result.stream;
}
