"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input, Button } from "@repo/ui";
import { registerUser } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";

interface RegisterFormProps {
  defaultRole: "CLIENT" | "PROVIDER";
}

export function RegisterForm({ defaultRole }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await registerUser({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: (formData.get("phone") as string) || undefined,
      role: defaultRole,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    router.refresh();
    router.push(defaultRole === "PROVIDER" ? "/provider/dashboard" : "/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input name="name" label="Nome completo" placeholder="João Silva" required />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="seu@email.com"
        required
        autoComplete="email"
      />
      <Input
        name="phone"
        type="tel"
        label="Telefone"
        placeholder="(11) 91234-5678"
      />
      <Input
        name="password"
        type="password"
        label="Senha"
        placeholder="Mínimo 8 caracteres"
        required
        autoComplete="new-password"
        hint="Deve conter letra maiúscula e número"
      />
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}
      <Button type="submit" disabled={loading} className="mt-2 w-full">
        {loading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
