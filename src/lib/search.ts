import { Source } from "@/types";

export async function searchWeb(query: string): Promise<Source[]> {
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
    return (data.results || []).map((r: { title: string; url: string; content?: string; snippet?: string }) => ({
      title: r.title,
      url: r.url,
      snippet: r.content || r.snippet || "",
    }));
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
    return (data.organic || []).map((r: { title: string; link: string; snippet: string }) => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet,
    }));
  }

  return [];
}
