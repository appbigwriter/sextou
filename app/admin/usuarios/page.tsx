import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { ads: true },
      },
    },
  })

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isVip: true } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "SUSPENDED" } }),
  ])

  const [total, vip, active, suspended] = counts

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-8 w-auto object-contain" />
            </Link>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">ADMIN</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-[#F97316]">Dashboard</Link>
            <Link href="/admin/usuarios" className="text-[#F97316] font-medium">Usuários</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciamento de Usuários</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-[#F97316]">{vip}</div>
            <div className="text-sm text-gray-600">VIP</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-green-600">{active}</div>
            <div className="text-sm text-gray-600">Ativos</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-red-600">{suspended}</div>
            <div className="text-sm text-gray-600">Suspensos</div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Usuário</th>
                <th className="text-left p-4 font-medium text-gray-600">Empresa</th>
                <th className="text-left p-4 font-medium text-gray-600">Cidade</th>
                <th className="text-left p-4 font-medium text-gray-600">Anúncios</th>
                <th className="text-left p-4 font-medium text-gray-600">VIP</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4 text-gray-900">{user.businessName}</td>
                  <td className="p-4 text-gray-500">{user.city}, {user.state}</td>
                  <td className="p-4">
                    <span className="bg-[#F97316]/10 text-[#F97316] px-2 py-1 rounded text-sm font-medium">
                      {user._count.ads}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isVip ? (
                      <span className="text-yellow-500">⭐</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                      user.status === "SUSPENDED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}