"use client";

import Link from "next/link";
import type { Session } from "next-auth";

interface NavUserProps {
  session: Session | null;
}

export function NavUser({ session }: NavUserProps) {
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          Cadastrar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={session.user.role === "PROVIDER" ? "/provider/dashboard" : "/dashboard"}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 hover:bg-brand-200 transition-colors"
      >
        {session.user.name?.[0]?.toUpperCase()}
      </Link>
    </div>
  );
}
