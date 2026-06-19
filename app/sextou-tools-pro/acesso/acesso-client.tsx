"use client"

import Link from "next/link"
import { AlertCircle, ArrowRight, CheckCircle2, Megaphone, Shield, Sparkles, Star } from "lucide-react"
import { PagamentoStripe } from "@/components/sextou-tools-pro/pagamento-stripe"

interface AcessoPremiumClientProps {
  user: {
    fullName: string
    businessName: string
    hasActiveAds: boolean
    isPremium: boolean
  } | null
  createAdHref: string
  loginHref: string
  signupHref: string
  premiumReturnTo?: string
  requestedPath?: string | null
  premiumIntent: boolean
  premiumCancelled: boolean
}

const PRO_BENEFITS = [
  "Acesso liberado assim que o seu anuncio for publicado.",
  "Anuncio na Vitrine do Sextou.",
  "1 anuncio semanal no grupo fechado de WhatsApp do Sextou.",
]

const PREMIUM_BENEFITS = [
  "Apps Premium continuam separados e exigem anuncio ativo.",
  "Depois de virar anunciante, voce pode contratar o pacote Premium.",
  "O Premium libera os apps avancados da suite, sem alterar o fluxo atual.",
]

export function AcessoPremiumClient({
  user,
  createAdHref,
  loginHref,
  signupHref,
  premiumReturnTo,
  requestedPath,
  premiumIntent,
  premiumCancelled,
}: AcessoPremiumClientProps) {
  const hasActiveAds = !!user?.hasActiveAds
  const isPremium = !!user?.isPremium
  const canBuyPremium = hasActiveAds && !isPremium
  const alreadyUnlocked = hasActiveAds && !premiumIntent
  const alreadyPremium = hasActiveAds && isPremium

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_minmax(0,0.8fr)]">
        <div className="rounded-[28px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-7 lg:p-9">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FCD34D]">
            <Megaphone className="h-4 w-4" />
            Acesso PRO por anuncio ativo
          </div>

          <h1 className="mt-4 font-toolkit text-4xl font-extrabold leading-none tracking-[-0.04em] text-[#F0EDE6] md:text-6xl">
            Anuncie no Sextou e libere o acesso aos apps PRO.
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#F0EDE6]/88">
            Os apps consolidados na pagina <strong>SextouTools</strong> ficam disponiveis para usuarios
            com <strong>has_active_ads = TRUE</strong>. Esse acesso e liberado assim que o seu anuncio
            for publicado.
          </p>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-end gap-3">
              <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#A09D97]">Investimento</span>
              <span className="text-4xl font-extrabold text-white">US$ 30</span>
              <span className="pb-1 text-sm text-[#A09D97]">por anuncio</span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-[#F0EDE6]/90">
              {PRO_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={createAdHref}
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Criar meu anuncio
            </Link>
            {!user ? (
              <Link
                href={loginHref}
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
              >
                Ja tenho conta
              </Link>
            ) : null}
          </div>

          {!user ? (
            <p className="mt-4 text-xs leading-6 text-[#A09D97]">
              Se voce ainda nao tem cadastro, o sistema abre a criacao da conta e depois segue para a pagina de anuncio.
            </p>
          ) : null}
        </div>

        <aside className="rounded-[28px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">
            Regra Premium
          </p>
          <h2 className="mt-3 font-toolkit text-2xl font-bold text-white">
            O Premium exige primeiro um anunciante ativo.
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[#A09D97]">
            {PREMIUM_BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Star className="mt-1 h-4 w-4 shrink-0 text-[#FF8C00]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-[22px] border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-6 text-amber-100">
            Se o usuario nao tiver conta ou ainda nao for anunciante, o fluxo correto e:
            criar conta, criar o anuncio e depois voltar para contratar o Premium.
          </div>
        </aside>
      </section>

      {premiumCancelled ? (
        <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          O checkout Premium foi cancelado. Voce pode tentar novamente quando quiser.
        </div>
      ) : null}

      {requestedPath ? (
        <div className="rounded-[24px] border border-white/10 bg-[#171717] px-5 py-4 text-sm text-[#A09D97]">
          <strong className="text-white">Destino solicitado:</strong> {requestedPath}
        </div>
      ) : null}

      {alreadyPremium ? (
        <section className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Seu acesso Premium ja esta ativo.</h3>
              <p className="mt-2 text-sm leading-7 text-emerald-100/90">
                Seu perfil ja cumpre a regra de anunciante ativo e assinatura Premium.
              </p>
              <Link
                href={requestedPath || "/sextou-tools-pro/dashboard"}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Abrir meu acesso
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {alreadyUnlocked ? (
        <section className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Seu acesso PRO ja esta liberado.</h3>
              <p className="mt-2 text-sm leading-7 text-emerald-100/90">
                Como voce ja tem anuncio ativo, os apps PRO estao disponiveis dentro do SextouTools.
              </p>
              <Link
                href="/sextou-tools"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Ir para o SextouTools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-[#171717] p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF8C00]">
            <Sparkles className="h-4 w-4" />
            Passo 1
          </div>
          <h3 className="mt-4 font-toolkit text-2xl font-bold text-white">Torne-se anunciante do Sextou</h3>
          <p className="mt-3 text-sm leading-7 text-[#A09D97]">
            Esse e o requisito que libera o pacote PRO. Enquanto o seu perfil nao tiver anuncio ativo,
            os apps protegidos vao continuar apontando para esta pagina.
          </p>
          <Link
            href={createAdHref}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Criar meu anuncio
          </Link>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#171717] p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF8C00]">
            <Shield className="h-4 w-4" />
            Passo 2
          </div>
          <h3 className="mt-4 font-toolkit text-2xl font-bold text-white">Ative o Premium quando o anuncio estiver ativo</h3>
          <p className="mt-3 text-sm leading-7 text-[#A09D97]">
            Os apps Premium continuam com a mesma regra: anuncio ativo + assinatura Premium.
          </p>

          {canBuyPremium ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Seu perfil ja tem anuncio ativo. Voce ja pode contratar o pacote Premium.
              </div>
              <PagamentoStripe
                planSlug="pro"
                returnTo={premiumReturnTo}
                label="Contratar pacote Premium"
                className="w-full inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 text-sm font-semibold text-white transition hover:opacity-95"
              />
            </div>
          ) : (
            <div className="mt-6 rounded-[22px] border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
              O checkout Premium so deve ser liberado depois que o seu anuncio estiver publicado e o perfil
              receber <strong>has_active_ads = TRUE</strong>.
            </div>
          )}
        </div>
      </section>

      {premiumIntent && !canBuyPremium && !alreadyPremium ? (
        <div className="rounded-[24px] border border-[#FF8C00]/20 bg-[#FF8C00]/10 px-5 py-4 text-sm text-[#FDE7C4]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              O app Premium que voce tentou abrir continua protegido. Primeiro publique o seu anuncio.
              Depois disso, volte aqui para concluir a contratacao do Premium.
            </p>
          </div>
        </div>
      ) : null}

      {!user ? (
        <div className="rounded-[24px] border border-white/10 bg-[#171717] px-5 py-4 text-sm text-[#A09D97]">
          Ainda nao tem conta?{" "}
          <Link href={signupHref} className="font-semibold text-[#FF8C00] hover:text-[#FDBA74]">
            Criar conta agora
          </Link>
        </div>
      ) : null}
    </div>
  )
}
