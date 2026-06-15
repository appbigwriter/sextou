import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { CopyAffiliateLink } from "@/components/copy-affiliate-link"


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
              <a
                href="/Manual_Afiliado_SEXTOU.pdf"
                download="Manual_Afiliado_SEXTOU.pdf"
                className="flex items-center gap-1.5 border border-[#F97316] text-[#F97316] hover:bg-[#F97316]/10 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Manual do Afiliado
              </a>
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
              { href: "/Manual_Afiliado_SEXTOU.pdf", label: "📄 Manual do Afiliado" },
              { href: "/dashboard/configuracoes", label: "Configurações" },
              { href: "/dashboard/anunciar", label: "+ Novo Anúncio", isAction: true },
            ]} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
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
          <a
            href="/Manual_Afiliado_SEXTOU.pdf"
            download="Manual_Afiliado_SEXTOU.pdf"
            className="flex items-center gap-2 bg-orange-50 border border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            Baixar Manual do Afiliado
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Card de Link e Saldo */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4 text-gray-900">Seu Link de Afiliado</h2>
            <CopyAffiliateLink link={affiliateLink} />
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
                  <div key={affiliate.id} className="py-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{affiliate.fullName}</p>
                        <p className="text-sm text-gray-500 font-medium">{affiliate.businessName}</p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(affiliate.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border">
                      <div>
                        <span className="font-medium text-gray-500 block text-xs uppercase">Contato</span>
                        <p className="truncate" title={affiliate.email}>📧 {affiliate.email}</p>
                        <p>📱 {affiliate.whatsapp}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 block text-xs uppercase">Localização</span>
                        <p>📍 {affiliate.city}, {affiliate.state}</p>
                        <p className="text-xs text-gray-400">{affiliate.country}</p>
                      </div>
                      {(affiliate.instagram || affiliate.website) && (
                        <div className="col-span-2 pt-2 mt-1 border-t border-gray-200">
                          <span className="font-medium text-gray-500 block text-xs uppercase">Redes / Site</span>
                          <div className="flex gap-4">
                            {affiliate.instagram && <p>📸 {affiliate.instagram}</p>}
                            {affiliate.website && (
                              <a href={affiliate.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                🌐 Website
                              </a>
                            )}
                          </div>
                        </div>
                      )}
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
