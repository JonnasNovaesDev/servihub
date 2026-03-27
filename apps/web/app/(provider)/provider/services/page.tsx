import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProviderServices } from "@/lib/queries/services";
import { formatCurrency } from "@repo/utils";
import { Badge, Button } from "@repo/ui";

export const metadata: Metadata = { title: "Meus Serviços" };

export default async function ProviderServicesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "PROVIDER") redirect("/login");

  const services = await getProviderServices(session.user.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Meus serviços</h1>
        <Link href="/provider/services/new">
          <Button size="sm">+ Adicionar serviço</Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="mb-4 text-gray-500">Você ainda não cadastrou nenhum serviço.</p>
          <Link href="/provider/services/new">
            <Button>Cadastrar primeiro serviço</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="default">{service.category.name}</Badge>
                  {!service.isActive && <Badge variant="cancelled">Inativo</Badge>}
                </div>
                <p className="font-semibold text-gray-900">{service.title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {formatCurrency(Number(service.priceFrom))} ·{" "}
                  {service.priceUnit === "HOUR" ? "por hora" : service.priceUnit === "DAY" ? "por dia" : "valor fixo"}
                </p>
              </div>
              <Link
                href={`/services/${service.id}`}
                className="text-sm text-brand-600 hover:underline"
              >
                Ver página →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
