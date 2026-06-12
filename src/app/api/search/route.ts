import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 });
    }

    const tavilyKey = process.env.TAVILY_API_KEY;
    const serperKey = process.env.SERPER_API_KEY;

    if (tavilyKey) {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: "advanced",
          max_results: 8,
        }),
      });

      const data = await response.json();
      return Response.json({ sources: data.results || [] });
    }

    if (serperKey) {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": serperKey,
        },
        body: JSON.stringify({ q: query, num: 8 }),
      });

      const data = await response.json();
      const sources = (data.organic || []).map((r: { title: string; link: string; snippet: string }) => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet,
      }));

      return Response.json({ sources });
    }

    return new Response(
      JSON.stringify({ error: "No search API key configured. Set TAVILY_API_KEY or SERPER_API_KEY." }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Search API error:", error);
    return new Response(JSON.stringify({ error: "Search failed" }), { status: 500 });
  }
}
