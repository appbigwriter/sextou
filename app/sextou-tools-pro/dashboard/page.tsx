import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { SextouToolsProCard } from "@/components/sextou-tools-pro/tool-card"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { SextouToolsProHistoryList } from "@/components/sextou-tools-pro/history-list"
import { getSextouToolsProCatalog } from "@/lib/sextou-tools-pro/catalog"
import { listRecentSextouToolsProGenerations } from "@/lib/sextou-tools-pro/history"
import { getOperationalStatus } from "@/lib/sextou-tools-pro/metadata"
import { listSextouToolsProUsageSummary } from "@/lib/sextou-tools-pro/usage"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"

export const metadata: Metadata = {
  title: "Dashboard | SextouTools PRO",
  description: "Dashboard autenticado do SextouTools PRO.",
}

export default async function SextouToolsProDashboardPage() {
  const result = await resolveSextouToolsProUser()

  if (result.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/dashboard")
  }

  if (result.kind === "forbidden") {
    redirect("/sextou-tools-pro/acesso")
  }

  const user =
    result.kind === "ok"
      ? result.user
      : {
          fullName: "Banco indisponivel",
          businessName: "SextouTools PRO aguardando conexao",
          id: "",
        }

  const tools = getSextouToolsProCatalog()
  const liveToolsCount = tools.filter((tool) => tool.status === "live").length
  const usage =
    result.kind === "ok"
      ? await listSextouToolsProUsageSummary(user.id)
      : { dailyLimit: 5, usedToday: 0, remainingToday: 5 }
  const recentHistory =
    result.kind === "ok" ? await listRecentSextouToolsProGenerations(user.id, 6) : []
  const historyItems = recentHistory.map((item) => ({
    title: item.title,
    subtitle: [item.appId, getOperationalStatus(item.metadataJson)].filter(Boolean).join(" • "),
    timestamp: item.createdAt.toLocaleString("pt-BR"),
  }))
  const usedPercent = Math.min(Math.round((usage.usedToday / usage.dailyLimit) * 100), 100)

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <SextouToolsProSuiteHeader userName={user.fullName} businessName={user.businessName} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1.25fr_minmax(0,0.75fr)]">
          <div className="rounded-[28px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-7">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF3D57]">
              Dashboard autenticado
            </p>
            <h1 className="font-toolkit text-4xl font-extrabold leading-none tracking-[-0.03em] text-[#F0EDE6] md:text-5xl">
              SextouTools PRO
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F0EDE6]/88">
              Cada ferramenta abaixo abre em uma pagina propria e independente. O MVP Core do
              `SextouTools PRO` ja esta publicado com historico, limites, favoritos, duplicacao e
              pipeline compartilhado de geracao.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-[#A09D97]">
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">5 geracoes por dia</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">2 regeneracoes por resultado</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">{liveToolsCount} apps live</span>
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-[#171717] p-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">Uso do dia</p>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-[#F0EDE6]">
                  {usage.usedToday} de {usage.dailyLimit} geracoes usadas
                </span>
                <span className="font-mono text-[#A09D97]">{usedPercent}%</span>
              </div>
              <div className="h-3 rounded-full bg-black/20">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#FF3D57] to-[#FF8C00]"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#A09D97]">
              Restam {usage.remainingToday} geracoes hoje. Regeneracoes consomem esse limite e ficam
              limitadas a 2 por resultado.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/sextou-tools-pro"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
              >
                Ver landing publica
              </Link>
              <Link
                href="/sextou-tools"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-4 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Suite atual
              </Link>
            </div>
          </aside>
        </section>

        {result.kind === "db-unavailable" ? (
          <div className="mb-8 rounded-[24px] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm leading-6 text-amber-100">
            O banco da suite esta temporariamente indisponivel. O dashboard continua navegavel, mas
            historico e uso diario real ficam pausados ate a conexao voltar.
          </div>
        ) : null}

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">Historico recente</p>
            <span className="text-xs text-[#A09D97]">Persistido por usuario</span>
          </div>
          <SextouToolsProHistoryList items={historyItems} />
        </section>

        <section>
          <div className="mb-5">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">Apps publicados no dashboard</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#A09D97]">
              Os cards abaixo ja respeitam a regra estrutural da suite: cada mini-app abre em sua
              propria pagina independente.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <SextouToolsProCard key={tool.slug} tool={tool} href={`/sextou-tools-pro/${tool.slug}`} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
