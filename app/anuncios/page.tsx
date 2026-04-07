import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AnunciosPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  const ads = await prisma.ad.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            Sexta do Empreendedor
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-700 hover:text-[#F97316] transition font-medium">
              Home
            </Link>
            <Link href="/anuncios" className="text-[#F97316] font-medium">
              Anúncios
            </Link>
            <Link 
              href="/cadastro" 
              className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-2.5 rounded-lg font-semibold transition"
            >
              Anunciar Agora
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Descubra Negócios Incríveis
          </h1>
          <p className="text-xl mb-6">
            {ads.length} anúncios ativos • Atualizado toda sexta-feira
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white border-b py-6 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              href="/anuncios"
              className="px-4 py-2 bg-[#F97316] text-white rounded-lg font-bold"
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/anuncios?categoria=${cat.slug}`}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-[#F97316] hover:text-white transition font-semibold"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Anúncios */}
      <section className="container mx-auto px-4 py-12">
        {ads.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum anúncio encontrado</h2>
            <p className="text-gray-600 mb-6">Seja o primeiro a publicar um anúncio!</p>
            <Link
              href="/cadastro"
              className="inline-block bg-[#F97316] text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-[#EA580C] transition"
            >
              Criar meu anúncio
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <Link
                key={ad.id}
                href={`/anuncios/${ad.id}`}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#F97316] transition-all hover:shadow-xl overflow-hidden group"
              >
                {/* Imagem Placeholder */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-48 flex items-center justify-center group-hover:from-[#F97316]/10 group-hover:to-[#EA580C]/10 transition">
                  <span className="text-6xl">🏪</span>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#F97316] bg-[#F97316]/10 px-2 py-1 rounded">
                      {ad.category?.name || "Geral"}
                    </span>
                    {ad.price && ad.price > 0 && (
                      <span className="text-2xl font-bold text-[#F97316]">
                        ${ad.price}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#F97316] transition">
                    {ad.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {ad.shortDescription}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>📍 {ad.city}, {ad.state || "USA"}</span>
                    <span className="text-[#F97316] font-bold group-hover:underline">
                      Ver detalhes →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#F97316] to-[#EA580C] py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Seu Negócio Aqui!
          </h2>
          <p className="text-xl text-white/80 mb-6">
            Por apenas US$ 30, alcance milhares de brasileiros
          </p>
          <Link
            href="/cadastro"
            className="inline-block bg-white text-[#F97316] px-8 py-4 rounded-lg text-xl font-bold hover:bg-slate-100 transition transform hover:scale-105"
          >
            Anunciar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101622] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Sexta do Empreendedor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}