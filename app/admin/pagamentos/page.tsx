import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminPagamentosPage() {
  const payments = (await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      ad: true,
      user: {
        select: { fullName: true, email: true, whatsapp: true },
      },
    },
  })) as any[]

  const counts = await Promise.all([
    prisma.payment.count(),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "CONFIRMED" } }),
  ])

  const [total, pending, confirmed] = counts

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-8 w-auto object-contain" />
            </Link>
            <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">ADMIN</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-[#F97316]">
              Dashboard
            </Link>
            <Link href="/admin/anuncios" className="text-gray-600 hover:text-[#F97316]">
              Anuncios
            </Link>
            <Link href="/admin/pagamentos" className="font-medium text-[#F97316]">
              Pagamentos
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Gerenciamento de Pagamentos</h1>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{pending}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{confirmed}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium text-gray-600">ID</th>
                <th className="p-4 text-left font-medium text-gray-600">Anunciante</th>
                <th className="p-4 text-left font-medium text-gray-600">Anuncio</th>
                <th className="p-4 text-left font-medium text-gray-600">Metodo</th>
                <th className="p-4 text-left font-medium text-gray-600">Dados Zelle</th>
                <th className="p-4 text-left font-medium text-gray-600">Valor</th>
                <th className="p-4 text-left font-medium text-gray-600">Status</th>
                <th className="p-4 text-left font-medium text-gray-600">Data</th>
                <th className="p-4 text-left font-medium text-gray-600">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => {
                const zelleIncomplete =
                  payment.paymentMethod === "ZELLE" &&
                  (!payment.transactionId || !payment.transactionDate)

                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-500">{payment.id.slice(0, 8)}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{payment.user.fullName}</div>
                      <div className="text-sm text-gray-500">{payment.user.email}</div>
                    </td>
                    <td className="p-4 text-gray-900">{payment.ad.title}</td>
                    <td className="p-4">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {payment.paymentMethod === "ZELLE" ? (
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-900">Codigo:</span>{" "}
                            {payment.transactionId || "Nao informado"}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Data:</span>{" "}
                            {payment.transactionDate
                              ? new Date(payment.transactionDate).toLocaleDateString("pt-BR")
                              : "Nao informada"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-[#F97316]">${payment.amount}</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          payment.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status === "CONFIRMED"
                          ? "Confirmado"
                          : payment.status === "PENDING"
                          ? "Pendente"
                          : "Falhou"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4">
                      {payment.status === "PENDING" && (
                        <form action={`/api/admin/payments/${payment.id}/confirm`} method="POST">
                          <button
                            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={zelleIncomplete}
                            title={zelleIncomplete ? "Falta codigo ou data do pagamento Zelle." : "Confirmar pagamento"}
                          >
                            Confirmar
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                )
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
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
