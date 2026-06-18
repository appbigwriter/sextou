import type { Metadata } from "next"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { StoryBrandDashboardClient } from "./dashboard-client"

export const metadata: Metadata = {
  title: "Clareza — Gerador de Estratégia de Marketing (SB7) | SextouTools Premium",
  description: "Transforme ideias de marketing em uma estratégia de marca clara baseada no método StoryBrand SB7.",
}

export default async function StoryBrandDashboardPage() {
  const access = await resolveSextouToolsPremiumUser()

  if (access.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/storybrand-strategy-generator")
  }

  // App Premium: exige anúncio ativo (hasActiveAds) E assinatura premium (isPremium)
  if (access.kind === "forbidden" || access.kind === "db-unavailable") {
    redirect("/sextou-tools-pro/acesso")
  }

  const user = access.user

  // Lista todos os projetos não arquivados deste usuário
  const projects = await prisma.sb7Project.findMany({
    where: {
      userId: user.id,
      status: { not: "archived" }
    },
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      brandScripts: {
        where: { isCurrent: true },
        select: { version: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader showPublicNav={false} />
      
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <StoryBrandDashboardClient initialProjects={projects} />
      </main>
    </div>
  )
}
