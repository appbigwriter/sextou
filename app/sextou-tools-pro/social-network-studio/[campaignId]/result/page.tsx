import { redirect } from "next/navigation"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { EasySocialResultClient } from "./result-client"

export const metadata = {
  title: "Dossiê da Oferta 11 Estrelas | EasySocial - Network Studio",
  description: "Visualize, edite e copie as campanhas geradas.",
}

export default async function EasySocialResultPage({
  params,
}: {
  params: { campaignId: string }
}) {
  const result = await resolveSextouToolsProUser()

  if (result.kind === "unauthorized") {
    redirect(`/login?next=/sextou-tools-pro/social-network-studio/${params.campaignId}/result`)
  }

  if (result.kind === "db-unavailable") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] flex items-center justify-center">
        <p className="text-sm text-[#A09D97]">O banco de dados está temporariamente indisponível. Tente novamente mais tarde.</p>
      </div>
    )
  }

  // Acesso estrito a usuários autorizados (hasActiveAds === true E isPremium === true)
  if (result.kind === "forbidden" || !result.user.hasActiveAds || !result.user.isPremium) {
    redirect("/sextou-tools-pro/acesso")
  }

  const user = result.user

  // Busca a campanha e o projeto associado
  const campaign = await prisma.socialNetworkCampaign.findFirst({
    where: {
      id: params.campaignId,
      project: {
        userId: user.id,
      },
    },
    include: {
      project: true,
      contents: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!campaign) {
    redirect("/sextou-tools-pro/social-network-studio")
  }

  // Adapta o objeto de campanha para o formato do client component
  const clientCampaign = {
    id: campaign.id,
    dorPrincipal: campaign.dorPrincipal,
    medo: campaign.medo,
    sonho: campaign.sonho,
    promessa: campaign.promessa,
    provaSocial: campaign.provaSocial,
    escassez: campaign.escassez,
    status: campaign.status,
    project: {
      projectName: campaign.project.projectName,
      targetAudience: campaign.project.targetAudience,
      basicIdea: campaign.project.basicIdea,
    },
  }

  const clientContents = campaign.contents.map((c) => ({
    id: c.id,
    contentType: c.contentType,
    channel: c.channel,
    title: c.title,
    body: c.body,
    framework: c.framework,
    pronomesOk: c.pronomesOk,
    readability: c.readability,
  }))

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader userName={user.fullName} businessName={user.businessName} showPublicNav={false} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EasySocialResultClient campaign={clientCampaign} initialContents={clientContents} />
      </main>
    </div>
  )
}
