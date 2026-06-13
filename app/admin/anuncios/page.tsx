import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ApproveButton } from "@/components/approve-button"
import { RejectButton } from "@/components/reject-button"

interface Props {
  searchParams: { status?: string }
}

export const dynamic = 'force-dynamic'

export default async function AdminAnunciosPage({ searchParams }: Props) {
  const statusFilter = searchParams.status || "ALL"
  const pendingStatuses = ["UNDER_REVIEW", "AWAITING_PAYMENT"]

  const where = statusFilter === "ALL" 
    ? {} 
    : statusFilter === "PENDING"
      ? { status: { in: pendingStatuses } }
      : { status: statusFilter }

  const ads = await prisma.ad.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { fullName: true, businessName: true, email: true },
      },
      category: true,
    },
  })

  const [total, pending, published, rejected] = await Promise.all([
    prisma.ad.count(),
    prisma.ad.count({ where: { status: { in: pendingStatuses } } }),
    prisma.ad.count({ where: { status: "PUBLISHED" } }),
    prisma.ad.count({ where: { status: "REJECTED" } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-8 w-auto object-contain" />
            </Link>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">ADMIN</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin/anuncios" className="text-[#F97316] font-medium">Anuncios</Link>
            <Link href="/admin/usuarios" className="text-gray-600 hover:text-[#F97316]">Usuarios</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/admin/anuncios"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "ALL" ? "bg-[#F97316] text-white shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"}`}
          >
            Todos ({total})
          </Link>
          <Link
            href="/admin/anuncios?status=PENDING"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "PENDING" ? "bg-[#F97316] text-white shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"}`}
          >
            Pendentes ({pending})
          </Link>
          <Link
            href="/admin/anuncios?status=PUBLISHED"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "PUBLISHED" ? "bg-[#F97316] text-white shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"}`}
          >
            Publicados ({published})
          </Link>
          <Link
            href="/admin/anuncios?status=REJECTED"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "REJECTED" ? "bg-[#F97316] text-white shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"}`}
          >
            Rejeitados ({rejected})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col h-full overflow-hidden">
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2" title={ad.title}>
                    {ad.title}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    ad.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                    ad.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-700" :
                    ad.status === "AWAITING_PAYMENT" ? "bg-blue-100 text-blue-700" :
                    ad.status === "REJECTED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {ad.status === "UNDER_REVIEW" ? "Em Analise" :
                     ad.status === "AWAITING_PAYMENT" ? "Ag. Pagamento" :
                     ad.status === "PUBLISHED" ? "Publicado" :
                     ad.status === "REJECTED" ? "Rejeitado" : ad.status}
                  </span>
                </div>
                
                <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-semibold text-sm text-gray-800">{ad.user.businessName}</div>
                  <div className="text-xs text-gray-500 truncate">{ad.user.email}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(ad.createdAt).toLocaleDateString("pt-BR")}</div>
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                  {ad.shortDescription}
                </p>

                {/* Actions row */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    href={`/admin/anuncios/${ad.id}`}
                    className="w-full text-center py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-slate-700 rounded-lg text-sm font-semibold transition"
                  >
                    Ver Detalhes Completos
                  </Link>
                  
                  {(ad.status === "UNDER_REVIEW" || ad.status === "AWAITING_PAYMENT") && (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <ApproveButton 
                          adId={ad.id} 
                          className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-60" 
                        />
                      </div>
                      <div className="flex-1">
                        <RejectButton 
                          adId={ad.id} 
                          className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded-lg text-sm font-semibold transition disabled:opacity-60" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {ads.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-300">
              <div className="text-4xl mb-3">📭</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum anúncio</h3>
              <p className="text-gray-500 font-medium">Não há anúncios com o status selecionado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}