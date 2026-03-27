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

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciais inválidas ou sem permissão de admin");
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
        placeholder="admin@servihub.com.br"
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
        {loading ? "Entrando..." : "Acessar painel"}
      </Button>
    </form>
  );
}
