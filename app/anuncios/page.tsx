import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getActiveCategories } from "@/lib/default-categories"
import { isDatabaseUnavailableError } from "@/lib/prisma-guards"
import { SearchFilters } from "@/components/search-filters"
import { MobileMenu } from "@/components/layout/mobile-menu"

interface Props {
  searchParams: { search?: string; category?: string; city?: string; lat?: string; lng?: string }
}

export const dynamic = "force-dynamic"

export default async function AnunciosPage({ searchParams }: Props) {
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = []
  let ads: any[] = []
  let adDistances: Record<string, number> = {}
  let isDatabaseUnavailable = false

  try {
    categories = await getActiveCategories()

    const where: Record<string, unknown> = { status: "PUBLISHED" }

    if (searchParams.search) {
      where.OR = [
        { title: { contains: searchParams.search } },
        { shortDescription: { contains: searchParams.search } },
      ]
    }

    if (searchParams.category) {
      const category = categories.find((item) => item.slug === searchParams.category)
      if (category) {
        where.categoryId = category.id
      }
    }

    if (searchParams.city) {
      where.city = { contains: searchParams.city }
    }

    if (searchParams.lat && searchParams.lng) {
      const userLat = parseFloat(searchParams.lat)
      const userLng = parseFloat(searchParams.lng)

      const adsWithCoords = await prisma.ad.findMany({
        where: {
          ...where,
          latitude: { not: null },
          longitude: { not: null },
        },
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
            take: 1,
          },
        },
        take: 200,
      })

      const toRad = (value: number) => (value * Math.PI) / 180
      const R = 6371

      adsWithCoords.forEach((ad) => {
        const dLat = toRad(ad.latitude! - userLat)
        const dLon = toRad(ad.longitude! - userLng)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(userLat)) *
            Math.cos(toRad(ad.latitude!)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c
        adDistances[ad.id] = distance
      })

      ads = adsWithCoords
        .sort((a, b) => adDistances[a.id] - adDistances[b.id])
        .slice(0, 50)
    } else {
      ads = await prisma.ad.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
            take: 1,
          },
        },
        orderBy: { publishedAt: "desc" },
        take: 50,
      })
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error
    }

    isDatabaseUnavailable = true
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link href="/" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Home
            </Link>
            <Link href="/anuncios" className="font-medium text-[#F97316]">
              Anuncios
            </Link>
            <Link href="/videos" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Vídeos
            </Link>
            <Link href="/como-funciona" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Como Funciona
            </Link>
            <Link
              href="/cadastro"
              className="rounded-lg bg-[#F97316] px-6 py-2.5 font-semibold text-white transition hover:bg-[#EA580C]"
            >
              Anunciar Agora
            </Link>
          </nav>
          <MobileMenu 
            links={[
              { href: "/", label: "Home" },
              { href: "/anuncios", label: "Anuncios" },
              { href: "/videos", label: "Vídeos" },
              { href: "/como-funciona", label: "Como Funciona" },
              { href: "/login", label: "Entrar" },
              { href: "/cadastro", label: "Anunciar Agora", isAction: true },
            ]}
          />
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A] py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Descubra Negocios Incriveis</h1>
          <p className="text-xl">{ads.length} anuncios ativos • Atualizado toda sexta-feira</p>
        </div>
      </section>

      <section className="border-b bg-white py-6">
        <div className="container mx-auto px-4">
          {isDatabaseUnavailable && (
            <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              A vitrine esta temporariamente operando em modo reduzido. Os filtros e anuncios podem nao carregar enquanto os dados sao estabilizados.
            </div>
          )}
          <SearchFilters
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              icon: category.icon,
            }))}
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {ads.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">Nenhum anuncio</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Nenhum anuncio encontrado</h2>
            <p className="mb-6 text-gray-600">Tente buscar com outros termos ou filtros.</p>
            <Link
              href="/anuncios"
              className="inline-block rounded-lg bg-[#F97316] px-8 py-4 text-xl font-bold text-white transition hover:bg-[#EA580C]"
            >
              Ver todos os anuncios
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => {
              const isHorizontal = ad.imageOrientation === "HORIZONTAL"

              if (isHorizontal) {
                // Layout Horizontal (16:9) — imagem no topo, texto abaixo
                return (
                  <Link
                    key={ad.id}
                    href={`/anuncios/${ad.id}`}
                    className="group overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all hover:border-[#F97316] hover:shadow-xl flex flex-col"
                  >
                    {ad.images[0] ? (
                      <div className="overflow-hidden bg-slate-100" style={{ aspectRatio: "16/9" }}>
                        <img
                          src={ad.images[0].imageUrl}
                          alt={ad.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 transition group-hover:from-[#F97316]/10 group-hover:to-[#EA580C]/10"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <span className="text-6xl">🏪</span>
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded bg-[#F97316]/10 px-2 py-1 text-xs font-bold text-[#F97316]">
                            {ad.category?.name || "Geral"}
                          </span>
                          {adDistances[ad.id] !== undefined && (
                            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                              📍 a {adDistances[ad.id] < 1 ? "< 1" : adDistances[ad.id].toFixed(1)} km
                            </span>
                          )}
                        </div>
                        {ad.price && ad.price > 0 && (
                          <span className="text-xl font-bold text-[#F97316] whitespace-nowrap">${ad.price.toFixed(2)}</span>
                        )}
                      </div>
                      <h3 className="mb-1 text-lg font-bold text-gray-900 transition group-hover:text-[#F97316] line-clamp-2">
                        {ad.title}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600 flex-1">{ad.shortDescription}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{ad.city}, {ad.state || "USA"}</span>
                        <span className="font-bold text-[#F97316] group-hover:underline">Ver detalhes →</span>
                      </div>
                    </div>
                  </Link>
                )
              }

              // Layout Vertical (9:16 ou 1:1) — imagem lateral esquerda, texto à direita
              return (
                <Link
                  key={ad.id}
                  href={`/anuncios/${ad.id}`}
                  className="group overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all hover:border-[#F97316] hover:shadow-xl flex flex-row"
                >
                  {ad.images[0] ? (
                    <div className="bg-slate-100 flex-shrink-0 self-stretch" style={{ width: "110px" }}>
                      <img
                        src={ad.images[0].imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-contain block"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 transition group-hover:from-[#F97316]/10 group-hover:to-[#EA580C]/10 flex-shrink-0"
                      style={{ width: "110px", minHeight: "160px" }}
                    >
                      <span className="text-4xl">🏪</span>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap gap-1">
                      <span className="rounded bg-[#F97316]/10 px-2 py-0.5 text-xs font-bold text-[#F97316]">
                        {ad.category?.name || "Geral"}
                      </span>
                      {adDistances[ad.id] !== undefined && (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                          📍 {adDistances[ad.id] < 1 ? "< 1" : adDistances[ad.id].toFixed(1)} km
                        </span>
                      )}
                    </div>
                    <h3 className="mb-1 text-base font-bold text-gray-900 transition group-hover:text-[#F97316] line-clamp-2">
                      {ad.title}
                    </h3>
                    <p className="mb-2 line-clamp-2 text-xs text-gray-600 flex-1">{ad.shortDescription}</p>
                    <div className="flex items-center justify-between mt-auto">
                      {ad.price && ad.price > 0 ? (
                        <span className="text-base font-bold text-[#F97316]">${ad.price.toFixed(2)}</span>
                      ) : (
                        <span className="text-xs text-gray-500">{ad.city}, {ad.state || "USA"}</span>
                      )}
                      <span className="text-xs font-bold text-[#F97316] group-hover:underline">Ver →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="bg-gradient-to-r from-[#F97316] to-[#EA580C] py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-4xl font-bold text-white">Seu Negocio Aqui</h2>
          <p className="mb-6 text-xl text-white/80">Por apenas US$ 30, alcance milhares de brasileiros</p>
          <Link
            href="/cadastro"
            className="inline-block rounded-lg bg-white px-8 py-4 text-xl font-bold text-[#F97316] transition hover:bg-slate-100"
          >
            Anunciar Agora
          </Link>
        </div>
      </section>

      <footer className="bg-[#101622] py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 SEXTOU.biz. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
