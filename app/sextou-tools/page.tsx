import type { Metadata } from "next"
import { HistoryList } from "@/components/sextou-tools/history-list"
import { getToolkitCatalog } from "@/lib/sextou-tools/catalog"
import { getSextouToolsProOnly, getSextouToolsPremiumOnly } from "@/lib/sextou-tools-pro/catalog"
import { resolveToolkitUser } from "@/lib/sextou-tools/auth"
import { listRecentToolkitExecutions } from "@/lib/sextou-tools/history"
import { PackageTabs, type CatalogCard } from "./package-tabs"

export const metadata: Metadata = {
  title: "Sextou Tools | Brazilian Business Toolkit",
  description: "Suite de mini-apps para empreendedores brasileiros nos Estados Unidos.",
}

const basicoCards: CatalogCard[] = getToolkitCatalog().map((tool) => ({
  slug: tool.slug,
  title: tool.title,
  description: tool.shortDescription,
  icon: tool.icon,
  href: `/sextou-tools/${tool.slug}`,
}))

const proCards: CatalogCard[] = getSextouToolsProOnly().map((tool) => ({
  slug: tool.slug,
  title: tool.title,
  description: tool.shortDescription,
  icon: tool.icon,
  href: `/sextou-tools-pro/${tool.slug}`,
}))

const premiumCards: CatalogCard[] = [
  ...getSextouToolsPremiumOnly().map((tool) => ({
    slug: tool.slug,
    title: tool.title,
    description: tool.shortDescription,
    icon: tool.icon,
    href: `/sextou-tools-pro/${tool.slug}`,
  })),
  // Apps Premium com rota dedicada (fora do catálogo de mini-apps)
  {
    slug: "social-network-studio",
    title: "EasySocial - Network Studio",
    description: "Crie campanhas e copys baseadas nos 42 ensinamentos de copy de resposta direta.",
    icon: "ES",
    href: "/sextou-tools-pro/social-network-studio",
  },
  {
    slug: "launch-studio-pro",
    title: "Launch Studio PRO",
    description: "Sua fábrica de Fórmulas de Lançamento baseada na Product Launch Formula (PLF).",
    icon: "PLF",
    href: "/sextou-tools-pro/launch-studio-pro",
  },
  {
    slug: "zapleads",
    title: "ZapLeads CRM & Extrator",
    description: "Extraia contatos de grupos e crie um funil Kanban integrado ao WhatsApp.",
    icon: "ZAP",
    href: "/sextou-tools-pro/zapleads",
  },
]

export default async function SextouToolsPage() {
  const result = await resolveToolkitUser()
  const user = result.kind === "ok" ? result.user : null
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

      <PackageTabs basico={basicoCards} pro={proCards} premium={premiumCards} />
    </main>
  )
}
