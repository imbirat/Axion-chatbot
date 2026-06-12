import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUB_AGENT_MODELS } from "@/lib/models";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const AGENT_SYSTEM_PROMPT = `You are Axion AI Agent mode. You are the primary orchestrator.
You have access to sub-agents that can help with specific tasks.

When you need to write files, use:
<write_file>
<filename>path/to/file.js</filename>
<content>
// code here
</content>
</write_file>

When you need to edit files, describe the changes:
<edit_file>
<filename>path/to/file.js</filename>
<changes>+7 -3</changes>
</edit_file>

When you need to delegate a complex task to a sub-agent, use:
<delegate>
<task>description of what to build</task>
</delegate>

Respond conversationally while orchestrating these operations.`;

const SUB_AGENT_SYSTEM_PROMPT = `You are a sub-agent in the Axion AI system. 
You receive tasks from the primary agent and execute them.
Write complete, working code. Use <write_file> blocks for new files and <edit_file> blocks for edits.

Format:
<write_file>
<filename>path.js</filename>
<content>
code here
</content>
</write_file>`;

function parseAgentOutput(text: string): any[] {
  const events: any[] = [];

  const writeRegex = /<write_file>[\s\S]*?<filename>([\s\S]*?)<\/filename>[\s\S]*?<content>([\s\S]*?)<\/content>[\s\S]*?<\/write_file>/g;
  let match;
  while ((match = writeRegex.exec(text)) !== null) {
    events.push({ type: "write", filename: match[1].trim(), content: match[2].trim() });
  }

  const editRegex = /<edit_file>[\s\S]*?<filename>([\s\S]*?)<\/filename>[\s\S]*?<changes>([\s\S]*?)<\/changes>[\s\S]*?<\/edit_file>/g;
  while ((match = editRegex.exec(text)) !== null) {
    const changes = match[2].trim();
    const addMatch = changes.match(/\+(\d+)/);
    const delMatch = changes.match(/-(\d+)/);
    events.push({
      type: "edit",
      filename: match[1].trim(),
      additions: addMatch ? parseInt(addMatch[1]) : 0,
      deletions: delMatch ? parseInt(delMatch[1]) : 0,
    });
  }

  const delegateRegex = /<delegate>[\s\S]*?<task>([\s\S]*?)<\/task>[\s\S]*?<\/delegate>/g;
  while ((match = delegateRegex.exec(text)) !== null) {
    events.push({ type: "delegate", task: match[1].trim() });
  }

  return events;
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json();

    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: AGENT_SYSTEM_PROMPT,
    });

    const result = await geminiModel.generateContent(message);
    const response = result.response.text();

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const events = parseAgentOutput(response);
        let textCursor = 0;
        let lastPos = 0;

        for (const event of events) {
          const eventIndex = response.indexOf(
            event.type === "write" ? "<write_file>" :
            event.type === "edit" ? "<edit_file>" :
            "<delegate>",
            lastPos
          );

          if (eventIndex > textCursor) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "text", delta: response.slice(textCursor, eventIndex) }) + "\n"));
          }

          if (event.type === "write") {
            controller.enqueue(encoder.encode(JSON.stringify({
              type: "write_start",
              filename: event.filename,
              language: event.filename.split(".").pop() || "text",
            }) + "\n"));
            controller.enqueue(encoder.encode(JSON.stringify({
              type: "write_chunk",
              delta: event.content,
            }) + "\n"));
            controller.enqueue(encoder.encode(JSON.stringify({
              type: "write_done",
              filename: event.filename,
            }) + "\n"));
          } else if (event.type === "edit") {
            controller.enqueue(encoder.encode(JSON.stringify({
              type: "edit",
              filename: event.filename,
              additions: event.additions,
              deletions: event.deletions,
            }) + "\n"));
          } else if (event.type === "delegate") {
            const subModel = SUB_AGENT_MODELS[Math.floor(Math.random() * SUB_AGENT_MODELS.length)];
            controller.enqueue(encoder.encode(JSON.stringify({
              type: "subagent_start",
              model: subModel.id,
              task: event.task,
            }) + "\n"));

            const subResult = await groq.chat.completions.create({
              model: subModel.modelString,
              messages: [
                { role: "system", content: SUB_AGENT_SYSTEM_PROMPT },
                { role: "user", content: event.task },
              ],
              max_tokens: 4096,
            });

            const subResponse = subResult.choices[0]?.message?.content || "";
            const subEvents = parseAgentOutput(subResponse);

            for (const subEvent of subEvents) {
              if (subEvent.type === "write") {
                controller.enqueue(encoder.encode(JSON.stringify({
                  type: "subagent_write_start",
                  filename: subEvent.filename,
                  language: subEvent.filename.split(".").pop() || "text",
                }) + "\n"));
                controller.enqueue(encoder.encode(JSON.stringify({
                  type: "subagent_write_chunk",
                  delta: subEvent.content,
                }) + "\n"));
                controller.enqueue(encoder.encode(JSON.stringify({
                  type: "subagent_write_done",
                  filename: subEvent.filename,
                }) + "\n"));
              } else if (subEvent.type === "edit") {
                controller.enqueue(encoder.encode(JSON.stringify({
                  type: "subagent_edit",
                  filename: subEvent.filename,
                  additions: subEvent.additions,
                  deletions: subEvent.deletions,
                }) + "\n"));
              }
            }

            controller.enqueue(encoder.encode(JSON.stringify({
              type: "subagent_done",
              summary: `Completed task: ${event.task}`,
            }) + "\n"));
          }

          const closingTag = event.type === "write" ? "</write_file>" :
            event.type === "edit" ? "</edit_file>" : "</delegate>";

          const closeIndex = response.indexOf(closingTag, eventIndex);
          if (closeIndex > -1) {
            textCursor = closeIndex + closingTag.length;
          }
          lastPos = textCursor;
        }

        if (textCursor < response.length) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: "text", delta: response.slice(textCursor) }) + "\n"));
        }

        controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Agent API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
