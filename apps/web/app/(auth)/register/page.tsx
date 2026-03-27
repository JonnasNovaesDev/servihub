import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Criar conta",
};

interface RegisterPageProps {
  searchParams: Promise<{ role?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { role } = await searchParams;
  const isProvider = role === "provider";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand-600">
            ServiHub
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            {isProvider ? "Cadastrar como prestador" : "Criar conta"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Já tem conta?{" "}
            <Link href="/login" className="text-brand-600 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <RegisterForm defaultRole={isProvider ? "PROVIDER" : "CLIENT"} />
        </div>
      </div>
    </div>
  );
}
