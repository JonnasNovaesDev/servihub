import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@repo/database";
import { getFeaturedServices, searchServices } from "@/lib/queries/services";
import { createServiceSchema } from "@/lib/validations/service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const limit = Number(searchParams.get("limit")) || undefined;

    const services = q || category
      ? await searchServices({ q, category, limit })
      : await getFeaturedServices(limit);

    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PROVIDER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!providerProfile) {
      return NextResponse.json(
        { error: "Perfil de prestador não encontrado" },
        { status: 404 }
      );
    }

    const service = await prisma.service.create({
      data: { ...parsed.data, providerId: providerProfile.id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
