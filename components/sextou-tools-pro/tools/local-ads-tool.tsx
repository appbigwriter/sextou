"use client"

import { useState } from "react"

interface HistoryItem {
  id: string
  title: string
  subtitle?: string
  timestamp: string
  isFavorite: boolean
  status: string
}

interface AdsVariation {
  angle: string
  headline: string
  description: string
}

interface LocalAdsToolProps {
  initialHistory: HistoryItem[]
  initialOperationalStatus: string | null
}

interface GeneratedLocalAdsResult {
  id: string
  title: string
  headline: string
  description: string
  cta: string
  whatsappVersion: string
  flyerVersion: string
  variations: AdsVariation[]
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  businessName: "",
  productOrService: "",
  cityOrRegion: "",
  targetAudience: "",
  offerOrPromotion: "",
  differentiator: "",
  adChannel: "instagram",
  desiredCta: "",
}

const channelOptions = ["instagram", "facebook", "google business profile", "whatsapp", "panfleto", "bairro local"]

function extractResultFromGeneration(generation: any): GeneratedLocalAdsResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    headline: String(output.headline || ""),
    description: String(output.description || ""),
    cta: String(output.cta || ""),
    whatsappVersion: String(output.whatsappVersion || ""),
    flyerVersion: String(output.flyerVersion || ""),
    variations: Array.isArray(output.variations)
      ? output.variations.map((item) => ({
          angle: String((item as AdsVariation).angle || ""),
          headline: String((item as AdsVariation).headline || ""),
          description: String((item as AdsVariation).description || ""),
        }))
      : [],
    nextActions: Array.isArray(output.nextActions) ? output.nextActions.map(String) : [],
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

function buildHistoryItem(generation: any): HistoryItem {
  return {
    id: generation.id,
    title: generation.title,
    subtitle:
      typeof generation.outputData === "object" &&
      generation.outputData &&
      "headline" in generation.outputData
        ? String(generation.outputData.headline)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function LocalAdsTool({ initialHistory, initialOperationalStatus }: LocalAdsToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedLocalAdsResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [operationalStatus, setOperationalStatus] = useState(initialOperationalStatus || "DRAFT")
  const [statusMessage, setStatusMessage] = useState(
    "Preencha a campanha e gere um anuncio local curto com CTA claro e variacoes por abordagem."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.businessName.trim() || !form.productOrService.trim() || !form.offerOrPromotion.trim()) {
      setStatusMessage("Revise os campos destacados: informe negocio, servico e oferta.")
      return false
    }

    if (!form.cityOrRegion.trim() || !form.targetAudience.trim() || !form.desiredCta.trim()) {
      setStatusMessage("Revise os campos destacados: informe regiao, publico e CTA.")
      return false
    }

    return true
  }

  async function generateAds(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "local-ads",
        input: form,
        sourceAction,
        sourceGenerationId,
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          payload?.code === "regeneration-limit-reached"
            ? "Voce ja usou as 2 regeneracoes deste anuncio."
            : "Voce usou suas geracoes gratuitas de hoje."
        )
      }

      throw new Error("Nao conseguimos gerar agora. Revise os campos ou tente novamente em alguns instantes.")
    }

    return payload.generation
  }

  async function handleGenerate() {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando seus anuncios locais...")

    try {
      const generation = await generateAds("GENERATE")
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
      setOperationalStatus("DRAFT")
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Anuncio criado e salvo no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um anuncio primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao do anuncio...")

    try {
      const generation = await generateAds("REGENERATE", selectedGenerationId)
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
      setOperationalStatus("DRAFT")
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Nova versao criada e salva no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos regenerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCopy(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    setStatusMessage(`${label} copiado para a area de transferencia.`)
  }

  async function handleGenerationAction(action: "favorite" | "unfavorite" | "archive" | "restore" | "delete") {
    if (!selectedGenerationId || !result) {
      return
    }

    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations/${selectedGenerationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar esse anuncio agora.")
      }

      const payload = await response.json()
      const updated = payload.generation

      setResult((current) =>
        current
          ? {
              ...current,
              isFavorite: Boolean(updated.isFavorite),
              status: String(updated.status),
            }
          : current
      )

      setHistory((current) =>
        current.map((item) =>
          item.id === updated.id
            ? {
                ...item,
                isFavorite: Boolean(updated.isFavorite),
                status: String(updated.status),
              }
            : item
        )
      )

      if (action === "favorite") setStatusMessage("Anuncio salvo como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Anuncio removido dos favoritos.")
      if (action === "archive") setStatusMessage("Anuncio arquivado.")
      if (action === "restore") setStatusMessage("Anuncio restaurado.")
      if (action === "delete") setStatusMessage("Anuncio removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o anuncio.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleDuplicate() {
    if (!selectedGenerationId) {
      return
    }

    setIsActionLoading(true)

    try {
      const response = await fetch("/api/sextou-tools-pro/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceGenerationId: selectedGenerationId }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error("Nao foi possivel duplicar esse anuncio agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Anuncio duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleOperationalStatusChange(nextStatus: string) {
    if (!selectedGenerationId) {
      return
    }

    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations/${selectedGenerationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-operational-status",
          operationalStatus: nextStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar o status operacional.")
      }

      setOperationalStatus(nextStatus)
      setStatusMessage(nextStatus === "EM_USO" ? "Campanha marcada como em uso." : "Campanha marcada como rascunho.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o status operacional.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "launch" | "offer" | "followup") {
    if (!result) {
      return
    }

    const baseAd = [
      `Headline: ${result.headline}`,
      `Descricao: ${result.description}`,
      `CTA: ${result.cta}`,
      `WhatsApp: ${result.whatsappVersion}`,
    ].join("\n")

    const text =
      kind === "launch"
        ? `Crie um plano de lancamento com base neste anuncio:\n\n${baseAd}`
        : kind === "offer"
          ? `Crie uma oferta irresistivel com base neste anuncio:\n\n${baseAd}`
          : `Crie uma sequencia de follow-up com base neste anuncio:\n\n${baseAd}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "launch"
        ? "Brief de plano de lancamento copiado."
        : kind === "offer"
          ? "Brief de oferta irresistivel copiado."
          : "Brief de sequencia de follow-up copiado."
    )
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const textareaClass =
    "min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nome do negocio</label>
            <input
              className={fieldClass}
              value={form.businessName}
              onChange={(event) => updateField("businessName", event.target.value)}
              placeholder="Ex.: Casa Leve Cleaning"
            />
          </div>
          <div>
            <label className={labelClass}>Canal do anuncio</label>
            <select
              className={fieldClass}
              value={form.adChannel}
              onChange={(event) => updateField("adChannel", event.target.value)}
            >
              {channelOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Produto ou servico</label>
            <input
              className={fieldClass}
              value={form.productOrService}
              onChange={(event) => updateField("productOrService", event.target.value)}
              placeholder="Ex.: limpeza residencial premium"
            />
          </div>
          <div>
            <label className={labelClass}>Cidade ou regiao</label>
            <input
              className={fieldClass}
              value={form.cityOrRegion}
              onChange={(event) => updateField("cityOrRegion", event.target.value)}
              placeholder="Ex.: Orlando e regiao"
            />
          </div>
          <div>
            <label className={labelClass}>Publico-alvo</label>
            <input
              className={fieldClass}
              value={form.targetAudience}
              onChange={(event) => updateField("targetAudience", event.target.value)}
              placeholder="Ex.: brasileiras ocupadas"
            />
          </div>
          <div>
            <label className={labelClass}>CTA desejada</label>
            <input
              className={fieldClass}
              value={form.desiredCta}
              onChange={(event) => updateField("desiredCta", event.target.value)}
              placeholder="Ex.: chame no WhatsApp hoje"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Oferta ou promocao</label>
            <textarea
              className={textareaClass}
              value={form.offerOrPromotion}
              onChange={(event) => updateField("offerOrPromotion", event.target.value)}
              placeholder="Ex.: 10% na primeira limpeza ou avaliacao inicial gratuita."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Diferencial</label>
            <textarea
              className={textareaClass}
              value={form.differentiator}
              onChange={(event) => updateField("differentiator", event.target.value)}
              placeholder="Ex.: atendimento claro, checklist proprio, pontualidade e suporte rapido."
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isSubmitting ? "Gerando..." : "Gerar anuncio"}
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isSubmitting || !selectedGenerationId}
            className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
          >
            Regenerar
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(initialForm)
              setStatusMessage("Formulario limpo.")
            }}
            className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6]"
          >
            Limpar
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">
          {statusMessage}
        </p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">
                Resultado gerado
              </p>
              <h2 className="mt-2 font-toolkit text-2xl font-extrabold text-[#F0EDE6]">
                {result ? result.title : "Seu anuncio aparece aqui"}
              </h2>
            </div>
            {result ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A09D97]">
                {result.status === "ARCHIVED" ? "Arquivado" : "Ativo"}
              </span>
            ) : null}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Headline
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.headline, "Headline")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.headline}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Descricao
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.description, "Descricao")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.description}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    CTA
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.cta, "CTA")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.cta}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Versao para WhatsApp
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.whatsappVersion, "Versao para WhatsApp")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.whatsappVersion}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Versao para panfleto
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.flyerVersion, "Versao para panfleto")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.flyerVersion}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Variacoes de abordagem
                </p>
                <div className="mt-3 space-y-3">
                  {result.variations.map((item, index) => (
                    <div key={`${item.angle}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-[#F0EDE6]">{item.angle}</p>
                        <button
                          type="button"
                          onClick={() => handleCopy(`${item.headline}\n${item.description}`, `Variacao ${index + 1}`)}
                          className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                        >
                          Copiar
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-[#F0EDE6]">{item.headline}</p>
                      <p className="mt-2 text-sm leading-6 text-[#A09D97]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => handleGenerationAction(result.isFavorite ? "unfavorite" : "favorite")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                >
                  {result.isFavorite ? "Remover favorito" : "Salvar como template"}
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={handleDuplicate}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                >
                  Duplicar resultado
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() =>
                    handleOperationalStatusChange(operationalStatus === "EM_USO" ? "DRAFT" : "EM_USO")
                  }
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50 md:col-span-2"
                >
                  {operationalStatus === "EM_USO" ? "Marcar como rascunho" : "Marcar campanha como em uso"}
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("launch")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar plano de lancamento
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("offer")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar oferta irresistivel
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("followup")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar sequencia de follow-up
                </button>
                <button
                  type="button"
                  disabled={isActionLoading || result.status === "ARCHIVED"}
                  onClick={() => handleGenerationAction("archive")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6] disabled:opacity-50"
                >
                  Arquivar
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() =>
                    handleGenerationAction(result.status === "ARCHIVED" ? "restore" : "delete")
                  }
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-[#FF3D57]/20 bg-[#FF3D57]/8 px-4 text-sm font-semibold text-[#FFD7DD] transition hover:bg-[#FF3D57]/12 disabled:opacity-50"
                >
                  {result.status === "ARCHIVED" ? "Restaurar" : "Excluir da biblioteca"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#A09D97]">
              Voce ainda nao criou nenhum anuncio neste app. Preencha o formulario e gere sua primeira versao em poucos segundos.
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">
            Biblioteca recente
          </p>
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#A09D97]">
                Seu historico deste app vai aparecer aqui conforme voce gerar novos anuncios.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#F0EDE6]">{item.title}</p>
                      {item.subtitle ? <p className="mt-1 line-clamp-2 text-xs text-[#A09D97]">{item.subtitle}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isFavorite ? (
                        <span className="rounded-full border border-[#FCD34D]/30 bg-[#FCD34D]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FCD34D]">
                          Fav
                        </span>
                      ) : null}
                      {item.status === "ARCHIVED" ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                          Arq
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-xs text-[#A09D97]">{item.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
