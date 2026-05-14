import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { MobileMenu } from "@/components/layout/mobile-menu"


export default async function AfiliadosPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      affiliates: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  const affiliateLink = `https://sextou.biz/cadastro?ref=${user.id}`
  const balance = user.balance || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user.fullName}</span>
              <Link
                href="/dashboard/anunciar"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                + Novo Anúncio
              </Link>
            </div>
            <MobileMenu links={[
              { href: "/", label: "Home" },
              { href: "/anuncios", label: "Ver Vitrine" },
              { href: "/dashboard", label: "Meu Dashboard" },
              { href: "/dashboard/afiliados", label: "Meus Afiliados" },
              { href: "/dashboard/configuracoes", label: "Configurações" },
              { href: "/dashboard/anunciar", label: "+ Novo Anúncio", isAction: true },
            ]} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            ← Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Meus Afiliados
            </h1>
            <p className="text-gray-600">Compartilhe seu link e ganhe comissões</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Card de Link e Saldo */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4 text-gray-900">Seu Link de Afiliado</h2>
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="text" 
                readOnly 
                value={affiliateLink} 
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Compartilhe este link com outros empresários. Você receberá <strong>50% de comissão</strong> sobre os pagamentos de anúncios dos usuários indicados!
            </p>
            
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-600 mb-2">Seu Saldo Atual</h3>
              <p className="text-4xl font-bold text-green-600">
                ${balance.toFixed(2)}
              </p>
              {balance > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Saldo disponível proveniente de comissões. (Em breve função de saque).
                </p>
              )}
            </div>
          </div>

          {/* Lista de Afiliados */}
          <div className="bg-white rounded-xl border shadow-sm p-6 overflow-y-auto max-h-[400px]">
            <h2 className="font-semibold text-lg mb-4 text-gray-900">Usuários Indicados ({user.affiliates.length})</h2>
            <div className="divide-y">
              {user.affiliates.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <div className="text-4xl mb-3">🤝</div>
                  <p>Você ainda não tem afiliados.</p>
                  <p className="text-sm">Comece a compartilhar seu link!</p>
                </div>
              ) : (
                user.affiliates.map((affiliate) => (
                  <div key={affiliate.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{affiliate.fullName}</p>
                      <p className="text-sm text-gray-500">{affiliate.businessName}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      Entrou em {new Date(affiliate.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
