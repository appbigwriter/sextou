import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminPagamentosPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      ad: true,
      user: {
        select: { fullName: true, email: true, whatsapp: true },
      },
    },
  })

  const counts = await Promise.all([
    prisma.payment.count(),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "CONFIRMED" } }),
  ])

  const [total, pending, confirmed] = counts

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
            <Link href="/admin/anuncios" className="text-gray-600 hover:text-[#F97316]">Anúncios</Link>
            <Link href="/admin/pagamentos" className="text-[#F97316] font-medium">Pagamentos</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciamento de Pagamentos</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{pending}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="text-3xl font-bold text-green-600">{confirmed}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">ID</th>
                <th className="text-left p-4 font-medium text-gray-600">Anunciante</th>
                <th className="text-left p-4 font-medium text-gray-600">Anúncio</th>
                <th className="text-left p-4 font-medium text-gray-600">Método</th>
                <th className="text-left p-4 font-medium text-gray-600">Valor</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Data</th>
                <th className="text-left p-4 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-500">{payment.id.slice(0, 8)}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{payment.user.fullName}</div>
                    <div className="text-sm text-gray-500">{payment.user.email}</div>
                  </td>
                  <td className="p-4 text-gray-900">{payment.ad.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#F97316]">${payment.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      payment.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {payment.status === "CONFIRMED" ? "✓ Confirmado" : 
                       payment.status === "PENDING" ? "⏳ Pendente" : "❌ Falhou"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4">
                    {payment.status === "PENDING" && (
                      <form action={`/api/admin/payments/${payment.id}/confirm`} method="POST">
                        <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                          Confirmar
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Nenhum pagamento encontrado
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