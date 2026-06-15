import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ToolShell } from "@/components/sextou-tools/tool-shell"
import { getToolkitTool } from "@/lib/sextou-tools/catalog"

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

export default function ToolkitToolPage({
  params,
}: {
  params: { slug: string }
}) {
  const tool = getToolkitTool(params.slug)

  if (!tool) {
    notFound()
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
        </aside>
      </div>
    </ToolShell>
  )
}
