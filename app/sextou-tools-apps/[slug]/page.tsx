import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, ArrowRight, Sparkles, Lock, Rocket, Star } from "lucide-react"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import {
  canOpenSextouToolsShowcaseApp,
  getSextouToolsShowcaseAccessHref,
  getSextouToolsShowcaseApp,
} from "@/lib/sextou-tools-pro/showcase"
import { resolveToolkitUser } from "@/lib/sextou-tools/auth"

const PACKAGE_COPY = {
  pro: {
    label: "Pacote PRO",
    note: "Liberado para anunciantes ativos do Sextou.",
  },
  premium: {
    label: "Pacote Premium",
    note: "Exige anuncio ativo e assinatura Premium.",
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const app = getSextouToolsShowcaseApp(params.slug)

  if (!app) {
    return {
      title: "App nao encontrado | SextouTools",
    }
  }

  return {
    title: `${app.title} | SextouTools`,
    description: app.shortDescription,
  }
}

export default async function SextouToolsAppShowcasePage({
  params,
}: {
  params: { slug: string }
}) {
  const app = getSextouToolsShowcaseApp(params.slug)

  if (!app) {
    notFound()
  }

  const userResult = await resolveToolkitUser()
  const user = userResult.kind === "ok" ? userResult.user : null
  const canOpen = canOpenSextouToolsShowcaseApp(app.slug, user)
  const accessHref = getSextouToolsShowcaseAccessHref(app.slug)
  const packageCopy = PACKAGE_COPY[app.packageType]

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <SextouToolsProSuiteHeader
        userName={user?.fullName}
        businessName={user?.businessName}
        showPublicNav={!user}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
          <div className="rounded-[32px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.18),rgba(255,140,0,0.12))] p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="rounded-full bg-black/20 px-3 py-1 text-[#FCD34D]">{packageCopy.label}</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[#A09D97]">
                {app.availability === "live" ? "App publicado" : "Em breve"}
              </span>
            </div>

            <div className="mt-6 flex items-start gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#FF3D57] to-[#FF8C00] text-lg font-extrabold text-white shadow-[0_16px_50px_rgba(255,61,87,0.25)]">
                {app.icon}
              </div>
              <div className="flex-1">
                <h1 className="font-toolkit text-4xl font-extrabold leading-none tracking-[-0.04em] text-white md:text-6xl">
                  {app.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#F0EDE6]/88">
                  {app.heroDescription}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={accessHref}
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Quero usar esse app
              </Link>
              {canOpen ? (
                <Link
                  href={app.actualPath}
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Abrir app agora
                </Link>
              ) : null}
            </div>

            <p className="mt-4 text-sm text-[#A09D97]">
              {packageCopy.note}
            </p>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[#171717] p-6 lg:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5A5755]">
              O que esse app entrega
            </p>
            <div className="mt-5 space-y-4">
              {app.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3DDC97]" />
                  <p className="text-sm leading-7 text-[#F0EDE6]">{feature}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_minmax(0,1.05fr)]">
          <div className="rounded-[28px] border border-white/10 bg-[#171717] p-6 lg:p-8">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF8C00]">
              <Rocket className="h-4 w-4" />
              Aplicacoes praticas
            </div>
            <h2 className="mt-3 font-toolkit text-3xl font-bold text-white">
              Como isso entra na vida real de um empreendedor
            </h2>
            <div className="mt-6 space-y-4">
              {app.practicalExamples.map((example) => (
                <div key={example} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <p className="text-sm leading-7 text-[#A09D97]">{example}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#171717] p-6 lg:p-8">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF8C00]">
              <Sparkles className="h-4 w-4" />
              Exemplo de resultado
            </div>
            <h2 className="mt-3 font-toolkit text-3xl font-bold text-white">
              {app.exampleTitle}
            </h2>
            <div className="mt-6 rounded-[24px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.10),rgba(255,140,0,0.08))] p-6">
              <p className="text-base leading-8 text-[#F0EDE6]/90">
                {app.exampleOutcome}
              </p>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#FCD34D]" />
                <p className="text-sm leading-7 text-[#A09D97]">
                  O clique em <strong className="text-white">Quero usar esse app</strong> leva voce para a
                  pagina de acesso, onde o Sextou explica o caminho para liberar esse recurso no seu perfil.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-white/10 bg-[#171717] px-6 py-10 text-center lg:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF8C00]">
              <Star className="h-4 w-4" />
              Funil sutil
            </div>
            <h2 className="mt-4 font-toolkit text-4xl font-extrabold text-white">
              Primeiro entenda o valor. Depois libere o acesso certo.
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#A09D97]">
              Esse app foi desenhado para reduzir improviso, economizar tempo e aumentar clareza comercial.
              Se fizer sentido para o seu momento, o proximo passo e liberar o acesso pelo fluxo do Sextou.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={accessHref}
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Quero usar esse app
              </Link>
              <Link
                href="/sextou-tools"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
              >
                Voltar para os pacotes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
