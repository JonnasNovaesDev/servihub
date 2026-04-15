import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@repo/database";
import { getClientRequests, getProviderRequests } from "@/lib/queries/requests";
import { createRequestSchema } from "@/lib/validations/service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const requests =
      session.user.role === "PROVIDER"
        ? await getProviderRequests(session.user.id)
        : await getClientRequests(session.user.id);

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para solicitar um serviço" },
        { status: 401 }
      );
    }

    if (session.user.role === "PROVIDER") {
      return NextResponse.json(
        { error: "Prestadores não podem solicitar serviços" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const serviceExists = await prisma.service.findUnique({
      where: { id: parsed.data.serviceId, isActive: true },
    });

    if (!serviceExists) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        clientId: session.user.id,
        serviceId: parsed.data.serviceId,
        message: parsed.data.message,
        scheduledAt: parsed.data.scheduledAt,
      },
      include: {
        service: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
