import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand-600">
            ServiHub
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Entrar na conta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Não tem conta?{" "}
            <Link href="/register" className="text-brand-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
