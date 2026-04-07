import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { CuponsManager } from "@/components/admin/cupons-manager"

export const dynamic = 'force-dynamic'

export default function AdminCuponsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
              Sexta do Empreendedor
            </Link>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">ADMIN</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-[#F97316]">Dashboard</Link>
            <Link href="/admin/cupons" className="text-[#F97316] font-medium">Cupons</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciamento de Cupons</h1>
        <CuponsManager />
      </main>
    </div>
  )
}