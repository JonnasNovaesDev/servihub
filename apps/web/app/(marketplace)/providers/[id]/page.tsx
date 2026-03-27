import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getProviderById } from "@/lib/queries/providers";
import { formatCurrency } from "@repo/utils";
import { Badge } from "@repo/ui";

interface ProviderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { id } = await params;
  const provider = await getProviderById(id);
  if (!provider) return { title: "Prestador não encontrado" };
  return { title: `${provider.user.name} — Prestador` };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { id } = await params;
  const provider = await getProviderById(id);

  if (!provider) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header do perfil */}
      <div className="mb-8 flex items-start gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-600">
          {provider.user.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{provider.user.name}</h1>
            {provider.isVerified && <Badge variant="verified">✓ Verificado</Badge>}
          </div>
          <div className="mt-1 flex items-center gap-2 text-gray-500">
            <span>⭐ {provider.rating.toFixed(1)}</span>
            <span>·</span>
            <span>{provider.reviewCount} avaliações</span>
          </div>
          {provider.bio && <p className="mt-3 text-gray-600">{provider.bio}</p>}
        </div>
      </div>

      {/* Serviços do prestador */}
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Serviços oferecidos</h2>
      {provider.services.length === 0 ? (
        <p className="text-gray-500">Este prestador ainda não publicou serviços.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {provider.services
            .filter((s) => s.isActive)
            .map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
              >
                <Badge variant="default" className="mb-2">
                  {service.category.name}
                </Badge>
                <h3 className="mb-1 font-semibold text-gray-900">{service.title}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">{service.description}</p>
                <span className="font-bold text-brand-600">
                  A partir de {formatCurrency(Number(service.priceFrom))}
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
