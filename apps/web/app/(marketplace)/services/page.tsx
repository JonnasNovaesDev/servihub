import type { Metadata } from "next";

import { searchServices } from "@/lib/queries/services";
import { getCategories } from "@/lib/queries/categories";
import { formatCurrency } from "@repo/utils";
import { Badge } from "@repo/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Serviços",
};

interface ServicesPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { q, category } = await searchParams;

  const [services, categories] = await Promise.all([
    searchServices({ q, category }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `Resultados para "${q}"` : "Todos os serviços"}
        </h1>
        <span className="text-sm text-gray-500">{services.length} serviços encontrados</span>
      </div>

      {/* Filtro por categoria */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            !category
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-brand-50"
          }`}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/services?category=${cat.slug}`}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              category === cat.slug
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-brand-50"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="text-lg">Nenhum serviço encontrado.</p>
          <Link href="/services" className="mt-2 text-brand-600 hover:underline">
            Ver todos os serviços
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <Badge variant="default">{service.category.name}</Badge>
                <span className="text-sm text-gray-500">
                  ⭐ {service.provider.rating.toFixed(1)} ({service.provider.reviewCount})
                </span>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">{service.title}</h3>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-600">
                  A partir de {formatCurrency(Number(service.priceFrom))}
                </span>
                <span className="text-xs text-gray-500">{service.provider.user.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
