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

interface OfferGeneratorToolProps {
  initialHistory: HistoryItem[]
  initialOperationalStatus: string | null
}

interface GeneratedOfferResult {
  id: string
  title: string
  offerName: string
  headline: string
  promise: string
  structure: string[]
  suggestedBonuses: string[]
  suggestedGuarantee: string
  ethicalUrgency: string
  whatsappCta: string
  shortPostVersion: string
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  productOrService: "",
  targetAudience: "",
  problemSolved: "",
  mainBenefit: "",
  priceRange: "",
  bonus: "",
  guarantee: "",
  tone: "consultivo",
}

const toneOptions = ["consultivo", "direto", "premium", "caloroso", "profissional"]

function extractResultFromGeneration(generation: any): GeneratedOfferResult {
  const output = generation.outputData as Record<string, string | string[]>

  return {
    id: generation.id,
    title: generation.title,
    offerName: String(output.offerName || ""),
    headline: String(output.headline || ""),
    promise: String(output.promise || ""),
    structure: Array.isArray(output.structure) ? output.structure.map(String) : [],
    suggestedBonuses: Array.isArray(output.suggestedBonuses)
      ? output.suggestedBonuses.map(String)
      : [],
    suggestedGuarantee: String(output.suggestedGuarantee || ""),
    ethicalUrgency: String(output.ethicalUrgency || ""),
    whatsappCta: String(output.whatsappCta || ""),
    shortPostVersion: String(output.shortPostVersion || ""),
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

export function OfferGeneratorTool({
  initialHistory,
  initialOperationalStatus,
}: OfferGeneratorToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedOfferResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Descreva sua oferta e gere uma estrutura comercial pronta para adaptar e publicar."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [operationalStatus, setOperationalStatus] = useState(initialOperationalStatus || "ACTIVE")

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.productOrService.trim()) {
      setStatusMessage("Revise os campos destacados: informe o produto ou servico.")
      return false
    }

    if (!form.targetAudience.trim()) {
      setStatusMessage("Revise os campos destacados: informe o publico-alvo.")
      return false
    }

    if (!form.problemSolved.trim()) {
      setStatusMessage("Revise os campos destacados: descreva o problema que voce resolve.")
      return false
    }

    if (!form.mainBenefit.trim()) {
      setStatusMessage("Revise os campos destacados: informe o beneficio principal.")
      return false
    }

    return true
  }

  async function generateOffer(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appId: "gerador-oferta-irresistivel",
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
            ? "Voce ja usou as 2 regeneracoes desta oferta."
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
    setStatusMessage("Montando sua oferta comercial... isso costuma levar poucos segundos.")

    try {
      const generation = await generateOffer("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setOperationalStatus("ACTIVE")
      setStatusMessage("Oferta criada e salva no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere uma oferta primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao da oferta...")

    try {
      const generation = await generateOffer("REGENERATE", selectedGenerationId)
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setOperationalStatus("ACTIVE")
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
        throw new Error("Nao foi possivel atualizar essa oferta agora.")
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

      if (action === "favorite") setStatusMessage("Oferta salva como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Oferta removida dos favoritos.")
      if (action === "archive") setStatusMessage("Oferta arquivada.")
      if (action === "restore") setStatusMessage("Oferta restaurada.")
      if (action === "delete") setStatusMessage("Oferta removida da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a oferta.")
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
        throw new Error("Nao foi possivel duplicar essa oferta agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Oferta duplicada no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleOperationalStatus(nextStatus: "ACTIVE" | "TESTED") {
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
        throw new Error("Nao foi possivel atualizar o status operacional da oferta.")
      }

      setOperationalStatus(nextStatus)
      setStatusMessage(nextStatus === "TESTED" ? "Oferta marcada como testada." : "Oferta marcada como ativa.")
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Nao foi possivel atualizar o status operacional."
      )
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "ad" | "reels" | "proposal") {
    if (!result) {
      return
    }

    const baseOffer = [
      `Nome da oferta: ${result.offerName}`,
      `Headline: ${result.headline}`,
      `Promessa: ${result.promise}`,
      `Estrutura: ${result.structure.join(" | ")}`,
      `CTA WhatsApp: ${result.whatsappCta}`,
    ].join("\n")

    const text =
      kind === "ad"
        ? `Crie um anuncio local com base nesta oferta:\n\n${baseOffer}`
        : kind === "reels"
          ? `Crie um roteiro de Reels com base nesta oferta:\n\n${baseOffer}`
          : `Crie uma proposta comercial com base nesta oferta:\n\n${baseOffer}`

    await navigator.clipboard.writeText(text)

    if (kind === "ad") {
      setStatusMessage("Brief de anuncio local copiado.")
      return
    }

    if (kind === "reels") {
      setStatusMessage("Brief de roteiro de Reels copiado.")
      return
    }

    setStatusMessage("Brief de proposta comercial copiado.")
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const textareaClass =
    "min-h-[132px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
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
            <label className={labelClass}>Publico-alvo</label>
            <input
              className={fieldClass}
              value={form.targetAudience}
              onChange={(event) => updateField("targetAudience", event.target.value)}
              placeholder="Ex.: brasileiras ocupadas na Florida"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Problema que resolve</label>
            <textarea
              className={textareaClass}
              value={form.problemSolved}
              onChange={(event) => updateField("problemSolved", event.target.value)}
              placeholder="Explique a dor principal que hoje impede a cliente de avancar ou comprar."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Beneficio principal</label>
            <textarea
              className={textareaClass}
              value={form.mainBenefit}
              onChange={(event) => updateField("mainBenefit", event.target.value)}
              placeholder="Descreva o resultado principal que a cliente percebe depois da compra."
            />
          </div>
          <div>
            <label className={labelClass}>Faixa de preco</label>
            <input
              className={fieldClass}
              value={form.priceRange}
              onChange={(event) => updateField("priceRange", event.target.value)}
              placeholder="Ex.: a partir de $180"
            />
          </div>
          <div>
            <label className={labelClass}>Tom de comunicacao</label>
            <select
              className={fieldClass}
              value={form.tone}
              onChange={(event) => updateField("tone", event.target.value)}
            >
              {toneOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Bonus opcional</label>
            <input
              className={fieldClass}
              value={form.bonus}
              onChange={(event) => updateField("bonus", event.target.value)}
              placeholder="Ex.: organizacao rapida da cozinha"
            />
          </div>
          <div>
            <label className={labelClass}>Garantia opcional</label>
            <input
              className={fieldClass}
              value={form.guarantee}
              onChange={(event) => updateField("guarantee", event.target.value)}
              placeholder="Ex.: ajuste inicial se algo nao sair como combinado"
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
            {isSubmitting ? "Gerando..." : "Gerar oferta"}
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
                {result ? result.offerName : "Sua oferta aparece aqui"}
              </h2>
            </div>
            {result ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A09D97]">
                {result.status === "ARCHIVED"
                  ? "Arquivada"
                  : operationalStatus === "TESTED"
                    ? "Testada"
                    : "Ativa"}
              </span>
            ) : null}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Headline principal
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.headline, "Headline principal")}
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
                    Promessa clara
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.promise, "Promessa clara")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.promise}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Estrutura da oferta
                </p>
                <div className="mt-3 space-y-2">
                  {result.structure.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                      <p className="text-sm leading-6 text-[#F0EDE6]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Bonus sugeridos
                  </p>
                  <div className="mt-3 space-y-2">
                    {result.suggestedBonuses.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Garantia sugerida
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#F0EDE6]">{result.suggestedGuarantee}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Urgencia etica
                </p>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.ethicalUrgency}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    CTA para WhatsApp
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.whatsappCta, "CTA para WhatsApp")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.whatsappCta}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Versao curta para post
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.shortPostVersion, "Versao curta para post")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.shortPostVersion}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() =>
                    handleOperationalStatus(operationalStatus === "TESTED" ? "ACTIVE" : "TESTED")
                  }
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                >
                  {operationalStatus === "TESTED" ? "Marcar ativa" : "Marcar testada"}
                </button>
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
                  onClick={() => handlePostActionCopy("ad")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar anuncio local
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("reels")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar roteiro de Reels
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("proposal")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar proposta comercial
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
              Voce ainda nao criou nenhuma oferta neste app. Preencha o formulario e gere sua
              primeira versao em poucos segundos.
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novas ofertas.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#F0EDE6]">{item.title}</p>
                      {item.subtitle ? (
                        <p className="mt-1 line-clamp-2 text-xs text-[#A09D97]">{item.subtitle}</p>
                      ) : null}
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

        <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6 text-sm leading-7 text-[#A09D97]">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">
            Aviso
          </p>
          <p className="mt-4">
            O foco aqui e estruturar uma oferta mais clara e vendavel, nao prometer resultado
            absoluto. Revise a proposta antes de publicar quando envolver garantia, urgencia ou
            condicoes comerciais mais sensiveis.
          </p>
        </div>
      </aside>
    </div>
  )
}
