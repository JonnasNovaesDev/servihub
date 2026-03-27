import Link from "next/link";

import { getCategories } from "@/lib/queries/categories";
import { getFeaturedServices } from "@/lib/queries/services";
import { formatCurrency } from "@repo/utils";
import { Badge } from "@repo/ui";

export default async function HomePage() {
  const [categories, featuredServices] = await Promise.all([
    getCategories(),
    getFeaturedServices(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 px-4 py-20 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Encontre o serviço que você precisa
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-brand-100">
          Prestadores verificados, avaliações reais e contratação simples — tudo em um lugar.
        </p>
        <form action="/services" className="mx-auto flex max-w-lg gap-2">
          <input
            name="q"
            type="search"
            placeholder="Buscar serviço (ex: limpeza, encanador, aulas...)"
            className="flex-1 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
          >
            Buscar
          </button>
        </form>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Categorias em destaque</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/services?category=${category.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
            >
              <span className="text-3xl">📦</span>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Serviços em destaque */}
      {featuredServices.length > 0 && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Serviços em destaque</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <Badge variant="default">{service.category.name}</Badge>
                    <span className="text-sm text-gray-500">
                      ⭐ {service.provider.rating.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900">{service.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-600">
                      A partir de {formatCurrency(Number(service.priceFrom))}
                    </span>
                    <span className="text-xs text-gray-500">por {service.provider.user.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Prestador */}
      <section className="bg-brand-50 px-4 py-16 text-center">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          Você é prestador de serviço?
        </h2>
        <p className="mb-6 text-gray-600">
          Crie seu perfil, divulgue seus serviços e comece a receber solicitações hoje.
        </p>
        <Link
          href="/register?role=provider"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Cadastrar como prestador
        </Link>
      </section>
    </main>
  );
}
