import { redis } from "@/lib/redis";
import { auth } from "@/utils/auth-helpers";
import { ChatSession } from "@/lib/types/codeChat.types";

export async function POST(req: Request) {
  try {
    const { sessionId, chat } = (await req.json()) as {
      sessionId: string;
      chat: ChatSession;
    };

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return Response.json({ ok: false, reason: "Unauthorized" }, { status: 401 });
    }

    const key = `chat:${sessionId}`;

    const existing = await redis.get<string>(key);
    let merged: ChatSession;

    if (existing) {
      try {
        const parsed: ChatSession = JSON.parse(existing);
        merged = {
          ...parsed,
          turns: [...parsed.turns, ...chat.turns],
        };
      } catch {
        merged = chat;
      }
    } else {
      merged = chat;
    }

    const jsonStr = JSON.stringify(merged);
    const sizeBytes = Buffer.byteLength(jsonStr, "utf8");

    if (sizeBytes > 20 * 1024 * 1024) {
      try {
        await fetch(`${process.env.BETTER_AUTH_URL}/api/generate/code/chat/flush`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (flushErr) {
        console.error("Flush failed:", flushErr);
      }
    } else {
      await redis.set(key, jsonStr, { ex: 60 * 60 });
    }

    return Response.json({ ok: true, chat: merged });
  } catch (err) {
    console.error("Error storing chat:", err);
    return Response.json({ ok: false, reason: "Server error" }, { status: 500 });
  }
}
