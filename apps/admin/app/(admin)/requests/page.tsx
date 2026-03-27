import type { Metadata } from "next";
import { prisma } from "@repo/database";
import { formatDate } from "@repo/utils";
import { Badge } from "@repo/ui";

export const metadata: Metadata = { title: "Solicitações" };

const statusLabel: Record<string, string> = {
  PENDING: "Aguardando",
  ACCEPTED: "Aceito",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const statusVariant: Record<
  string,
  "pending" | "accepted" | "inProgress" | "completed" | "cancelled"
> = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export default async function AdminRequestsPage() {
  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true } },
      service: {
        include: { provider: { include: { user: { select: { name: true } } } } },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Solicitações{" "}
        <span className="text-base font-normal text-gray-400">({requests.length})</span>
      </h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Serviço</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Cliente</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Prestador</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{req.service.title}</td>
                <td className="px-6 py-4 text-gray-600">{req.client.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {req.service.provider.user.name}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusVariant[req.status]}>
                    {statusLabel[req.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gray-400">{formatDate(req.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
