import { prisma } from "@repo/database";

export async function getClientRequests(clientId: string) {
  return prisma.serviceRequest.findMany({
    where: { clientId },
    include: {
      service: {
        include: {
          provider: {
            select: { user: { select: { name: true } } },
          },
        },
      },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProviderRequests(userId: string) {
  return prisma.serviceRequest.findMany({
    where: { service: { provider: { userId } } },
    include: {
      service: { select: { id: true, title: true } },
      client: { select: { id: true, name: true } },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
