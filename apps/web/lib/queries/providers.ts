import { prisma } from "@repo/database";

export async function getProviderById(userId: string) {
  return prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { name: true, avatarUrl: true, phone: true } },
      services: {
        where: { isActive: true },
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
