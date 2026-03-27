import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCategories } from "@/lib/queries/categories";
import { NewServiceForm } from "@/components/provider/NewServiceForm";

export const metadata: Metadata = { title: "Cadastrar Serviço" };

export default async function NewServicePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "PROVIDER") redirect("/login");

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Cadastrar novo serviço</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <NewServiceForm categories={categories} />
      </div>
    </div>
  );
}
