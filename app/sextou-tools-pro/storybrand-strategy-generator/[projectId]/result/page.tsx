import type { Metadata } from "next"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { StoryBrandResultClient } from "./result-client"

export const metadata: Metadata = {
  title: "Estratégia Gerada StoryBrand SB7 | SextouTools Premium",
}

export default async function StoryBrandResultPage({
  params,
  searchParams
}: {
  params: { projectId: string }
  searchParams: { version?: string }
}) {
  const access = await resolveSextouToolsPremiumUser()

  if (access.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/storybrand-strategy-generator")
  }

  if (access.kind === "forbidden" || access.kind === "db-unavailable") {
    redirect("/sextou-tools-pro/acesso")
  }

  const user = access.user

  const projectId = params.projectId

  const project = await prisma.sb7Project.findFirst({
    where: { id: projectId, userId: user.id }
  })

  if (!project) {
    redirect("/sextou-tools-pro/storybrand-strategy-generator")
  }

  const versionQuery = searchParams.version ? parseInt(searchParams.version, 10) : undefined

  const brandScript = await prisma.sb7BrandScript.findFirst({
    where: {
      projectId,
      ...(versionQuery !== undefined ? { version: versionQuery } : { isCurrent: true })
    },
    include: {
      collaterals: true
    }
  })

  if (!brandScript || !brandScript.collaterals[0]) {
    redirect(`/sextou-tools-pro/storybrand-strategy-generator/${projectId}/interview`)
  }

  // Busca o histórico de versões deste projeto
  const allVersions = await prisma.sb7BrandScript.findMany({
    where: { projectId },
    select: { id: true, version: true, createdAt: true, isCurrent: true },
    orderBy: { version: "desc" }
  })

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader showPublicNav={false} />
      
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <StoryBrandResultClient
          projectId={projectId}
          project={project}
          brandScript={brandScript}
          collateral={brandScript.collaterals[0]}
          versions={allVersions}
        />
      </main>
    </div>
  )
}
