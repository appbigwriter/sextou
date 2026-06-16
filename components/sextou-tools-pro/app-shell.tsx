import Link from "next/link"
import type { ReactNode } from "react"
import { SextouToolsProTool } from "@/types/sextou-tools-pro"

export function SextouToolsProAppShell({
  tool,
  children,
}: {
  tool: SextouToolsProTool
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[24px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
            <span className="rounded-full border border-[#FF3D57]/30 bg-black/20 px-3 py-1 text-[#FF3D57]">
              Pagina independente
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[#A09D97]">
              Sprint 1
            </span>
          </div>
          <h1 className="font-toolkit text-4xl font-extrabold leading-none tracking-[-0.03em] text-[#F0EDE6] md:text-5xl">
            {tool.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#F0EDE6]/90">{tool.description}</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#FCD34D]">
              Coach tip
            </p>
            <p className="mt-2 text-sm leading-6 text-[#F0EDE6]">{tool.coachTip}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/sextou-tools-pro/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
          >
            Voltar ao dashboard PRO
          </Link>
          <Link
            href="/sextou-tools-pro"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-4 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Ver landing publica
          </Link>
        </div>
      </div>

      {children}
    </div>
  )
}
