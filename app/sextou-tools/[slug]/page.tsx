import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HistoryList } from "@/components/sextou-tools/history-list"
import { BusinessChecklistTool } from "@/components/sextou-tools/tools/business-checklist-tool"
import { CampaignRoiTool } from "@/components/sextou-tools/tools/campaign-roi-tool"
import { InvoiceEmailTool } from "@/components/sextou-tools/tools/invoice-email-tool"
import { LeadsManagerTool } from "@/components/sextou-tools/tools/leads-manager-tool"
import { QuotePdfTool } from "@/components/sextou-tools/tools/quote-pdf-tool"
import { QrCodeTool } from "@/components/sextou-tools/tools/qr-code-tool"
import { ServicePriceTool } from "@/components/sextou-tools/tools/service-price-tool"
import { ToolShell } from "@/components/sextou-tools/tool-shell"
import { requireToolkitUser } from "@/lib/sextou-tools/auth"
import { getToolkitTool } from "@/lib/sextou-tools/catalog"
import { listRecentToolkitExecutionsByTool } from "@/lib/sextou-tools/history"

const statusLabel = {
  planned: "Em breve",
  beta: "Beta",
  live: "Disponivel",
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const tool = getToolkitTool(params.slug)

  if (!tool) {
    return {
      title: "Sextou Tools",
    }
  }

  return {
    title: `${tool.title} | Sextou Tools`,
    description: tool.description,
  }
}

export default async function ToolkitToolPage({
  params,
}: {
  params: { slug: string }
}) {
  const user = await requireToolkitUser()
  const tool = getToolkitTool(params.slug)

  if (!tool) {
    notFound()
  }

  const recentHistory = await listRecentToolkitExecutionsByTool(user.id, tool.slug, 8)
  const historyItems = recentHistory.map((item) => ({
    title: tool.title,
    subtitle:
      typeof item.metadataJson === "object" && item.metadataJson && "summary" in item.metadataJson
        ? String(item.metadataJson.summary)
        : undefined,
    timestamp: item.createdAt.toLocaleString("pt-BR"),
  }))

  if (tool.slug === "gerador-qr-code") {
    return (
      <ToolShell
        title={tool.title}
        phase={tool.phase}
        statusLabel={statusLabel[tool.status]}
        description={tool.description}
      >
        <QrCodeTool historyItems={historyItems} />
      </ToolShell>
    )
  }

  if (tool.slug === "calculadora-preco-servico") {
    return (
      <ToolShell
        title={tool.title}
        phase={tool.phase}
        statusLabel={statusLabel[tool.status]}
        description={tool.description}
      >
        <ServicePriceTool historyItems={historyItems} />
      </ToolShell>
    )
  }

  if (tool.slug === "calculadora-roi-campanha") {
    return (
      <ToolShell
        title={tool.title}
        phase={tool.phase}
        statusLabel={statusLabel[tool.status]}
        description={tool.description}
      >
        <CampaignRoiTool historyItems={historyItems} />
      </ToolShell>
    )
  }

  if (tool.slug === "checklist-abertura-empresa") {
    return (
      <ToolShell
        title={tool.title}
        phase={tool.phase}
        statusLabel={statusLabel[tool.status]}
        description={tool.description}
      >
        <BusinessChecklistTool historyItems={historyItems} />
      </ToolShell>
    )
  }

  if (tool.slug === "gerador-orcamento-pdf") {
    return (
      <ToolShell
        title={tool.title}
        phase={tool.phase}
        statusLabel={statusLabel[tool.status]}
        description={tool.description}
      >
        <QuotePdfTool historyItems={historyItems} />
      </ToolShell>
    )
  }

  if (tool.slug === "gerenciador-oportunidades-leads") {
    return (
      <ToolShell
        title={tool.title}
        phase={tool.phase}
        statusLabel={statusLabel[tool.status]}
        description={tool.description}
      >
        <LeadsManagerTool historyItems={historyItems} />
      </ToolShell>
    )
  }

  if (tool.slug === "gerador-invoice-email") {
    return (
      <ToolShell
        title={tool.title}
        phase={tool.phase}
        statusLabel={statusLabel[tool.status]}
        description={tool.description}
      >
        <InvoiceEmailTool historyItems={historyItems} />
      </ToolShell>
    )
  }

  return (
    <ToolShell
      title={tool.title}
      phase={tool.phase}
      statusLabel={statusLabel[tool.status]}
      description={tool.description}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_minmax(0,0.8fr)]">
        <section className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Planejado para a Fase {tool.phase}</p>
          <h2 className="mt-3 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">
            Pagina base publicada, logica do mini-app entra na proxima entrega
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#A09D97]">
            A rota deste modulo ja faz parte da estrutura oficial do Sextou Tools. Nesta fase estamos
            garantindo navegacao, autenticacao, identidade visual da suite e infraestrutura de historico.
          </p>
        </section>

        <aside className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Escopo previsto</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#A09D97]">
            {tool.plannedFeatures.map((feature) => (
              <li key={feature} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <HistoryList items={historyItems} />
          </div>
        </aside>
      </div>
    </ToolShell>
  )
}
