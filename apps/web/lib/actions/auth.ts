"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { prisma, UserRole } from "@repo/database";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

export async function registerUser(data: RegisterInput) {
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  const { name, email, password, phone, role } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Este email já está cadastrado" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone,
      role: role as UserRole,
    },
  });

  return { success: true };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou senha incorretos" };
    }
    return { error: "Ocorreu um erro. Tente novamente." };
  }
}
