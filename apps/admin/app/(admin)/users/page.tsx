import type { Metadata } from "next";
import { prisma } from "@repo/database";
import { formatDate } from "@repo/utils";
import { Badge } from "@repo/ui";

export const metadata: Metadata = { title: "Usuários" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { providerProfile: { select: { isVerified: true } } },
  });

  const roleLabel: Record<string, string> = {
    CLIENT: "Cliente",
    PROVIDER: "Prestador",
    ADMIN: "Admin",
  };

  const roleVariant: Record<string, "default" | "secondary" | "verified"> = {
    CLIENT: "secondary",
    PROVIDER: "default",
    ADMIN: "verified",
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Usuários <span className="text-base font-normal text-gray-400">({users.length})</span>
      </h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Nome</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Perfil</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={roleVariant[user.role]}>{roleLabel[user.role]}</Badge>
                </td>
                <td className="px-6 py-4 text-gray-400">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
