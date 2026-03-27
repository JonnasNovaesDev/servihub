"use client";

import { useState } from "react";
import type { Category } from "@repo/database";

import { Input, Button } from "@repo/ui";
import { createService } from "@/lib/actions/services";

interface NewServiceFormProps {
  categories: Category[];
}

export function NewServiceForm({ categories }: NewServiceFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await createService({
      categoryId: formData.get("categoryId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priceFrom: Number(formData.get("priceFrom")),
      priceUnit: formData.get("priceUnit") as "HOUR" | "DAY" | "FIXED",
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
          Categoria
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Input name="title" label="Título do serviço" placeholder="Ex: Limpeza residencial completa" required />

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          placeholder="Descreva o serviço em detalhes..."
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="priceFrom"
          type="number"
          label="Preço a partir de (R$)"
          placeholder="150"
          min="1"
          step="0.01"
          required
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="priceUnit" className="text-sm font-medium text-gray-700">
            Unidade de preço
          </label>
          <select
            id="priceUnit"
            name="priceUnit"
            required
            className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="FIXED">Valor fixo</option>
            <option value="HOUR">Por hora</option>
            <option value="DAY">Por dia</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Salvando..." : "Publicar serviço"}
      </Button>
    </form>
  );
}
