import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { ZapLeadsConnectionManager } from "@/components/sextou-tools-pro/zapleads/connection-manager"
import { ZapLeadsGroupExtractor } from "@/components/sextou-tools-pro/zapleads/group-extractor"
import { ZapLeadsKanbanBoard } from "@/components/sextou-tools-pro/zapleads/kanban-board"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "ZapLeads CRM | SextouTools PRO",
  description: "Dashboard do CRM integrado ao WhatsApp no SextouTools PRO.",
}

export default async function ZapLeadsPage() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/zapleads")
  }

  if (result.kind === "forbidden") {
    redirect("/sextou-tools-pro/acesso?next=/sextou-tools-pro/zapleads")
  }

  const user = result.kind === "ok" ? result.user : null

  if (!user) {
    return null
  }

  // Check existing connection
  const connection = await prisma.zapConnection.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <SextouToolsProSuiteHeader userName={user.fullName} businessName={user.businessName} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-toolkit text-4xl font-extrabold leading-none tracking-[-0.03em] text-[#F0EDE6] md:text-5xl">
            ZapLeads CRM
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#A09D97]">
            Conecte seu WhatsApp, extraia leads de grupos e crie um funil comercial direto do SextouTools PRO.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_minmax(0,0.75fr)]">
          <ZapLeadsConnectionManager initialStatus={connection?.status} />
          
          <ZapLeadsGroupExtractor connectionId={connection?.id} />
        </div>

        <ZapLeadsKanbanBoard />
      </main>
    </div>
  )
}
