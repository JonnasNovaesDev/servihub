"use server";

import { redirect } from "next/navigation";
import { prisma } from "@repo/database";
import { auth } from "@/auth";
import { createServiceSchema, createRequestSchema } from "@/lib/validations/service";
import type { CreateServiceInput, CreateRequestInput } from "@/lib/validations/service";

export async function createService(data: CreateServiceInput) {
  const session = await auth();

  if (!session?.user || session.user.role !== "PROVIDER") {
    return { error: "Não autorizado" };
  }

  const parsed = createServiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!providerProfile) {
    return { error: "Perfil de prestador não encontrado" };
  }

  const service = await prisma.service.create({
    data: {
      ...parsed.data,
      providerId: providerProfile.id,
    },
  });

  redirect(`/services/${service.id}`);
}

export async function createServiceRequest(data: CreateRequestInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Você precisa estar logado para solicitar um serviço" };
  }

  const parsed = createRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  await prisma.serviceRequest.create({
    data: {
      clientId: session.user.id,
      serviceId: parsed.data.serviceId,
      message: parsed.data.message,
      scheduledAt: parsed.data.scheduledAt,
    },
  });

  redirect("/dashboard");
}
