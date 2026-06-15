import type { Metadata } from "next"
import { HistoryList } from "@/components/sextou-tools/history-list"
import { ToolCard } from "@/components/sextou-tools/tool-card"
import { getToolkitCatalog, groupToolkitCatalogByPhase } from "@/lib/sextou-tools/catalog"
import { resolveToolkitUser } from "@/lib/sextou-tools/auth"
import { listRecentToolkitExecutions } from "@/lib/sextou-tools/history"

export const metadata: Metadata = {
  title: "Sextou Tools | Brazilian Business Toolkit",
  description: "Suite de mini-apps para empreendedores brasileiros nos Estados Unidos.",
}

function ToolkitSection({
  tools,
}: {
  tools: ReturnType<typeof getToolkitCatalog>
}) {
  return (
    <section className="mb-12">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  )
}

export default async function SextouToolsPage() {
  const result = await resolveToolkitUser()
  const user = result.kind === "ok" ? result.user : null
  const { phase2, phase3, phase4 } = groupToolkitCatalogByPhase()
  const recentHistory = user ? await listRecentToolkitExecutions(user.id, 5) : []
  const recentHistoryItems = recentHistory.map((item) => ({
    title: item.toolSlug.replaceAll("-", " "),
    subtitle: typeof item.metadataJson === "object" && item.metadataJson && "summary" in item.metadataJson
      ? String(item.metadataJson.summary)
      : undefined,
    timestamp: item.createdAt.toLocaleString("pt-BR"),
  }))

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-10 rounded-[22px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF3D57]">
            Suite de ferramentas
          </p>
          <h1 className="font-toolkit text-4xl font-extrabold leading-none tracking-[-0.03em] text-[#F0EDE6] md:text-6xl">
            Brazilian Business Toolkit
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A09D97]">
            A suite completa do Brazilian Business Toolkit agora cobre marketing, precificacao,
            operacao, documentos, CRM leve e comunidade em um unico fluxo autenticado.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-[#A09D97]">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Login obrigatorio</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Historico em banco</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Mobile-first</span>
          </div>
        </div>
      </section>

      {result.kind === "db-unavailable" ? (
        <div className="mb-8 rounded-[22px] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm leading-6 text-amber-100">
          O banco da suíte está temporariamente indisponível. As ferramentas continuam carregando,
          mas histórico e gravações ficam pausados até a conexão voltar.
        </div>
      ) : null}

      <div className="mb-12">
        <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Historico do usuario</p>
        <HistoryList items={recentHistoryItems} />
      </div>

      <ToolkitSection
        tools={phase2}
      />
      <ToolkitSection
        tools={phase3}
      />
      <ToolkitSection
        tools={phase4}
      />
    </main>
  )
}
