import type { Metadata } from "next"
import { HistoryList } from "@/components/sextou-tools/history-list"
import { ToolCard } from "@/components/sextou-tools/tool-card"
import { getToolkitCatalog, groupToolkitCatalogByPhase } from "@/lib/sextou-tools/catalog"
import { requireToolkitUser } from "@/lib/sextou-tools/auth"
import { listRecentToolkitExecutions } from "@/lib/sextou-tools/history"

export const metadata: Metadata = {
  title: "Sextou Tools | Brazilian Business Toolkit",
  description: "Suite de mini-apps para empreendedores brasileiros nos Estados Unidos.",
}

function ToolkitSection({
  title,
  description,
  tools,
}: {
  title: string
  description: string
  tools: ReturnType<typeof getToolkitCatalog>
}) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">{title}</p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#A09D97]">{description}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  )
}

export default async function SextouToolsPage() {
  const user = await requireToolkitUser()
  const { phase2, phase3, phase4 } = groupToolkitCatalogByPhase()
  const recentHistory = await listRecentToolkitExecutions(user.id, 5)
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
            O Brazilian Business Toolkit agora ja tem seu primeiro mini-app funcional e a estrutura
            compartilhada pronta para acelerar os proximos modulos da fase 2.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-[#A09D97]">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Login obrigatorio</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Historico em banco</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Mobile-first</span>
          </div>
        </div>
      </section>

      <div className="mb-12 grid gap-6 lg:grid-cols-[1.5fr_minmax(0,0.9fr)]">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Fase 2 em andamento</p>
          <h2 className="mt-3 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">
            Fundacao pronta e primeiro mini-app no ar
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[#A09D97]">
            <li>Rotas autenticadas em `app/sextou-tools`</li>
            <li>Catalogo central com 9 mini-apps planejados</li>
            <li>Shell compartilhado com share e retorno para o hub</li>
            <li>Modelagem inicial de historico por usuario no Prisma</li>
            <li>Gerador de QR Code entregue como primeiro quick win</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Historico do usuario</p>
          <HistoryList items={recentHistoryItems} />
        </div>
      </div>

      <ToolkitSection
        title="Fase 2"
        description="Quick wins para colocar valor imediato nas maos do usuario com ferramentas rapidas e independentes."
        tools={phase2}
      />
      <ToolkitSection
        title="Fase 3"
        description="Ferramentas com documentos, PDF, relacionamento comercial e mais dependencia de persistencia."
        tools={phase3}
      />
      <ToolkitSection
        title="Fase 4"
        description="Modulos de operacao continua, organizacao do negocio e fortalecimento da comunidade."
        tools={phase4}
      />
    </main>
  )
}
