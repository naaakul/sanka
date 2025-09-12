import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth-helpers";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/generate/code/chat/title`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();

    const initialData = {
      turns: [
        {
          user: [prompt],
          bot: { messages: "", code: [] },
        },
      ],
    };

    const chat = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        title: data.title || "Untitled",
        data: initialData,
      },
    });

    const redisKey = `chat:${chat.id}`;
    await redis.set(redisKey, JSON.stringify(initialData), { ex: 60 * 60 });

    return NextResponse.json({ chatId: chat.id });
  } catch (err) {
    console.error("Error creating chat session:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
