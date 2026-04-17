import Link from "next/link"
import { getAllCategories } from "@/lib/default-categories"
import { CategoriasManager } from "@/components/admin/categorias-manager"

export const dynamic = 'force-dynamic'

export default async function AdminCategoriasPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Link href="/admin/anuncios" className="text-gray-600 hover:text-[#F97316]">Anúncios</Link>
            <Link href="/admin/categorias" className="text-[#F97316] font-medium">Categorias</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciamento de Categorias</h1>
        <CategoriasManager categories={categories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          isActive: c.isActive,
          order: c.order,
        }))} />
      </main>
    </div>
  )
}
