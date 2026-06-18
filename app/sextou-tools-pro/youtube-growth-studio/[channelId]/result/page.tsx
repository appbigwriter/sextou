import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { ResultClient } from "./result-client"

export const metadata: Metadata = {
  title: "Plano Editorial | YouTube Growth Studio AI",
  description: "Visualize e gerencie seu calendário editorial, roteiros e estratégias de SEO otimizados.",
}

interface PageProps {
  params: {
    channelId: string
  }
  searchParams: {
    planId?: string
  }
}

export default async function YoutubeResultPage({ params, searchParams }: PageProps) {
  const access = await resolveSextouToolsPremiumUser()

  if (access.kind === "unauthorized") {
    redirect(`/login?next=/sextou-tools-pro/youtube-growth-studio/${params.channelId}/result`)
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

  // Tenta carregar o plano mais recente se planId não foi fornecido
  let planId = searchParams.planId
  if (!planId) {
    const latestPlan = await prisma.youtubeContentPlan.findFirst({
      where: { channelId: channel.id, userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true }
    })
    planId = latestPlan?.id
  }

  if (!planId) {
    redirect(`/sextou-tools-pro/youtube-growth-studio/${channel.id}/setup`)
  }

  const plan = await prisma.youtubeContentPlan.findFirst({
    where: {
      id: planId,
      userId: user.id
    }
  })

  if (!plan) {
    redirect("/sextou-tools-pro/youtube-growth-studio")
  }

  const items = await prisma.youtubeContentItem.findMany({
    where: {
      planId: plan.id
    },
    orderBy: {
      scheduledDate: "asc"
    }
  })

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader showPublicNav={false} />
      
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ResultClient channel={channel} plan={plan} initialItems={items} />
      </main>
    </div>
  )
}
