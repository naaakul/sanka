import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a short title (2-4 words) summarizing this chat prompt: "${prompt}". 
                  Only return the title, nothing else.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const title =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Untitled";

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Error creating title:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 }
    );
  }
}
