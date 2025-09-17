import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/utils/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = chats.map((chat) => ({
      chatTitle: chat.title ?? "Untitled",
      chatId: chat.id,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}
