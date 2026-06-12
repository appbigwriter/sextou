import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  })

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
            <Link href="/admin" className="text-gray-600 hover:text-[#F97316]">Dashboard</Link>
            <Link href="/admin/anuncios" className="text-gray-600 hover:text-[#F97316]">Anúncios</Link>
            <Link href="/admin/videos" className="text-[#F97316] font-medium">Vídeos</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Vídeos</h1>
          <Link 
            href="/admin/videos/novo" 
            className="bg-[#F97316] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#EA580C] transition"
          >
            + Novo Vídeo
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Título</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Destaque</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum vídeo cadastrado.
                  </td>
                </tr>
              ) : (
                videos.map(video => (
                  <tr key={video.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{video.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{video.youtubeUrl}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        video.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {video.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {video.isFeatured ? (
                        <span className="text-[#F97316] font-bold text-lg">★</span>
                      ) : (
                        <span className="text-gray-300 text-lg">☆</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/admin/videos/${video.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
