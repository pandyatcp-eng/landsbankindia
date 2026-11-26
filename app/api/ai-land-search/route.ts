import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt || prompt.length > 1200) return NextResponse.json({ error: "Enter a search request up to 1,200 characters." }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AI search is not configured yet. Add OPENAI_API_KEY on the server." }, { status: 503 });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Convert the user's land search request into a compact JSON object with keys: keywords (string), category (one of agricultural, industrial, residential, commercial, other, or empty string), state (string), district (string), max_budget_inr (number or null), area_requirement (string), and clarification_questions (array of strings). Do not invent missing details. Do not make legal, title, valuation, or investment claims. Return JSON only." },
          { role: "user", content: prompt }
        ]
      })
    });
    const payload = await response.json();
    if (!response.ok) return NextResponse.json({ error: "AI provider request failed.", details: payload?.error?.message || "Unknown provider error." }, { status: 502 });
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: "AI returned an empty response." }, { status: 502 });
    return NextResponse.json({ interpretation: JSON.parse(content) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI search failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
