import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { AdminToggleButton } from "@/components/admin-toggle-button"
import { isConfiguredAdminEmail } from "@/lib/admin"

export const dynamic = "force-dynamic"

export default async function AdminUsuariosPage() {
  const users = (await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { ads: true },
      },
    },
  })) as any[]

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isVip: true } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { isAdmin: true } as any }),
  ])

  const [total, vip, active, admins] = counts

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-8 w-auto object-contain" />
            </Link>
            <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">ADMIN</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-[#F97316]">
              Dashboard
            </Link>
            <Link href="/admin/usuarios" className="font-medium text-[#F97316]">
              Usuarios
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Gerenciamento de Usuarios</h1>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-[#F97316]">{vip}</div>
            <div className="text-sm text-gray-600">VIP</div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{active}</div>
            <div className="text-sm text-gray-600">Ativos</div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{admins}</div>
            <div className="text-sm text-gray-600">Admins no banco</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium text-gray-600">Usuario</th>
                <th className="p-4 text-left font-medium text-gray-600">Empresa</th>
                <th className="p-4 text-left font-medium text-gray-600">Cidade</th>
                <th className="p-4 text-left font-medium text-gray-600">Anuncios</th>
                <th className="p-4 text-left font-medium text-gray-600">Nivel</th>
                <th className="p-4 text-left font-medium text-gray-600">Status</th>
                <th className="p-4 text-left font-medium text-gray-600">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => {
                const isAdmin = Boolean(user.isAdmin) || isConfiguredAdminEmail(user.email)

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="p-4 text-gray-900">{user.businessName}</td>
                    <td className="p-4 text-gray-500">
                      {user.city}, {user.state}
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-[#F97316]/10 px-2 py-1 text-sm font-medium text-[#F97316]">
                        {user._count.ads}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {isAdmin && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                            Admin
                          </span>
                        )}
                        {user.isVip && (
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                            VIP
                          </span>
                        )}
                        {!isAdmin && !user.isVip && <span className="text-gray-300">-</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : user.status === "SUSPENDED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <AdminToggleButton userId={user.id} isAdmin={user.isAdmin} />
                      {isConfiguredAdminEmail(user.email) && (
                        <p className="mt-2 text-xs text-gray-500">Admin tambem liberado por ADMIN_EMAILS.</p>
                      )}
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Nenhum usuario encontrado
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
