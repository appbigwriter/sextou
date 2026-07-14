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

  // O unico caminho ate aqui sem `user` e o banco indisponivel (conexao recusada,
  // schema ausente ou bloqueio por RLS). Nunca retornamos null (tela branca): exibimos
  // um estado explicito e amigavel, no padrao das demais paginas da suite.
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
        <SextouToolsProSuiteHeader showPublicNav />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-amber-500/20 bg-amber-500/10 px-6 py-8 text-center">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-amber-400">
              Conexao com o banco temporariamente indisponivel
            </p>
            <h1 className="mt-3 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">
              O ZapLeads CRM nao conseguiu carregar agora
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#A09D97]">
              O servico de banco de dados pode estar indisponivel ou a configuracao de
              permissoes (RLS) pode estar bloqueando o acesso. Tente novamente em alguns
              instantes. Se o problema persistir, contate o suporte.
            </p>
            <a
              href="/sextou-tools-pro/dashboard"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
            >
              Voltar ao dashboard PRO
            </a>
          </div>
        </main>
      </div>
    )
  }

  // Só precisamos do id da conexão (para o extrator). O STATUS não é lido daqui:
  // o ConnectionManager consulta o estado REAL da instância na Evolution ao montar,
  // evitando abrir "conectado" com base num registro obsoleto do banco.
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
          <ZapLeadsConnectionManager />
          
          <ZapLeadsGroupExtractor connectionId={connection?.id} />
        </div>

        <ZapLeadsKanbanBoard />
      </main>
    </div>
  )
}
