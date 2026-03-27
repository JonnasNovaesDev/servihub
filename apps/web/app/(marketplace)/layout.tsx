import Link from "next/link";

import { auth } from "@/auth";
import { NavUser } from "@/components/nav/NavUser";

export default async function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-600">
            ServiHub
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
            <Link href="/services" className="hover:text-brand-600 transition-colors">
              Serviços
            </Link>
            {session?.user.role === "PROVIDER" && (
              <Link href="/provider/dashboard" className="hover:text-brand-600 transition-colors">
                Meu Painel
              </Link>
            )}
          </nav>
          <NavUser session={session} />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
