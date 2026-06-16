import Link from "next/link"
import { SextouToolsProTool } from "@/types/sextou-tools-pro"

const categoryLabel: Record<SextouToolsProTool["category"], string> = {
  communication: "Comunicacao",
  sales: "Vendas",
  content: "Conteudo",
}

export function SextouToolsProCard({
  tool,
  href,
}: {
  tool: SextouToolsProTool
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[24px] border border-white/10 bg-[#171717] p-6 transition hover:-translate-y-0.5 hover:border-[#FF3D57]/40 hover:bg-[#1F1F1F]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF3D57] to-[#FF8C00] text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)]">
          {tool.icon}
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A09D97]">
          {categoryLabel[tool.category]}
        </span>
      </div>

      <h3 className="font-toolkit text-2xl font-extrabold leading-tight text-[#F0EDE6]">
        {tool.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#A09D97]">{tool.shortDescription}</p>

      <div className="mt-5 rounded-2xl border border-[#FF3D57]/20 bg-[#FF3D57]/8 px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#FF3D57]">
          Coach tip
        </p>
        <p className="mt-2 text-sm leading-6 text-[#F0EDE6]">{tool.coachTip}</p>
      </div>

      <div className="mt-auto pt-5 text-sm font-semibold text-[#FCD34D]">
        Abrir pagina independente
      </div>
    </Link>
  )
}
