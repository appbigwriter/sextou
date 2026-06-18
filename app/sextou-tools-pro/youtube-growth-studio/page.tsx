import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { YoutubeGrowthDashboardClient } from "./dashboard-client"
import { YoutubeGrowthSales } from "./sales-client"

export const metadata: Metadata = {
  title: "YouTube Growth Studio AI | SextouTools Premium",
  description: "Transforme o YouTube em uma máquina de autoridade, conteúdo e geração de oportunidades para seu negócio.",
}

export default async function YoutubeGrowthDashboardPage() {
  const access = await resolveSextouToolsPremiumUser()

  if (access.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/youtube-growth-studio")
  }

  if (access.kind === "db-unavailable") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] flex items-center justify-center">
        <p className="text-sm text-[#A09D97]">
          O banco de dados está temporariamente indisponível. Tente novamente mais tarde.
        </p>
      </div>
    )
  }

  // Usuário logado mas sem acesso ao Pacote PRO Premium (exige hasActiveAds e isPremium):
  // exibe a vitrine de apresentação do produto com CTA para a página de vendas /acesso.
  if (access.kind === "forbidden" || !access.user.hasActiveAds || !access.user.isPremium) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
        <SextouToolsProSuiteHeader userName={access.user?.fullName} businessName={access.user?.businessName} />
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <YoutubeGrowthSales />
        </main>
      </div>
    )
  }

  // Acesso liberado: usuário é anunciante ativo E assinante premium (gate AND da suite PRO).
  const user = access.user

  const channels = await prisma.youtubeChannel.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      contentPlans: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader showPublicNav={false} userName={user.fullName} businessName={user.businessName} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <YoutubeGrowthDashboardClient initialChannels={channels} />
      </main>
    </div>
  )
}
