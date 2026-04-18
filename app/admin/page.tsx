import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await auth()
  
  // Por agora, permitir acesso se logado (depois adicionar verificação de role)
  if (!session?.user?.email) {
    redirect("/login")
  }

  const [totalAds, pendingAds, publishedAds, totalUsers] = await Promise.all([
    prisma.ad.count(),
    prisma.ad.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.ad.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
  ])

  const recentAds = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      user: {
        select: { fullName: true, businessName: true },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-8 w-auto object-contain" />
            </Link>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
              ADMIN
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-[#F97316] font-medium">Dashboard</Link>
            <Link href="/admin/anuncios" className="text-gray-600 hover:text-[#F97316]">Anúncios</Link>
            <Link href="/admin/usuarios" className="text-gray-600 hover:text-[#F97316]">Usuários</Link>
            <Link href="/admin/categorias" className="text-gray-600 hover:text-[#F97316]">Categorias</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{totalAds}</div>
            <div className="text-sm text-gray-600">Total Anúncios</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{pendingAds}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-green-600">{publishedAds}</div>
            <div className="text-sm text-gray-600">Publicados</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
            <div className="text-sm text-gray-600">Anunciantes</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/anuncios?status=UNDER_REVIEW"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-yellow-500 transition group"
          >
            <div className="text-4xl mb-3">⏳</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600">Anúncios Pendentes</h3>
            <p className="text-sm text-gray-600">{pendingAds} aguardando análise</p>
          </Link>
          <Link
            href="/admin/usuarios"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-blue-500 transition group"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Gerenciar Usuários</h3>
            <p className="text-sm text-gray-600">{totalUsers} anunciantes</p>
          </Link>
          <Link
            href="/admin/categorias"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-purple-500 transition group"
          >
            <div className="text-4xl mb-3">📂</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Categorias</h3>
            <p className="text-sm text-gray-600">Gerenciar categorias</p>
          </Link>
        </div>

        {/* Recent Ads */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-heading font-semibold text-lg">Anúncios Recentes</h2>
            <Link href="/admin/anuncios" className="text-sm text-[#F97316] hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y">
            {recentAds.map((ad) => (
              <div key={ad.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h3 className="font-medium text-gray-900">{ad.title}</h3>
                  <p className="text-sm text-gray-500">
                    {ad.user.businessName} • {new Date(ad.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ad.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : ad.status === "UNDER_REVIEW"
                      ? "bg-yellow-100 text-yellow-700"
                      : ad.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ad.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}