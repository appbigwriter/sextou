import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { MobileMenu } from "@/components/layout/mobile-menu"

interface Props {
  params: { id: string }
}

export default async function AdDetailPage({ params }: Props) {
  const ad = await prisma.ad.findFirst({
    where: { id: params.id, status: "PUBLISHED" },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
      },
      user: {
        select: {
          businessName: true,
          whatsapp: true,
          instagram: true,
          website: true,
        },
      },
    },
  })

  if (!ad) {
    notFound()
  }

  const whatsappNumber = ad.whatsappContact.replace(/\D/g, "")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-heading text-2xl font-extrabold text-[#F97316]">
            SEXTOU.biz
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/anuncios" className="font-medium text-slate-700 hover:text-[#F97316]">
              ← Voltar para Anuncios
            </Link>
          </nav>
          <MobileMenu links={[
              { href: "/", label: "Home" },
              { href: "/anuncios", label: "Voltar para Anuncios" },
              { href: "/login", label: "Entrar" },
              { href: "/cadastro", label: "Anunciar Agora", isAction: true },
            ]} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="grid gap-8 md:grid-cols-2">
            {ad.images.length > 0 ? (
              <div className="bg-slate-100">
                <img src={ad.images[0].imageUrl} alt={ad.title} className="h-96 w-full object-cover md:h-full" />
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 md:h-full">
                <span className="text-9xl">🏪</span>
              </div>
            )}

            <div className="p-8">
              {ad.isFeatured && (
                <div className="mb-4 inline-block rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] px-4 py-2 font-bold text-white">
                  Anuncio em destaque
                </div>
              )}

              {ad.category && (
                <div className="mb-4 inline-block rounded bg-[#F97316]/10 px-3 py-1 text-sm font-bold text-[#F97316]">
                  {ad.category.name}
                </div>
              )}

              <h1 className="mb-4 text-4xl font-extrabold text-gray-900">{ad.title}</h1>

              <div className="mb-4 text-lg font-medium text-gray-600">{ad.user.businessName}</div>

              <div className="mb-6 text-lg text-gray-600">
                {ad.city}, {ad.state || "USA"}
              </div>

              {ad.price && ad.price > 0 && (
                <div className="mb-6">
                  <span className="text-sm text-gray-600">Preco</span>
                  <div className="text-5xl font-bold text-[#F97316]">${ad.price.toFixed(2)}</div>
                  {ad.promotionText && <div className="mt-2 font-semibold text-green-600">{ad.promotionText}</div>}
                </div>
              )}

              <div className="mb-8">
                <h2 className="mb-3 text-2xl font-bold text-gray-900">Sobre o servico</h2>
                <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">{ad.fullDescription}</p>
              </div>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-green-500 py-4 text-center text-lg font-bold text-white transition hover:bg-green-600"
                >
                  Falar no WhatsApp
                </a>

                {ad.externalLink && (
                  <a
                    href={ad.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg bg-[#F97316] py-4 text-center text-lg font-bold text-white transition hover:bg-[#EA580C]"
                  >
                    Visitar Site
                  </a>
                )}

                {ad.user.instagram && (
                  <a
                    href={`https://instagram.com/${ad.user.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 py-4 text-center text-lg font-bold text-white transition hover:opacity-90"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {ad.images.length > 1 && (
            <div className="border-t bg-white p-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Mais imagens</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ad.images.slice(1).map((image) => (
                  <img
                    key={image.id}
                    src={image.imageUrl}
                    alt={ad.title}
                    className="h-48 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 bg-[#101622] py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 SEXTOU.biz. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
