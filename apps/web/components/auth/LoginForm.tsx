"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Input, Button } from "@repo/ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha incorretos");
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="seu@email.com"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        type="password"
        label="Senha"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}
      <Button type="submit" disabled={loading} className="mt-2 w-full">
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
