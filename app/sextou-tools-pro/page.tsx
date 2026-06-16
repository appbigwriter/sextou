import type { Metadata } from "next"
import Link from "next/link"
import { SextouToolsProCard } from "@/components/sextou-tools-pro/tool-card"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { getSextouToolsProCatalog, groupSextouToolsProCatalogByCategory } from "@/lib/sextou-tools-pro/catalog"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "SextouTools PRO | Ferramentas gratuitas com IA leve",
  description:
    "Landing publica do SextouTools PRO com apps gratuitos para empreendedores criarem respostas, ofertas, conteudo e propostas.",
}

function CategorySection({
  title,
  description,
  tools,
  isLoggedIn,
}: {
  title: string
  description: string
  tools: ReturnType<typeof getSextouToolsProCatalog>
  isLoggedIn: boolean
}) {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">{title}</p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#A09D97]">{description}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <SextouToolsProCard
            key={tool.slug}
            tool={tool}
            href={isLoggedIn ? `/sextou-tools-pro/${tool.slug}` : `/login?next=/sextou-tools-pro/${tool.slug}`}
          />
        ))}
      </div>
    </section>
  )
}

export default async function SextouToolsProLandingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.email
  const { communication, sales, content } = groupSextouToolsProCatalogByCategory()

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <SextouToolsProSuiteHeader showPublicNav />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1.3fr_minmax(0,0.7fr)]">
          <div className="rounded-[28px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-7 lg:p-9">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF3D57]">
              PRO para membros cadastrados
            </p>
            <h1 className="font-toolkit text-5xl font-extrabold leading-none tracking-[-0.04em] text-[#F0EDE6] md:text-6xl">
              Crie respostas, ofertas, conteudo e propostas em poucos segundos.
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#F0EDE6]/88">
              O SextouTools PRO nasce como uma suite de mini-apps com IA leve. Cada app tem sua
              propria pagina, fluxo proprio e objetivo unico para ajudar empreendedores brasileiros
              a vender, comunicar e operar melhor.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-[#A09D97]">
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Landing publica</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Login para gerar</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Paginas independentes por app</span>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={isLoggedIn ? "/sextou-tools-pro/dashboard" : "/cadastro"}
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {isLoggedIn ? "Abrir dashboard PRO" : "Criar minha conta gratis"}
              </Link>
              <Link
                href="/sextou-tools"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
              >
                Ver suite atual
              </Link>
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-[#171717] p-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">
              O que voce encontra no MVP Core
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#A09D97]">
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Respostas prontas para WhatsApp</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Gerador de oferta irresistivel</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Calendario de conteudo de 7 dias</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Proposta comercial one-page</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Roteiro de Reels/Shorts de 30s</li>
            </ul>
          </aside>
        </section>

        <CategorySection
          title="Comunicacao"
          description="Ferramentas para responder mais rapido, com mais clareza e consistencia comercial."
          tools={communication}
          isLoggedIn={isLoggedIn}
        />
        <CategorySection
          title="Vendas"
          description="Ferramentas para transformar servicos e atendimentos em oferta e proposta mais objetivas."
          tools={sales}
          isLoggedIn={isLoggedIn}
        />
        <CategorySection
          title="Conteudo"
          description="Ferramentas para sair do branco e publicar com mais consistencia ao longo da semana."
          tools={content}
          isLoggedIn={isLoggedIn}
        />
      </main>
    </div>
  )
}
