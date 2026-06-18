import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { SetupWizardClient } from "./setup-client"

export const metadata: Metadata = {
  title: "Configuração do Canal | YouTube Growth Studio AI",
  description: "Configure os objetivos, público-alvo e preferências do seu canal do YouTube para otimizar a inteligência artificial.",
}

interface PageProps {
  params: {
    channelId: string
  }
}

export default async function YoutubeSetupPage({ params }: PageProps) {
  const access = await resolveSextouToolsPremiumUser()

  if (access.kind === "unauthorized") {
    redirect(`/login?next=/sextou-tools-pro/youtube-growth-studio/${params.channelId}/setup`)
  }

  // Sem o gate completo (exige hasActiveAds E isPremium) volta à vitrine do app (apresentação + CTA)
  if (access.kind === "forbidden" || access.kind === "db-unavailable") {
    redirect("/sextou-tools-pro/youtube-growth-studio")
  }

  const user = access.user

  const channel = await prisma.youtubeChannel.findFirst({
    where: {
      id: params.channelId,
      userId: user.id
    }
  })

  if (!channel) {
    redirect("/sextou-tools-pro/youtube-growth-studio")
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader showPublicNav={false} />
      
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SetupWizardClient channel={channel} />
      </main>
    </div>
  )
}
