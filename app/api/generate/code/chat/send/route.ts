import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@/utils/auth-helpers";

export async function POST(req: Request) {
  try {
    const { sessionId, role, content } = await req.json();

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return Response.json({ ok: false, reason: "Unauthorized" }, { status: 401 });
    }

    const key = `chat:${sessionId}`;
    const data = await redis.get<string>(key);

    let parsed: any;
    try {
      parsed = data ? JSON.parse(data) : { messages: [], version: 1, updatedAt: Date.now() };
    } catch {
      parsed = { messages: [], version: 1, updatedAt: Date.now() };
    }

    parsed.messages.push({
      role,
      content,
      createdAt: Date.now(),
    });
    parsed.updatedAt = Date.now();

    await redis.set(key, JSON.stringify(parsed), { ex: 60 * 60 * 24 });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Error sending chat:", err);
    return Response.json({ ok: false, reason: "Server error" }, { status: 500 });
  }
}
