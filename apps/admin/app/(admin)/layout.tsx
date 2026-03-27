import Link from "next/link";
import { auth } from "@/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Usuários" },
  { href: "/services", label: "Serviços" },
  { href: "/requests", label: "Solicitações" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-5">
          <p className="text-lg font-bold text-brand-600">ServiHub</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
        <nav className="p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-0 w-56 px-4">
          <p className="truncate text-xs text-gray-400">{session?.user?.email}</p>
          <Link
            href="/api/auth/signout"
            className="mt-1 text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Sair
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl p-8">{children}</div>
      </main>
    </div>
  );
}
