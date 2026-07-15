"use client"

import { useState } from "react"

interface OnboardingBannerProps {
  initialBusinessType?: string | null
  initialWhatYouSell?: string | null
  initialIdealCustomer?: string | null
  initialMainSalesChannel?: string | null
  initialPreferredLanguage?: string | null
}

const CHANNEL_OPTIONS = [
  "WhatsApp",
  "Instagram",
  "Google Business",
  "Loja fisica",
  "Indicacao",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "Site proprio",
  "Marketplace",
  "Outro",
]

const LANGUAGE_OPTIONS = [
  { value: "pt-BR", label: "Portugues (Brasil)" },
  { value: "en", label: "Ingles" },
  { value: "es", label: "Espanhol" },
]

export function OnboardingBanner({
  initialBusinessType,
  initialWhatYouSell,
  initialIdealCustomer,
  initialMainSalesChannel,
  initialPreferredLanguage,
}: OnboardingBannerProps) {
  const [open, setOpen] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [businessType, setBusinessType] = useState(initialBusinessType || "")
  const [whatYouSell, setWhatYouSell] = useState(initialWhatYouSell || "")
  const [idealCustomer, setIdealCustomer] = useState(initialIdealCustomer || "")
  const [mainSalesChannel, setMainSalesChannel] = useState(initialMainSalesChannel || "")
  const [preferredLanguage, setPreferredLanguage] = useState(initialPreferredLanguage || "pt-BR")

  const isComplete =
    Boolean(initialBusinessType) &&
    Boolean(initialWhatYouSell) &&
    Boolean(initialIdealCustomer) &&
    Boolean(initialMainSalesChannel)

  if (isComplete || !open) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/sextou-tools-pro/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: businessType || null,
          whatYouSell: whatYouSell || null,
          idealCustomer: idealCustomer || null,
          mainSalesChannel: mainSalesChannel || null,
          preferredLanguage,
        }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setOpen(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="mb-8 rounded-[24px] border border-[#1FBA7A]/20 bg-[#1FBA7A]/10 px-6 py-5">
        <p className="text-sm font-semibold text-[#1FBA7A]">
          Perfil comercial salvo! Suas proximas geracoes de IA vao usar esse contexto.
        </p>
      </div>
    )
  }

  return (
    <div className="mb-8 rounded-[24px] border border-[#FF3D57]/20 bg-[#171717] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#FF3D57]">
            Configure seu perfil comercial
          </p>
          <p className="mt-2 text-sm leading-7 text-[#A09D97]">
            Responda 4 perguntas rapidas para que a IA gere conteudo mais proximo da sua realidade.
            Voce pode preencher depois nas configuracoes.
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="shrink-0 rounded-xl border border-white/10 px-3 py-1 text-[11px] font-semibold text-[#A09D97] transition hover:bg-white/5"
        >
          Depois
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A5755]">
            Tipo de negocio
          </label>
          <input
            type="text"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            placeholder="Ex: Salao de beleza, Restaurante, Consultoria..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] placeholder-[#5A5755] outline-none transition focus:border-[#FF3D57]/40"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A5755]">
            O que voce vende?
          </label>
          <input
            type="text"
            value={whatYouSell}
            onChange={(e) => setWhatYouSell(e.target.value)}
            placeholder="Ex: Cortes de cabelo, Marmitex, Consultoria financeira..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] placeholder-[#5A5755] outline-none transition focus:border-[#FF3D57]/40"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A5755]">
            Quem e seu cliente ideal?
          </label>
          <input
            type="text"
            value={idealCustomer}
            onChange={(e) => setIdealCustomer(e.target.value)}
            placeholder="Ex: Mulheres 25-45 que buscam autocuidado..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] placeholder-[#5A5755] outline-none transition focus:border-[#FF3D57]/40"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A5755]">
            Canal principal de venda
          </label>
          <select
            value={mainSalesChannel}
            onChange={(e) => setMainSalesChannel(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition focus:border-[#FF3D57]/40"
          >
            <option value="" className="bg-[#171717]">Selecione...</option>
            {CHANNEL_OPTIONS.map((ch) => (
              <option key={ch} value={ch} className="bg-[#171717]">{ch}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A5755]">
            Idioma preferido para gerar conteudos
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setPreferredLanguage(lang.value)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  preferredLanguage === lang.value
                    ? "bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-white"
                    : "border border-white/10 bg-white/5 text-[#A09D97] hover:bg-white/10"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar perfil comercial"}
        </button>
        <p className="text-[11px] text-[#5A5755]">
          Pode preencher apenas o que souber agora. Melhora com o tempo.
        </p>
      </div>
    </div>
  )
}
