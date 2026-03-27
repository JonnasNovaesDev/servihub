import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getServiceById } from "@/lib/queries/services";
import { formatCurrency, formatDate } from "@repo/utils";
import { Badge, Button } from "@repo/ui";

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) return { title: "Serviço não encontrado" };
  return { title: service.title };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) notFound();

  const priceUnitLabel: Record<string, string> = {
    HOUR: "por hora",
    DAY: "por dia",
    FIXED: "valor fixo",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="default">{service.category.name}</Badge>
            {!service.isActive && <Badge variant="cancelled">Indisponível</Badge>}
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900">{service.title}</h1>
          <p className="mb-6 text-gray-600 leading-relaxed">{service.description}</p>

          {/* Avaliações */}
          {service.requests.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Avaliações</h2>
              <div className="space-y-4">
                {service.requests
                  .filter((r) => r.review)
                  .map((request) => (
                    <div
                      key={request.id}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-medium text-gray-900">{request.client.name}</span>
                        <span className="text-yellow-500">
                          {"★".repeat(request.review!.rating)}
                          {"☆".repeat(5 - request.review!.rating)}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                          {formatDate(request.review!.createdAt)}
                        </span>
                      </div>
                      {request.review!.comment && (
                        <p className="text-sm text-gray-600">{request.review!.comment}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Card de contratação */}
          <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-gray-500">A partir de</p>
              <p className="text-3xl font-bold text-brand-600">
                {formatCurrency(Number(service.priceFrom))}
              </p>
              <p className="text-sm text-gray-400">{priceUnitLabel[service.priceUnit]}</p>
            </div>
            <Link href={`/request/${service.id}`}>
              <Button className="w-full" size="lg">
                Solicitar serviço
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-gray-400">
              Sem compromisso — combine os detalhes direto com o prestador
            </p>
          </div>

          {/* Card do prestador */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Prestador</h3>
            <Link
              href={`/providers/${service.provider.userId}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-600">
                {service.provider.user.name[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">{service.provider.user.name}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>⭐ {service.provider.rating.toFixed(1)}</span>
                  <span>·</span>
                  <span>{service.provider.reviewCount} avaliações</span>
                </div>
              </div>
            </Link>
            {service.provider.isVerified && (
              <div className="mt-3">
                <Badge variant="verified">✓ Identidade verificada</Badge>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
