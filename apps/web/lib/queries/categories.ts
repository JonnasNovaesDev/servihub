import { prisma } from "@repo/database";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}
