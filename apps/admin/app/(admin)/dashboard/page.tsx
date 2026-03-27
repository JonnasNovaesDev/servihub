import type { Metadata } from "next";
import { prisma } from "@repo/database";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [userCount, providerCount, serviceCount, requestCount] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.serviceRequest.count(),
  ]);

  const recentRequests = await prisma.serviceRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true } },
      service: { select: { title: true } },
    },
  });

  const stats = [
    { label: "Clientes", value: userCount, color: "text-blue-600" },
    { label: "Prestadores", value: providerCount, color: "text-purple-600" },
    { label: "Serviços ativos", value: serviceCount, color: "text-brand-600" },
    { label: "Solicitações", value: requestCount, color: "text-orange-600" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">Solicitações recentes</h2>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {recentRequests.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            Nenhuma solicitação ainda.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Serviço</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Cliente</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{req.service.title}</td>
                  <td className="px-6 py-4 text-gray-600">{req.client.name}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
