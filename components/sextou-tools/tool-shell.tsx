import Link from "next/link"
import { ReactNode } from "react"
import { ShareButton } from "@/components/sextou-tools/share-button"

interface ToolShellProps {
  title: string
  phase: number
  statusLabel: string
  description: string
  children: ReactNode
}

export function ToolShell({
  title,
  phase,
  statusLabel,
  description,
  children,
}: ToolShellProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[22px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
            <span className="rounded-full border border-[#FF3D57]/30 bg-black/20 px-3 py-1 text-[#FF3D57]">
              Fase {phase}
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[#A09D97]">
              {statusLabel}
            </span>
          </div>
          <h1 className="font-toolkit text-4xl font-extrabold leading-none tracking-[-0.03em] text-[#F0EDE6] md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#A09D97]">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/sextou-tools"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
          >
            Voltar para ferramentas
          </Link>
          <ShareButton title={title} />
        </div>
      </div>

      {children}
    </div>
  )
}
