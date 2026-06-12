import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio) {
      return new Response(JSON.stringify({ error: "No audio provided" }), { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;

    if (groqKey) {
      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      return Response.json({ text: data.text || "" });
    }

    return new Response(
      JSON.stringify({ error: "Voice transcription not configured" }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Voice API error:", error);
    return new Response(JSON.stringify({ error: "Transcription failed" }), { status: 500 });
  }
}
