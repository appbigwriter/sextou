import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { SextouToolsProAppShell } from "@/components/sextou-tools-pro/app-shell"
import { ContentCalendarTool } from "@/components/sextou-tools-pro/tools/content-calendar-tool"
import { OnePageProposalTool } from "@/components/sextou-tools-pro/tools/one-page-proposal-tool"
import { OfferGeneratorTool } from "@/components/sextou-tools-pro/tools/offer-generator-tool"
import { ReelsScriptTool } from "@/components/sextou-tools-pro/tools/reels-script-tool"
import { WhatsAppRepliesTool } from "@/components/sextou-tools-pro/tools/whatsapp-replies-tool"
import { getSextouToolsProTool } from "@/lib/sextou-tools-pro/catalog"
import { listRecentSextouToolsProGenerationsByApp } from "@/lib/sextou-tools-pro/history"
import { getOperationalStatus, getPublishedPostsMap } from "@/lib/sextou-tools-pro/metadata"
import { resolveToolkitUser } from "@/lib/sextou-tools/auth"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const tool = getSextouToolsProTool(params.slug)

  if (!tool) {
    return {
      title: "SextouTools PRO",
    }
  }

  return {
    title: `${tool.title} | SextouTools PRO`,
    description: tool.description,
  }
}

export default async function SextouToolsProToolPage({
  params,
}: {
  params: { slug: string }
}) {
  const result = await resolveToolkitUser()

  if (result.kind === "unauthorized") {
    redirect(`/login?next=/sextou-tools-pro/${params.slug}`)
  }

  const tool = getSextouToolsProTool(params.slug)

  if (!tool) {
    notFound()
  }

  const user = result.kind === "ok" ? result.user : null
  const recentHistory =
    user &&
    (
      tool.slug === "respostas-prontas-whatsapp" ||
      tool.slug === "gerador-oferta-irresistivel" ||
      tool.slug === "calendario-conteudo-7-dias" ||
      tool.slug === "roteiro-reels-shorts-30s" ||
      tool.slug === "proposta-comercial-one-page"
    )
      ? await listRecentSextouToolsProGenerationsByApp(user.id, tool.slug, 8)
      : []

  if (tool.slug === "respostas-prontas-whatsapp") {
    const initialHistory = recentHistory.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle:
        typeof item.outputData === "object" &&
        item.outputData &&
        "shortReply" in item.outputData
          ? String(item.outputData.shortReply)
          : undefined,
      timestamp: item.createdAt.toLocaleString("pt-BR"),
      isFavorite: item.isFavorite,
      status: item.status,
    }))

    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
        <SextouToolsProAppShell tool={tool}>
          <WhatsAppRepliesTool initialHistory={initialHistory} />
        </SextouToolsProAppShell>
      </div>
    )
  }

  if (tool.slug === "gerador-oferta-irresistivel") {
    const initialHistory = recentHistory.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle:
        typeof item.outputData === "object" &&
        item.outputData &&
        "headline" in item.outputData
          ? String(item.outputData.headline)
          : undefined,
      timestamp: item.createdAt.toLocaleString("pt-BR"),
      isFavorite: item.isFavorite,
      status: item.status,
    }))

    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
        <SextouToolsProAppShell tool={tool}>
          <OfferGeneratorTool
            initialHistory={initialHistory}
            initialOperationalStatus={
              recentHistory[0] ? getOperationalStatus(recentHistory[0].metadataJson) : null
            }
          />
        </SextouToolsProAppShell>
      </div>
    )
  }

  if (tool.slug === "calendario-conteudo-7-dias") {
    const initialHistory = recentHistory.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle:
        typeof item.outputData === "object" &&
        item.outputData &&
        "weekLabel" in item.outputData
          ? String(item.outputData.weekLabel)
          : undefined,
      timestamp: item.createdAt.toLocaleString("pt-BR"),
      isFavorite: item.isFavorite,
      status: item.status,
    }))

    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
        <SextouToolsProAppShell tool={tool}>
          <ContentCalendarTool
            initialHistory={initialHistory}
            initialPublishedMap={recentHistory[0] ? getPublishedPostsMap(recentHistory[0].metadataJson) : {}}
          />
        </SextouToolsProAppShell>
      </div>
    )
  }

  if (tool.slug === "roteiro-reels-shorts-30s") {
    const initialHistory = recentHistory.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle:
        typeof item.outputData === "object" &&
        item.outputData &&
        "openingHook" in item.outputData
          ? String(item.outputData.openingHook)
          : undefined,
      timestamp: item.createdAt.toLocaleString("pt-BR"),
      isFavorite: item.isFavorite,
      status: item.status,
    }))

    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
        <SextouToolsProAppShell tool={tool}>
          <ReelsScriptTool
            initialHistory={initialHistory}
            initialOperationalStatus={
              recentHistory[0] ? getOperationalStatus(recentHistory[0].metadataJson) : null
            }
          />
        </SextouToolsProAppShell>
      </div>
    )
  }

  if (tool.slug === "proposta-comercial-one-page") {
    const initialHistory = recentHistory.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle:
        typeof item.outputData === "object" &&
        item.outputData &&
        "clientContext" in item.outputData
          ? String(item.outputData.clientContext)
          : undefined,
      timestamp: item.createdAt.toLocaleString("pt-BR"),
      isFavorite: item.isFavorite,
      status: item.status,
    }))

    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
        <SextouToolsProAppShell tool={tool}>
          <OnePageProposalTool initialHistory={initialHistory} />
        </SextouToolsProAppShell>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <SextouToolsProAppShell tool={tool}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <section className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">
              Estrutura da pagina
            </p>
            <h2 className="mt-3 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">
              Esta rota ja existe como pagina propria e independente
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#A09D97]">
              Na Sprint 1, o foco e publicar a estrutura visual e a navegacao do app. O formulario,
              a geracao com IA leve, o historico persistido e as acoes inteligentes entram nas
              proximas sprints.
            </p>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#FCD34D]">
                Exemplo publico
              </p>
              <p className="mt-3 text-sm font-semibold text-[#F0EDE6]">{tool.exampleTitle}</p>
              <p className="mt-2 text-sm leading-7 text-[#A09D97]">{tool.exampleOutput}</p>
            </div>
          </section>

          <aside className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">
              Proximas acoes previstas
            </p>
            <ul className="mt-4 space-y-3">
              {tool.nextActions.map((action) => (
                <li
                  key={action}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-[#A09D97]"
                >
                  {action}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-[22px] border border-[#FF3D57]/20 bg-[#FF3D57]/8 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#FF3D57]">
                Status Sprint 1
              </p>
              <p className="mt-2 text-sm leading-6 text-[#F0EDE6]">
                Pagina pronta, catalogo pronto e shell compartilhado pronto. A camada de geracao entra
                na sequencia do roadmap.
              </p>
            </div>

            <Link
              href="/sextou-tools-pro/dashboard"
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-4 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Voltar ao dashboard PRO
            </Link>
          </aside>
        </div>
      </SextouToolsProAppShell>
    </div>
  )
}
