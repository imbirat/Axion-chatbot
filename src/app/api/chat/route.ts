import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MODELS } from "@/lib/models";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

function buildSystemPrompt(mode?: string): string {
  const base = "You are Axion AI, a helpful and capable AI assistant.";
  if (mode === "code") return `${base} Focus on writing clean, well-documented code. Use code blocks with language tags.`;
  if (mode === "deepresearch") return `${base} Use the search results provided to give comprehensive, well-sourced answers. Cite your sources.`;
  if (mode === "learn") return `${base} Act as a tutor. Explain concepts clearly with examples. Break down complex topics.`;
  return base;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, modelId, mode } = await req.json();

    const model = MODELS.find((m) => m.id === modelId);
    if (!model) {
      return new Response(JSON.stringify({ error: "Invalid model" }), { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(mode);
    const fullMessages = [{ role: "system", content: systemPrompt }, ...messages];

    if (model.provider === "groq") {
      const stream = await groq.chat.completions.create({
        model: model.modelString,
        messages: fullMessages,
        stream: true,
        max_tokens: 8192,
      });

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
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

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    if (model.provider === "gemini") {
      const geminiModel = genAI.getGenerativeModel({ model: model.modelString });
      const chat = geminiModel.startChat({
        history: fullMessages.slice(0, -1).map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" as const : "user" as const,
          parts: [{ text: m.content }],
        })),
      });

      const result = await chat.sendMessageStream(fullMessages[fullMessages.length - 1].content);

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported provider" }), { status: 400 });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
