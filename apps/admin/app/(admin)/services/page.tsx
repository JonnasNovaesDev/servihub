import type { Metadata } from "next";
import { prisma } from "@repo/database";
import { formatDate, formatCurrency } from "@repo/utils";
import { Badge } from "@repo/ui";

export const metadata: Metadata = { title: "Serviços" };

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      provider: { include: { user: { select: { name: true } } } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Serviços <span className="text-base font-normal text-gray-400">({services.length})</span>
      </h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Título</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Categoria</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Prestador</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Preço</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{service.title}</td>
                <td className="px-6 py-4">
                  <Badge variant="secondary">{service.category.name}</Badge>
                </td>
                <td className="px-6 py-4 text-gray-600">{service.provider.user.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {formatCurrency(Number(service.priceFrom))}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={service.isActive ? "completed" : "cancelled"}>
                    {service.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gray-400">{formatDate(service.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
