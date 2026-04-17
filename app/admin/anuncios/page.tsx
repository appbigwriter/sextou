import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface Props {
  searchParams: { status?: string }
}

export const dynamic = 'force-dynamic'

export default async function AdminAnunciosPage({ searchParams }: Props) {
  const statusFilter = searchParams.status || "ALL"

  const where = statusFilter !== "ALL" ? { status: statusFilter } : {}

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

  const counts = await Promise.all([
    prisma.ad.count(),
    prisma.ad.count({ where: { status: "DRAFT" } }),
    prisma.ad.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.ad.count({ where: { status: "PUBLISHED" } }),
    prisma.ad.count({ where: { status: "REJECTED" } }),
  ])

  const [total, draft, underReview, published, rejected] = counts

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
              SEXTOU.biz
            </Link>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">ADMIN</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-[#F97316]">Dashboard</Link>
            <Link href="/admin/anuncios" className="text-[#F97316] font-medium">Anúncios</Link>
            <Link href="/admin/usuarios" className="text-gray-600 hover:text-[#F97316]">Usuários</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtros por status */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/admin/anuncios"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "ALL" ? "bg-[#F97316] text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            Todos ({total})
          </Link>
          <Link
            href="/admin/anuncios?status=DRAFT"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "DRAFT" ? "bg-[#F97316] text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            Rascunhos ({draft})
          </Link>
          <Link
            href="/admin/anuncios?status=UNDER_REVIEW"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "UNDER_REVIEW" ? "bg-[#F97316] text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            Pendentes ({underReview})
          </Link>
          <Link
            href="/admin/anuncios?status=PUBLISHED"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "PUBLISHED" ? "bg-[#F97316] text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            Publicados ({published})
          </Link>
          <Link
            href="/admin/anuncios?status=REJECTED"
            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "REJECTED" ? "bg-[#F97316] text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            Rejeitados ({rejected})
          </Link>
        </div>

        {/* Lista de anúncios */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Anúncio</th>
                <th className="text-left p-4 font-medium text-gray-600">Anunciante</th>
                <th className="text-left p-4 font-medium text-gray-600">Categoria</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Data</th>
                <th className="text-left p-4 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{ad.title}</div>
                    <div className="text-sm text-gray-500">{ad.shortDescription.substring(0, 50)}...</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{ad.user.businessName}</div>
                    <div className="text-sm text-gray-500">{ad.user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{ad.category?.name || "-"}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ad.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                      ad.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-700" :
                      ad.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(ad.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/anuncios/${ad.id}`}
                      className="text-[#F97316] hover:underline text-sm font-medium"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              {ads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Nenhum anúncio encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}