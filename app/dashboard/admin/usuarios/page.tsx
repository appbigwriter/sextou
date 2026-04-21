import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminToggleButton } from "@/components/admin-toggle-button"
import { LogoutButton } from "@/components/logout-button"
import { Prisma } from "@prisma/client"

interface UsersPageProps {
  searchParams?: {
    page?: string
    search?: string
  }
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const adminEmail = session.user.email
  const isUserAdmin = await isAdmin(adminEmail)

  if (!isUserAdmin) {
    redirect("/dashboard")
  }

  const page = parseInt(searchParams?.page || "1")
  const limit = 20
  const search = searchParams?.search || ""

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { businessName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        businessName: true,
        whatsapp: true,
        city: true,
        state: true,
        isAdmin: true,
        isVip: true,
        status: true,
        createdAt: true,
        _count: {
          select: { ads: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <LogoutButton />
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-[#F97316]">
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Gerenciar Usuários
            </h1>
            <p className="text-gray-600">{total} usuário(s) cadastrado(s)</p>
          </div>
          <Link
            href="/dashboard/admin/novo-usuario"
            className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg font-medium text-sm"
          >
            + Novo Usuário
          </Link>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-4 border-b">
            <form className="flex gap-2">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Buscar por nome, email ou empresa..."
                className="flex-1 px-4 py-2 border rounded-lg text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="divide-y">
            {users.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum usuário encontrado
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                      {user.isAdmin && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                      {user.isVip && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      {user.businessName} • {user.city}/{user.state} • {user._count.ads} anúncio(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <AdminToggleButton userId={user.id} isAdmin={user.isAdmin} />
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/admin/usuarios?page=${page - 1}&search=${search}`}
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                >
                  Anterior
                </Link>
              )}
              <span className="px-3 py-1 text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/dashboard/admin/usuarios?page=${page + 1}&search=${search}`}
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                >
                  Proxima
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}