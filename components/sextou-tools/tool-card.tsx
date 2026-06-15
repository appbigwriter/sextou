import Link from "next/link"
import { ToolkitTool } from "@/types/sextou-tools"

const statusLabel: Record<ToolkitTool["status"], string> = {
  planned: "Em breve",
  beta: "Beta",
  live: "Disponivel",
}

export function ToolCard({ tool }: { tool: ToolkitTool }) {
  return (
    <Link
      href={`/sextou-tools/${tool.slug}`}
      className="group flex h-full flex-col rounded-[22px] border border-white/10 bg-[#171717] p-6 transition hover:-translate-y-0.5 hover:border-[#FF3D57]/40 hover:bg-[#1F1F1F]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF3D57] to-[#FF8C00] text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)]">
          {tool.icon}
        </div>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-[0.16em]">
          <span className="rounded-full border border-[#FF3D57]/30 bg-[#FF3D57]/12 px-3 py-1 text-[#FF3D57]">
            Fase {tool.phase}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[#A09D97]">
            {statusLabel[tool.status]}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-toolkit text-2xl font-extrabold leading-tight text-[#F0EDE6]">
          {tool.title}
        </h3>
      </div>

      <p className="mb-5 text-sm leading-6 text-[#A09D97]">{tool.shortDescription}</p>
      <p className="mt-auto text-sm font-semibold text-[#FCD34D]">{tool.highlight}</p>
    </Link>
  )
}
