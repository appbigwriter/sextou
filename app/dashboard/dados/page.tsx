import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isDatabaseUnavailableError } from "@/lib/prisma-guards"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { DadosForm } from "./dados-form"
import { LogoutButton } from "@/components/logout-button"

export default async function MeusDadosPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  let user
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error
    }

    return (
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          Nao foi possivel carregar seus dados no momento.
        </div>
      </main>
    )
  }

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user.fullName}</span>
              <LogoutButton />
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
              { href: "/dashboard/dados", label: "Meus Dados" },
              { href: "/dashboard/configuracoes", label: "Configurações" },
              { href: "/dashboard/anunciar", label: "+ Novo Anúncio", isAction: true },
            ]} showLogout />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            ← Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Meus Dados
            </h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e de pagamento</p>
          </div>
        </div>

        <DadosForm user={{
          fullName: user.fullName,
          businessName: user.businessName,
          email: user.email,
          whatsapp: user.whatsapp,
          instagram: user.instagram,
          website: user.website,
          city: user.city,
          state: user.state,
          country: user.country,
          zelleCode: user.zelleCode,
        }} />
      </main>
    </div>
  )
}
