import { prisma } from "@repo/database";

const serviceWithRelations = {
  category: { select: { id: true, name: true, slug: true } },
  provider: {
    select: {
      id: true,
      userId: true,
      rating: true,
      reviewCount: true,
      isVerified: true,
      user: { select: { name: true, avatarUrl: true } },
    },
  },
} as const;

export async function getFeaturedServices(limit = 6) {
  return prisma.service.findMany({
    where: { isActive: true },
    include: serviceWithRelations,
    orderBy: [{ provider: { rating: "desc" } }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function searchServices({
  q,
  category,
  limit = 30,
}: {
  q?: string;
  category?: string;
  limit?: number;
}) {
  return prisma.service.findMany({
    where: {
      isActive: true,
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(category && { category: { slug: category } }),
    },
    include: serviceWithRelations,
    orderBy: [{ provider: { rating: "desc" } }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      ...serviceWithRelations,
      requests: {
        where: { status: "COMPLETED" },
        include: {
          client: { select: { name: true } },
          review: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getProviderServices(userId: string) {
  return prisma.service.findMany({
    where: { provider: { userId } },
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
