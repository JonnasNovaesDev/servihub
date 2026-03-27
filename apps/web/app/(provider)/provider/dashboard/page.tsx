import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProviderRequests } from "@/lib/queries/requests";
import { formatDate } from "@repo/utils";
import { Badge, Button } from "@repo/ui";

export const metadata: Metadata = { title: "Painel do Prestador" };

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

export default async function ProviderDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "PROVIDER") redirect("/login");

  const requests = await getProviderRequests(session.user.id);

  const pending = requests.filter((r) => r.status === "PENDING");
  const active = requests.filter((r) => ["ACCEPTED", "IN_PROGRESS"].includes(r.status));
  const completed = requests.filter((r) => r.status === "COMPLETED");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Painel do Prestador</h1>
        <Link href="/provider/services/new">
          <Button size="sm">+ Novo serviço</Button>
        </Link>
      </div>

      {/* Métricas */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Pendentes", value: pending.length, color: "text-yellow-600" },
          { label: "Em andamento", value: active.length, color: "text-blue-600" },
          { label: "Concluídos", value: completed.length, color: "text-brand-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Solicitações recentes */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Solicitações recentes</h2>
      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">Nenhuma solicitação ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.slice(0, 10).map((request) => (
            <div key={request.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{request.service.title}</p>
                  <p className="text-sm text-gray-500">Cliente: {request.client.name}</p>
                </div>
                <Badge variant={statusVariant[request.status]}>
                  {statusLabel[request.status]}
                </Badge>
              </div>
              {request.message && (
                <p className="mt-2 text-sm text-gray-600">{request.message}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">{formatDate(request.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
