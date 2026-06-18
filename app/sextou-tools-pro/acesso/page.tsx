import { redirect } from "next/navigation"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"
import { AcessoPremiumClient } from "./acesso-client"

export const metadata = {
  title: "SextouTools PRO Premium | Página de Vendas",
  description: "Desbloqueie o acesso a 20 ferramentas de marketing e vendas com inteligência artificial avançada.",
}

export default async function SextouToolsProAccessPage() {
  const result = await resolveSextouToolsProUser()

  if (result.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/acesso")
  }

  if (result.kind === "db-unavailable") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] flex items-center justify-center">
        <p className="text-sm text-[#A09D97]">O banco de dados está temporariamente indisponível. Tente novamente mais tarde.</p>
      </div>
    )
  }

  const user = result.user

  // Formata o usuário para o client component
  const clientUser = {
    fullName: user.fullName || "Membro Sextou",
    businessName: user.businessName || "Conta ativa no portal",
    hasActiveAds: user.hasActiveAds || false,
    isPremium: user.isPremium || false,
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader userName={clientUser.fullName} businessName={clientUser.businessName} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AcessoPremiumClient user={clientUser} />
      </main>
    </div>
  )
}
