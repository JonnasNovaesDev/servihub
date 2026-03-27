import { PrismaClient, UserRole, PriceUnit } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

// Simulação simples de hash para seed — em produção usar bcrypt
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Iniciando seed...");

  // Categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "limpeza" },
      update: {},
      create: { name: "Limpeza", slug: "limpeza", iconName: "sparkles" },
    }),
    prisma.category.upsert({
      where: { slug: "reformas" },
      update: {},
      create: { name: "Reformas", slug: "reformas", iconName: "hammer" },
    }),
    prisma.category.upsert({
      where: { slug: "tecnologia" },
      update: {},
      create: { name: "Tecnologia", slug: "tecnologia", iconName: "laptop" },
    }),
    prisma.category.upsert({
      where: { slug: "beleza" },
      update: {},
      create: { name: "Beleza", slug: "beleza", iconName: "scissors" },
    }),
    prisma.category.upsert({
      where: { slug: "educacao" },
      update: {},
      create: { name: "Educação", slug: "educacao", iconName: "book-open" },
    }),
    prisma.category.upsert({
      where: { slug: "pets" },
      update: {},
      create: { name: "Pets", slug: "pets", iconName: "paw-print" },
    }),
  ]);

  console.log(`✅ ${categories.length} categorias criadas`);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@servihub.com.br" },
    update: {},
    create: {
      name: "Admin ServiHub",
      email: "admin@servihub.com.br",
      passwordHash: hashPassword("Admin@123"),
      role: UserRole.ADMIN,
    },
  });

  console.log(`✅ Admin criado: ${admin.email}`);

  // Prestador de exemplo
  const provider = await prisma.user.upsert({
    where: { email: "prestador@exemplo.com" },
    update: {},
    create: {
      name: "João Silva",
      email: "prestador@exemplo.com",
      passwordHash: hashPassword("Prestador@123"),
      role: UserRole.PROVIDER,
      phone: "11987654321",
      providerProfile: {
        create: {
          bio: "Profissional de limpeza com 10 anos de experiência. Atendo residências e estabelecimentos comerciais.",
          documentNumber: "123.456.789-00",
          isVerified: true,
          rating: 4.8,
          reviewCount: 52,
        },
      },
    },
    include: { providerProfile: true },
  });

  console.log(`✅ Prestador criado: ${provider.email}`);

  // Serviço de exemplo
  if (provider.providerProfile) {
    await prisma.service.upsert({
      where: { id: "seed-service-001" },
      update: {},
      create: {
        id: "seed-service-001",
        providerId: provider.providerProfile.id,
        categoryId: categories[0]!.id,
        title: "Limpeza Residencial Completa",
        description:
          "Serviço de limpeza completa para residências: varrição, lavagem de banheiros, cozinha, quartos e sala.",
        priceFrom: 150.0,
        priceUnit: PriceUnit.FIXED,
        isActive: true,
      },
    });
  }

  // Cliente de exemplo
  const client = await prisma.user.upsert({
    where: { email: "cliente@exemplo.com" },
    update: {},
    create: {
      name: "Maria Souza",
      email: "cliente@exemplo.com",
      passwordHash: hashPassword("Cliente@123"),
      role: UserRole.CLIENT,
      phone: "11912345678",
    },
  });

  console.log(`✅ Cliente criado: ${client.email}`);
  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
