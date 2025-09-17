import { prisma } from "@/lib/prisma";

export async function getChatSessions(userId: string) {
  if (!userId) return [];

  return prisma.chatSession.findMany({
    where: { userId }, 
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });
}
