import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  const key = `chat:${sessionId}`;
  const data = await redis.get<string>(key);

  if (!data) {
    return Response.json({ ok: false, reason: "No redis data" });
  }

  let parsed: { messages: { role: string; content: string; createdAt: number }[] };
  try {
    parsed = JSON.parse(data);
  } catch {
    return Response.json({ ok: false, reason: "Invalid JSON in redis" });
  }

  if (!parsed.messages || !Array.isArray(parsed.messages)) {
    return Response.json({ ok: false, reason: "No messages array" });
  }

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { data: parsed.messages },
  });

  await redis.del(key);

  return Response.json({ ok: true });
}
