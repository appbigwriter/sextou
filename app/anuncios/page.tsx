import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { SearchFilters } from "@/components/search-filters"

interface Props {
  searchParams: { search?: string; category?: string; city?: string }
}

export const dynamic = 'force-dynamic'

export default async function AnunciosPage({ searchParams }: Props) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  const where: any = { status: "PUBLISHED" }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search } },
      { shortDescription: { contains: searchParams.search } },
    ]
  }

  if (searchParams.category) {
    const cat = categories.find(c => c.slug === searchParams.category)
    if (cat) where.categoryId = cat.id
  }

  if (searchParams.city) {
    where.city = { contains: searchParams.city }
  }

  const ads = await prisma.ad.findMany({
    where,
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            Sexta do Empreendedor
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-700 hover:text-[#F97316] transition font-medium">Home</Link>
            <Link href="/anuncios" className="text-[#F97316] font-medium">Anúncios</Link>
            <Link href="/cadastro" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-2.5 rounded-lg font-semibold transition">
              Anunciar Agora
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Descubra Negócios Incríveis</h1>
          <p className="text-xl mb-6">{ads.length} anúncios ativos • Atualizado toda sexta-feira</p>
        </div>
      </section>

      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <SearchFilters categories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon }))} />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {ads.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum anúncio encontrado</h2>
            <p className="text-gray-600 mb-6">Tente buscar com outros termos ou filtros.</p>
            <Link href="/anuncios" className="inline-block bg-[#F97316] text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-[#EA580C] transition">
              Ver todos os anúncios
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <Link key={ad.id} href={`/anuncios/${ad.id}`} className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#F97316] transition-all hover:shadow-xl overflow-hidden group">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-48 flex items-center justify-center group-hover:from-[#F97316]/10 group-hover:to-[#EA580C]/10 transition">
                  <span className="text-6xl">🏪</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#F97316] bg-[#F97316]/10 px-2 py-1 rounded">{ad.category?.name || "Geral"}</span>
                    {ad.price && ad.price > 0 && <span className="text-2xl font-bold text-[#F97316]">${ad.price}</span>}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#F97316] transition">{ad.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{ad.shortDescription}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>📍 {ad.city}, {ad.state || "USA"}</span>
                    <span className="text-[#F97316] font-bold group-hover:underline">Ver detalhes →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gradient-to-r from-[#F97316] to-[#EA580C] py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Seu Negócio Aqui!</h2>
          <p className="text-xl text-white/80 mb-6">Por apenas US$ 30, alcance milhares de brasileiros</p>
          <Link href="/cadastro" className="inline-block bg-white text-[#F97316] px-8 py-4 rounded-lg text-xl font-bold hover:bg-slate-100 transition transform hover:scale-105">
            Anunciar Agora
          </Link>
        </div>
      </section>

      <footer className="bg-[#101622] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Sexta do Empreendedor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}