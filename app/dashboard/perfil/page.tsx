import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ads: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      },
      _count: {
        select: { ads: true, payments: true },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            SEXTOU.biz
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-[#F97316]">Dashboard</Link>
            <Link href="/dashboard/perfil" className="text-[#F97316] font-medium">Perfil</Link>
            <Link href="/dashboard/configuracoes" className="text-gray-600 hover:text-[#F97316]">Configurações</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header do Perfil */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.businessName}</h1>
              <p className="text-gray-600">{user.fullName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📍 {user.city}, {user.state}</span>
                <span>📧 {user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border shadow-sm text-center">
            <div className="text-3xl font-bold text-[#F97316]">{user._count.ads}</div>
            <div className="text-sm text-gray-600">Anúncios</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600">{user.ads.length}</div>
            <div className="text-sm text-gray-600">Publicados</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600">
              {user.ads.reduce((acc, ad) => acc + ad.viewsCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Visualizações</div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Informações de Contato</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">WhatsApp</span>
              <p className="text-gray-900">{user.whatsapp}</p>
            </div>
            {user.instagram && (
              <div>
                <span className="text-sm text-gray-500">Instagram</span>
                <p className="text-gray-900">{user.instagram}</p>
              </div>
            )}
            {user.website && (
              <div>
                <span className="text-sm text-gray-500">Website</span>
                <p className="text-gray-900">{user.website}</p>
              </div>
            )}
          </div>
        </div>

        {/* Meus Anúncios Publicados */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Meus Anúncios Publicados</h2>
          {user.ads.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum anúncio publicado ainda.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {user.ads.map((ad) => (
                <Link
                  key={ad.id}
                  href={`/anuncios/${ad.id}`}
                  className="border rounded-lg p-4 hover:border-[#F97316] transition"
                >
                  <h3 className="font-medium text-gray-900">{ad.title}</h3>
                  <p className="text-sm text-gray-500">{ad.shortDescription}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{ad.viewsCount} visualizações</span>
                    <span>Publicado em {new Date(ad.publishedAt!).toLocaleDateString("pt-BR")}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}