import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function AdDetailPage({ params }: Props) {
  const ad = await prisma.ad.findFirst({
    where: { id: params.id, status: "PUBLISHED" },
    include: {
      category: true,
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            Sexta do Empreendedor
          </Link>
          <Link href="/anuncios" className="text-slate-700 hover:text-[#F97316] font-medium">
            ← Voltar para Anúncios
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Galeria de Imagens */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-96 md:h-full flex items-center justify-center">
              <span className="text-9xl">🏪</span>
            </div>

            {/* Informações */}
            <div className="p-8">
              {/* Badge Destaque */}
              {ad.isFeatured && (
                <div className="inline-block bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-4 py-2 rounded-lg font-bold mb-4">
                  ⭐ ANÚNCIO EM DESTAQUE
                </div>
              )}

              {/* Categoria */}
              {ad.category && (
                <div className="text-sm font-bold text-[#F97316] bg-[#F97316]/10 px-3 py-1 rounded inline-block mb-4">
                  {ad.category.icon} {ad.category.name}
                </div>
              )}

              {/* Título */}
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {ad.title}
              </h1>

              {/* Nome do negócio */}
              <div className="flex items-center text-gray-600 mb-4">
                <span className="text-xl mr-2">🏪</span>
                <span className="text-lg font-medium">{ad.user.businessName}</span>
              </div>

              {/* Localização */}
              <div className="flex items-center text-gray-600 mb-6">
                <span className="text-xl mr-2">📍</span>
                <span className="text-lg">{ad.city}, {ad.state || "USA"}</span>
              </div>

              {/* Preço */}
              {ad.price && ad.price > 0 && (
                <div className="mb-6">
                  <span className="text-sm text-gray-600">Preço</span>
                  <div className="text-5xl font-bold text-[#F97316]">
                    ${ad.price}
                  </div>
                  {ad.promotionText && (
                    <div className="mt-2 text-green-600 font-semibold">
                      🎉 {ad.promotionText}
                    </div>
                  )}
                </div>
              )}

              {/* Descrição */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Sobre o Serviço</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {ad.fullDescription}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition transform hover:scale-105"
                >
                  💬 Falar no WhatsApp
                </a>

                {ad.externalLink && (
                  <a
                    href={ad.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#F97316] text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-[#EA580C] transition"
                  >
                    🌐 Visitar Site
                  </a>
                )}

                {ad.user.instagram && (
                  <a
                    href={`https://instagram.com/${ad.user.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-4 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition"
                  >
                    📸 Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#101622] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Sexta do Empreendedor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
