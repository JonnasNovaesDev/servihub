import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "PROVIDER") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-600">
            ServiHub
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/provider/dashboard"
              className="text-gray-600 hover:text-brand-600 transition-colors"
            >
              Painel
            </Link>
            <Link
              href="/provider/services"
              className="text-gray-600 hover:text-brand-600 transition-colors"
            >
              Meus Serviços
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{session.user.name}</span>
            <Link
              href="/api/auth/signout"
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              Sair
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
