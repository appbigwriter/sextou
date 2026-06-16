import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { DeleteAdButton } from "@/components/delete-ad-button"

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

  const userIsAdmin = user.isAdmin || await isAdmin(session.user.email)

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
          <Link href="/" className="flex items-center">
            <img src="/images/logoPNGSextou.png" alt="SEXTOU.biz" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user.fullName}</span>
              <a
                href="/Manual_Afiliado_SEXTOU.pdf"
                download="Manual_Afiliado_SEXTOU.pdf"
                className="flex items-center gap-1.5 border border-[#F97316] text-[#F97316] hover:bg-[#F97316]/10 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Manual do Afiliado
              </a>
              <Link
                href="/dashboard/anunciar"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                + Novo Anúncio
              </Link>
            </div>
            <MobileMenu links={[
              { href: "/", label: "Home" },
              { href: "/anuncios", label: "Ver Vitrine" },
              { href: "/dashboard", label: "Meu Dashboard" },
              { href: "/sextou-tools", label: "Sextou Tools" },
              { href: "/sextou-tools-pro", label: "SextouTools PRO" },
              { href: "/dashboard/afiliados", label: "Meus Afiliados" },
              { href: "/dashboard/dados", label: "Meus Dados" },
              { href: "/Manual_Afiliado_SEXTOU.pdf", label: "📄 Manual do Afiliado" },
              { href: "/dashboard/configuracoes", label: "Configurações" },
              { href: "/dashboard/anunciar", label: "+ Novo Anúncio", isAction: true },
            ]} />
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

        <div className="mb-8 rounded-2xl border border-[#F97316]/20 bg-gradient-to-r from-[#FFF7ED] to-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F97316]">Sextou Tools</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Acesso rapido ao Brazilian Business Toolkit</h2>
              <p className="mt-1 text-sm text-gray-600">
                Use o hub para QR Code, precificacao, ROI, invoices, projetos e o diretorio.
              </p>
            </div>
            <Link
              href="/sextou-tools"
              className="inline-flex items-center justify-center rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#EA580C]"
            >
              Abrir Sextou Tools
            </Link>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[#FF3D57]/20 bg-gradient-to-r from-[#FFF1F3] to-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF3D57]">Novo</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">SextouTools PRO</h2>
              <p className="mt-1 text-sm text-gray-600">
                Nova suite com IA leve para respostas, ofertas, conteudo, propostas e roteiros,
                com uma pagina propria e independente para cada app.
              </p>
            </div>
            <Link
              href="/sextou-tools-pro"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Abrir SextouTools PRO
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-[#F97316]">{stats.totalAds}</div>
            <div className="text-sm text-gray-600">Total Anúncios</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-600">{stats.publishedAds}</div>
            <div className="text-sm text-gray-600">Publicados</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingAds}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Visualizações</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/dashboard/anunciar"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Criar Anúncio</h3>
            <p className="text-sm text-gray-600">Publique um novo anúncio</p>
          </Link>
          <Link
            href="/anuncios"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Ver Vitrine</h3>
            <p className="text-sm text-gray-600">Veja todos os anúncios</p>
          </Link>
          <Link
            href="/dashboard/treinamento"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute top-0 right-0 p-2 bg-gradient-to-bl from-orange-100 to-transparent rounded-bl-xl">⭐</div>
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">SextouTrainning</h3>
            <p className="text-sm text-gray-600">Dicas para fazer um anuncio matador</p>
          </Link>
          <Link
            href="/sextou-tools"
            className="bg-white rounded-xl p-6 border-2 border-[#F97316]/40 shadow-sm hover:border-[#F97316] transition group relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute top-0 right-0 p-2 bg-gradient-to-bl from-orange-100 to-transparent rounded-bl-xl text-xs font-semibold text-[#F97316]">Novo</div>
            <div className="text-4xl mb-3">QR</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Sextou Tools</h3>
            <p className="text-sm text-gray-600">Acesse o Brazilian Business Toolkit</p>
          </Link>
          <Link
            href="/dashboard/afiliados"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Meus Afiliados</h3>
            <p className="text-sm text-gray-600">Compartilhe e ganhe comissões</p>
          </Link>
          <Link
            href="/dashboard/dados"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-3">👤</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Meus Dados</h3>
            <p className="text-sm text-gray-600">Gerencie informações e Zelle</p>
          </Link>
          <Link
            href="/dashboard/configuracoes"
            className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Configurações</h3>
            <p className="text-sm text-gray-600">Preferências do sistema</p>
          </Link>
          {userIsAdmin && (
            <Link
              href="/dashboard/admin/usuarios"
              className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Gerenciar Usuarios</h3>
              <p className="text-sm text-gray-600">Admin: ver e editar</p>
            </Link>
          )}
          {userIsAdmin && (
            <Link
              href="/dashboard/admin/territorios"
              className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Territórios</h3>
              <p className="text-sm text-gray-600">Admin: áreas de afiliados</p>
            </Link>
          )}
          {userIsAdmin && (
            <Link
              href="/dashboard/admin/cidades"
              className="bg-white rounded-xl p-6 border shadow-sm hover:border-[#F97316] transition group flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#F97316]">Cidades</h3>
              <p className="text-sm text-gray-600">Admin: áreas cadastradas</p>
            </Link>
          )}
          {userIsAdmin && (
            <Link
              href="/admin/anuncios"
              className="bg-white rounded-xl p-6 border-2 border-yellow-400 shadow-sm hover:border-yellow-500 transition group flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-semibold text-gray-900">Anuncios Pendentes</h3>
              <p className="text-sm text-gray-600">Revisar anuncios aguardando aprovacao</p>
            </Link>
          )}
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
                <div key={ad.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 gap-4 sm:gap-0">
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
                          : ad.status === "AWAITING_PAYMENT"
                          ? "bg-blue-100 text-blue-700"
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
                      className="text-gray-400 hover:text-[#F97316] p-2"
                    >
                      <span className="text-xl">→</span>
                    </Link>
                    <DeleteAdButton adId={ad.id} adTitle={ad.title} variant="icon" />
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
