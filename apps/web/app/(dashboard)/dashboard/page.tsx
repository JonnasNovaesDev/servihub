import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getClientRequests } from "@/lib/queries/requests";
import { formatDate } from "@repo/utils";
import { Badge } from "@repo/ui";

export const metadata: Metadata = { title: "Meu Painel" };

const statusLabel: Record<string, string> = {
  PENDING: "Aguardando",
  ACCEPTED: "Aceito",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const statusVariant: Record<string, "pending" | "accepted" | "inProgress" | "completed" | "cancelled"> = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role === "PROVIDER") redirect("/provider/dashboard");

  const requests = await getClientRequests(session.user.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Minhas solicitações</h1>
      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="mb-4 text-gray-500">Você ainda não fez nenhuma solicitação.</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Explorar serviços
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/services/${request.service.id}`}
                    className="font-semibold text-gray-900 hover:text-brand-600"
                  >
                    {request.service.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Prestador: {request.service.provider.user.name}
                  </p>
                </div>
                <Badge variant={statusVariant[request.status]}>
                  {statusLabel[request.status]}
                </Badge>
              </div>
              {request.message && (
                <p className="mt-3 text-sm text-gray-600">{request.message}</p>
              )}
              <p className="mt-3 text-xs text-gray-400">
                Solicitado em {formatDate(request.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
