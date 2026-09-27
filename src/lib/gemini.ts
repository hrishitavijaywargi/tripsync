// Minimal Gemini REST client. Runs on the server only (API routes).

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function askGeminiJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY environment variable.");
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  const res = await fetch(`${API_BASE}/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const parts: { text?: string; thought?: boolean }[] = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join("");
  if (!text) throw new Error("Gemini returned an empty response.");

  try {
    return JSON.parse(text) as T;
  } catch {
    // Occasionally the model wraps JSON in a code fence — strip it and retry.
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    return JSON.parse(cleaned) as T;
  }
}
