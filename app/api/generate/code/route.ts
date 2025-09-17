import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SCAFFOLD_SYSTEM_PROMPT } from "@/lib/prompts/scaffold-prompt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { chatId, prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid prompt" },
        { status: 400 }
      );
    }

    if (!chatId) {
      return NextResponse.json(
        { error: "Missing chatId" },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SCAFFOLD_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    let text = chatCompletion.choices[0]?.message?.content || "";

    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No valid JSON object found in response");
    }

    const config = JSON.parse(match[0]);

    if (!Array.isArray(config.files)) {
      throw new Error("Invalid response: files is not an array");
    }

    console.log("code BE - ", config.files)

    return NextResponse.json({
      bot: {
        messages: "here is your code",
        code: config.files,
      },
    });
  } catch (err) {
    console.error("Error in /api/generate/code:", err);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
