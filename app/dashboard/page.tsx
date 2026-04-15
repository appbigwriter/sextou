import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

interface DashboardPageProps {
  searchParams?: {
    created?: string
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ads: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: { ads: true },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  const stats = {
    totalAds: user._count.ads,
    publishedAds: user.ads.filter((ad: any) => ad.status === "PUBLISHED").length,
    pendingAds: user.ads.filter((ad: any) => ad.status === "UNDER_REVIEW" || ad.status === "AWAITING_PAYMENT").length,
    totalViews: user.ads.reduce((acc: number, ad: any) => acc + ad.viewsCount, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            Sexta do Empreendedor
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Olá, {user.fullName}</span>
            <Link
              href="/dashboard/anunciar"
              className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg font-medium text-sm"
            >
              + Novo Anúncio
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {searchParams?.created === "1" && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
            <p className="font-semibold">Anuncio enviado para analise.</p>
            <p className="text-sm">
              Seu anuncio foi salvo com sucesso e agora aguarda liberacao do admin antes de aparecer na vitrine.
            </p>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Meu Dashboard
          </h1>
          <p className="text-gray-600">Gerencie seus anúncios e configurações</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-[#F97316]">{stats.totalAds}</div>
            <div className="text-sm text-gray-600">Total Anúncios</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stats.publishedAds}</div>
            <div className="text-sm text-gray-600">Publicados</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingAds}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Visualizações</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/dashboard/anunciar"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group"
          >
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Criar Anúncio</h3>
            <p className="text-sm text-gray-600">Publique um novo anúncio</p>
          </Link>
          <Link
            href="/anuncios"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group"
          >
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Ver Vitrine</h3>
            <p className="text-sm text-gray-600">Veja todos os anúncios</p>
          </Link>
          <Link
            href="/dashboard/configuracoes"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group"
          >
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Configurações</h3>
            <p className="text-sm text-gray-600">Edite seu perfil</p>
          </Link>
        </div>

        {/* Recent Ads */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-heading font-semibold text-lg">Meus Anúncios Recentes</h2>
          </div>
          <div className="divide-y">
            {user.ads.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-4">Você ainda não tem anúncios</p>
                <Link
                  href="/dashboard/anunciar"
                  className="text-[#F97316] hover:underline font-medium"
                >
                  Criar primeiro anúncio
                </Link>
              </div>
            ) : (
              user.ads.map((ad: any) => (
                <div key={ad.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{ad.title}</h3>
                    <p className="text-sm text-gray-500">
                      {ad.viewsCount} visualizações •{" "}
                      {ad.offerType} •{" "}
                      {new Date(ad.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
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
                      {ad.status === "PUBLISHED" && "✓ Publicado"}
                      {ad.status === "UNDER_REVIEW" && "⏳ Em Análise"}
                      {ad.status === "REJECTED" && "✕ Rejeitado"}
                      {ad.status === "DRAFT" && "📝 Rascunho"}
                      {ad.status === "AWAITING_PAYMENT" && "💳 Aguardando Pagamento"}
                    </span>
                    <Link
                      href={`/dashboard/anuncios/${ad.id}`}
                      className="text-gray-400 hover:text-[#F97316]"
                    >
                      →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
