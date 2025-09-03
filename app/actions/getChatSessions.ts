import { prisma } from "@/lib/prisma";

export async function getChatSessions(accountId: string) {
  if (!accountId) return [];

  return prisma.chatSession.findMany({
    where: { accountId },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });
}
