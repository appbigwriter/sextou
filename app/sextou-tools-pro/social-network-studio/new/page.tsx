import { redirect } from "next/navigation"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { SocialNetworkWizardClient } from "./wizard-client"

export const metadata = {
  title: "Novo Canvas da Oferta 11 Estrelas | EasySocial - Network Studio",
  description: "Crie campanhas e copies persuasivas baseadas na psicologia de resposta direta.",
}

export default async function NewSocialNetworkCampaignPage() {
  const result = await resolveSextouToolsProUser()

  if (result.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/social-network-studio/new")
  }

  if (result.kind === "db-unavailable") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] flex items-center justify-center">
        <p className="text-sm text-[#A09D97]">O banco de dados está temporariamente indisponível. Tente novamente mais tarde.</p>
      </div>
    )
  }

  // Acesso estrito a usuários autorizados (ambos hasActiveAds === true e isPremium === true)
  if (result.kind === "forbidden" || !result.user.hasActiveAds || !result.user.isPremium) {
    redirect("/sextou-tools-pro/acesso?next=/sextou-tools-pro/social-network-studio/new")
  }

  const user = result.user

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader userName={user.fullName} businessName={user.businessName} showPublicNav={false} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SocialNetworkWizardClient />
      </main>
    </div>
  )
}
