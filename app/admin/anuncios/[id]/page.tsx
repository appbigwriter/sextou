import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Props {
  params: { id: string }
}

export default async function AdminAdDetailPage({ params }: Props) {
  const ad = await prisma.ad.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      category: true,
    },
  })

  if (!ad) {
    notFound()
  }

  const canApprove = ad.status === "UNDER_REVIEW" || ad.status === "AWAITING_PAYMENT"
  const canReject = ad.status === "UNDER_REVIEW"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/anuncios" className="text-[#F97316] hover:underline">
              ← Voltar
            </Link>
            <span className="font-bold text-gray-900">Detalhes do Anúncio</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              ad.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
              ad.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-700" :
              ad.status === "REJECTED" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {ad.status}
            </span>
            {ad.category && (
              <span className="text-sm text-gray-600">
                {ad.category.icon} {ad.category.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{ad.title}</h1>
          
          <p className="text-gray-600 mb-6">{ad.shortDescription}</p>

          <div className="prose max-w-none mb-6">
            <h2 className="text-lg font-semibold mb-2">Descrição Completa</h2>
            <p className="text-gray-700">{ad.fullDescription}</p>
          </div>

          {ad.price && (
            <div className="mb-6">
              <span className="text-sm text-gray-600">Preço: </span>
              <span className="text-2xl font-bold text-[#F97316]">${ad.price}</span>
              {ad.promotionText && (
                <span className="ml-4 text-green-600 font-medium">🎉 {ad.promotionText}</span>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Localização</h3>
              <p className="text-gray-900">{ad.city}, {ad.state || "USA"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">WhatsApp</h3>
              <a href={`https://wa.me/${ad.whatsappContact.replace(/\D/g, "")}`} className="text-[#F97316] hover:underline">
                {ad.whatsappContact}
              </a>
            </div>
            {ad.externalLink && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Link Externo</h3>
                <a href={ad.externalLink} target="_blank" className="text-[#F97316] hover:underline">
                  {ad.externalLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Anunciante */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Informações do Anunciante</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Nome:</span>
              <p className="text-gray-900">{ad.user.fullName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Empresa:</span>
              <p className="text-gray-900">{ad.user.businessName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Email:</span>
              <p className="text-gray-900">{ad.user.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">WhatsApp:</span>
              <p className="text-gray-900">{ad.user.whatsapp}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        {canApprove && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Aprovar Anúncio</h2>
            <form action={`/api/admin/ads/${ad.id}/approve`} method="POST" className="inline mr-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                ✓ Aprovar e Publicar
              </Button>
            </form>
            {canReject && (
              <form action={`/api/admin/ads/${ad.id}/reject`} method="POST" className="inline">
                <Button type="submit" variant="destructive" className="bg-red-600 hover:bg-red-700">
                  ✕ Rejeitar
                </Button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  )
}