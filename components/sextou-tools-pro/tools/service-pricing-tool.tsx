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

interface PricingRange {
  min: number
  max: number
}

interface ServicePricingToolProps {
  initialHistory: HistoryItem[]
}

interface GeneratedServicePricingResult {
  id: string
  title: string
  scenarioLabel: string
  baseCalculation: number
  minimumSuggestedRange: PricingRange
  recommendedRange: PricingRange
  premiumRange: PricingRange
  pricingExplanation: string
  presentationSuggestion: string
  lowPriceAlerts: string[]
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  serviceName: "",
  estimatedHours: "2",
  directCost: "0",
  indirectCost: "0",
  desiredMargin: "30",
  experienceLevel: "pleno",
  serviceComplexity: "media",
  minimumAcceptableValue: "",
}

const experienceOptions = ["iniciante", "pleno", "experiente", "especialista"]
const complexityOptions = ["baixa", "media", "alta"]

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatRange(range: PricingRange) {
  return `${formatMoney(Number(range?.min || 0))} a ${formatMoney(Number(range?.max || 0))}`
}

function extractResultFromGeneration(generation: any): GeneratedServicePricingResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    scenarioLabel: String(output.scenarioLabel || ""),
    baseCalculation: Number(output.baseCalculation || 0),
    minimumSuggestedRange: output.minimumSuggestedRange as PricingRange,
    recommendedRange: output.recommendedRange as PricingRange,
    premiumRange: output.premiumRange as PricingRange,
    pricingExplanation: String(output.pricingExplanation || ""),
    presentationSuggestion: String(output.presentationSuggestion || ""),
    lowPriceAlerts: Array.isArray(output.lowPriceAlerts) ? output.lowPriceAlerts.map(String) : [],
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
      "recommendedRange" in generation.outputData
        ? `Faixa recomendada: ${formatRange((generation.outputData as Record<string, PricingRange>).recommendedRange)}`
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function ServicePricingTool({ initialHistory }: ServicePricingToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedServicePricingResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha horas, custos e margem para calcular uma faixa de preco defendivel."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function buildPayload() {
    return {
      serviceName: form.serviceName.trim(),
      estimatedHours: Number(form.estimatedHours),
      directCost: Number(form.directCost),
      indirectCost: Number(form.indirectCost),
      desiredMargin: Number(form.desiredMargin),
      experienceLevel: form.experienceLevel,
      serviceComplexity: form.serviceComplexity,
      minimumAcceptableValue: form.minimumAcceptableValue.trim()
        ? Number(form.minimumAcceptableValue)
        : undefined,
    }
  }

  function validateForm() {
    const payload = buildPayload()

    if (!payload.serviceName || !Number.isFinite(payload.estimatedHours) || payload.estimatedHours <= 0) {
      setStatusMessage("Revise servico e horas estimadas antes de gerar o cenario.")
      return false
    }

    if (!Number.isFinite(payload.directCost) || !Number.isFinite(payload.indirectCost) || !Number.isFinite(payload.desiredMargin)) {
      setStatusMessage("Revise custos e margem desejada antes de gerar o cenario.")
      return false
    }

    return true
  }

  async function generatePricing(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "service-pricing",
        input: buildPayload(),
        sourceAction,
        sourceGenerationId,
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          payload?.code === "regeneration-limit-reached"
            ? "Voce ja usou as 2 regeneracoes deste cenario."
            : "Voce usou suas geracoes gratuitas de hoje."
        )
      }

      throw new Error("Nao conseguimos calcular agora. Revise os campos ou tente novamente em alguns instantes.")
    }

    return payload.generation
  }

  async function handleHistorySelect(generationId: string) {
    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations?id=${generationId}`)
      const payload = await response.json()

      if (!response.ok || !payload?.generation) {
        throw new Error("Nao foi possivel reabrir esse cenario.")
      }

      const parsedResult = extractResultFromGeneration(payload.generation)
      setResult(parsedResult)
      setSelectedGenerationId(payload.generation.id)
      setStatusMessage("Cenario reaberto do historico para comparar e continuar.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel reabrir o cenario.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleGenerate() {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Calculando seu cenario de precificacao...")

    try {
      const generation = await generatePricing("GENERATE")
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Cenario criado e salvo no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos calcular agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um cenario primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova faixa de precificacao...")

    try {
      const generation = await generatePricing("REGENERATE", selectedGenerationId)
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
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
        throw new Error("Nao foi possivel atualizar esse cenario agora.")
      }

      const payload = await response.json()
      const updated = payload.generation

      setResult((current) =>
        current
          ? { ...current, isFavorite: Boolean(updated.isFavorite), status: String(updated.status) }
          : current
      )

      setHistory((current) =>
        current.map((item) =>
          item.id === updated.id
            ? { ...item, isFavorite: Boolean(updated.isFavorite), status: String(updated.status) }
            : item
        )
      )

      if (action === "favorite") setStatusMessage("Cenario salvo para comparacao futura.")
      if (action === "unfavorite") setStatusMessage("Cenario removido dos favoritos.")
      if (action === "archive") setStatusMessage("Cenario arquivado.")
      if (action === "restore") setStatusMessage("Cenario restaurado.")
      if (action === "delete") setStatusMessage("Cenario removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o cenario.")
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
        throw new Error("Nao foi possivel duplicar esse cenario agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Cenario duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleDerivedActionCopy(kind: "proposal" | "offer" | "objection") {
    if (!result) {
      return
    }

    const base = [
      `Servico: ${form.serviceName}`,
      `Faixa recomendada: ${formatRange(result.recommendedRange)}`,
      `Faixa premium: ${formatRange(result.premiumRange)}`,
      `Explicacao: ${result.pricingExplanation}`,
      `Apresentacao: ${result.presentationSuggestion}`,
    ].join("\n")

    const text =
      kind === "proposal"
        ? `Crie uma proposta comercial com base nesta precificacao:\n\n${base}`
        : kind === "offer"
          ? `Crie uma oferta com base nesta precificacao:\n\n${base}`
          : `Crie uma resposta para objecao de preco com base nesta precificacao:\n\n${base}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "proposal"
        ? "Brief de proposta comercial copiado."
        : kind === "offer"
          ? "Brief de oferta copiado."
          : "Brief de objecao de preco copiado."
    )
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Servico oferecido</label>
            <input className={fieldClass} value={form.serviceName} onChange={(event) => updateField("serviceName", event.target.value)} placeholder="Ex.: landing page para negocio local" />
          </div>
          <div>
            <label className={labelClass}>Horas estimadas</label>
            <input type="number" step="0.5" className={fieldClass} value={form.estimatedHours} onChange={(event) => updateField("estimatedHours", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Margem desejada (%)</label>
            <input type="number" step="1" className={fieldClass} value={form.desiredMargin} onChange={(event) => updateField("desiredMargin", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Custo direto</label>
            <input type="number" step="0.01" className={fieldClass} value={form.directCost} onChange={(event) => updateField("directCost", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Custo indireto estimado</label>
            <input type="number" step="0.01" className={fieldClass} value={form.indirectCost} onChange={(event) => updateField("indirectCost", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Nivel de experiencia</label>
            <select className={fieldClass} value={form.experienceLevel} onChange={(event) => updateField("experienceLevel", event.target.value)}>
              {experienceOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Complexidade</label>
            <select className={fieldClass} value={form.serviceComplexity} onChange={(event) => updateField("serviceComplexity", event.target.value)}>
              {complexityOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Valor minimo aceitavel</label>
            <input type="number" step="0.01" className={fieldClass} value={form.minimumAcceptableValue} onChange={(event) => updateField("minimumAcceptableValue", event.target.value)} placeholder="Opcional" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleGenerate} disabled={isSubmitting} className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isSubmitting ? "Gerando..." : "Calcular precificacao"}
          </button>
          <button type="button" onClick={handleRegenerate} disabled={isSubmitting || !selectedGenerationId} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50">
            Regenerar
          </button>
          <button type="button" onClick={() => { setForm(initialForm); setStatusMessage("Formulario limpo.") }} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6]">
            Limpar
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">{statusMessage}</p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Resultado gerado</p>
              <h2 className="mt-2 font-toolkit text-2xl font-extrabold text-[#F0EDE6]">{result ? result.title : "Seu cenario aparece aqui"}</h2>
              {result ? <p className="mt-2 text-sm text-[#A09D97]">{result.scenarioLabel}</p> : null}
            </div>
            {result ? <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A09D97]">{result.status === "ARCHIVED" ? "Arquivado" : "Ativo"}</span> : null}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Calculo base</p>
                <p className="mt-3 text-2xl font-extrabold text-[#F0EDE6]">{formatMoney(result.baseCalculation)}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Faixa minima</p>
                  <p className="mt-3 text-sm font-semibold text-[#F0EDE6]">{formatRange(result.minimumSuggestedRange)}</p>
                </div>
                <div className="rounded-2xl border border-[#FCD34D]/20 bg-[#FCD34D]/8 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#FCD34D]">Faixa recomendada</p>
                  <p className="mt-3 text-sm font-semibold text-[#F0EDE6]">{formatRange(result.recommendedRange)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Faixa premium</p>
                  <p className="mt-3 text-sm font-semibold text-[#F0EDE6]">{formatRange(result.premiumRange)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Explicacao comercial</p>
                  <button type="button" onClick={() => handleCopy(result.pricingExplanation, "Explicacao comercial")} className="text-xs font-semibold text-[#FCD34D] transition hover:text-white">Copiar</button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.pricingExplanation}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Como apresentar o valor</p>
                  <button type="button" onClick={() => handleCopy(result.presentationSuggestion, "Apresentacao do valor")} className="text-xs font-semibold text-[#FCD34D] transition hover:text-white">Copiar</button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.presentationSuggestion}</p>
              </div>

              <div className="rounded-2xl border border-[#FF3D57]/20 bg-[#FF3D57]/8 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#FFD7DD]">Alertas de preco baixo</p>
                <div className="mt-3 space-y-2">
                  {result.lowPriceAlerts.map((alert) => (
                    <p key={alert} className="text-sm leading-6 text-[#F0EDE6]">{alert}</p>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button type="button" disabled={isActionLoading} onClick={() => handleGenerationAction(result.isFavorite ? "unfavorite" : "favorite")} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50">
                  {result.isFavorite ? "Remover favorito" : "Salvar cenario"}
                </button>
                <button type="button" disabled={isActionLoading} onClick={handleDuplicate} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50">
                  Duplicar cenario
                </button>
                <button type="button" onClick={() => handleDerivedActionCopy("proposal")} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10">
                  Criar proposta comercial
                </button>
                <button type="button" onClick={() => handleDerivedActionCopy("offer")} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10">
                  Criar oferta
                </button>
                <button type="button" onClick={() => handleDerivedActionCopy("objection")} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2">
                  Criar resposta para objecao de preco
                </button>
                <button type="button" disabled={isActionLoading || result.status === "ARCHIVED"} onClick={() => handleGenerationAction("archive")} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6] disabled:opacity-50">
                  Arquivar
                </button>
                <button type="button" disabled={isActionLoading} onClick={() => handleGenerationAction(result.status === "ARCHIVED" ? "restore" : "delete")} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-[#FF3D57]/20 bg-[#FF3D57]/8 px-4 text-sm font-semibold text-[#FFD7DD] transition hover:bg-[#FF3D57]/12 disabled:opacity-50">
                  {result.status === "ARCHIVED" ? "Restaurar" : "Excluir da biblioteca"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#A09D97]">
              Voce ainda nao criou nenhum cenario neste app. Preencha o formulario e calcule sua primeira faixa em poucos segundos.
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Comparacao de cenarios</p>
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#A09D97]">
                Cada novo calculo fica salvo aqui para comparar variacoes de margem, horas e complexidade.
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleHistorySelect(item.id)}
                  disabled={isActionLoading}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 disabled:opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#F0EDE6]">{item.title}</p>
                      {item.subtitle ? <p className="mt-1 line-clamp-2 text-xs text-[#A09D97]">{item.subtitle}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isFavorite ? <span className="rounded-full border border-[#FCD34D]/30 bg-[#FCD34D]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FCD34D]">Fav</span> : null}
                      {item.status === "ARCHIVED" ? <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Arq</span> : null}
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-xs text-[#A09D97]">{item.timestamp}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
