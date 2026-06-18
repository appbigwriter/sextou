"use client"

import { useState } from "react"

interface HistoryItem {
  id: string
  title: string
  subtitle?: string
  timestamp: string
  isFavorite: boolean
  status: string
  recommendedNextAppLabel?: string
}

interface SevenDayStep {
  day: string
  action: string
}

interface RecommendedNextApp {
  slug: string
  label: string
  reason: string
}

interface BusinessDiagnosisToolProps {
  initialHistory: HistoryItem[]
}

interface GeneratedBusinessDiagnosisResult {
  id: string
  title: string
  diagnosisSummary: string
  strengths: string[]
  weaknesses: string[]
  quickOpportunities: string[]
  risks: string[]
  sevenDayPlan: SevenDayStep[]
  recommendedNextApp: RecommendedNextApp
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  businessName: "",
  businessType: "",
  mainProductOrService: "",
  targetAudience: "",
  mainSalesChannel: "",
  biggestCurrentDifficulty: "",
  approximateRevenue: "",
  cityOrMarket: "",
}

function extractRecommendedNextApp(input: unknown): RecommendedNextApp {
  const fallback = {
    slug: "gerador-oferta-irresistivel",
    label: "Gerador de Oferta Irresistivel",
    reason: "Ajuste primeiro a oferta antes de ampliar volume ou distribuicao.",
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return fallback
  }

  const value = input as Record<string, unknown>

  return {
    slug: typeof value.slug === "string" ? value.slug : fallback.slug,
    label: typeof value.label === "string" ? value.label : fallback.label,
    reason: typeof value.reason === "string" ? value.reason : fallback.reason,
  }
}

function extractResultFromGeneration(generation: any): GeneratedBusinessDiagnosisResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    diagnosisSummary: String(output.diagnosisSummary || ""),
    strengths: Array.isArray(output.strengths) ? output.strengths.map(String) : [],
    weaknesses: Array.isArray(output.weaknesses) ? output.weaknesses.map(String) : [],
    quickOpportunities: Array.isArray(output.quickOpportunities) ? output.quickOpportunities.map(String) : [],
    risks: Array.isArray(output.risks) ? output.risks.map(String) : [],
    sevenDayPlan: Array.isArray(output.sevenDayPlan)
      ? output.sevenDayPlan.map((item) => ({
          day: String((item as SevenDayStep).day || ""),
          action: String((item as SevenDayStep).action || ""),
        }))
      : [],
    recommendedNextApp: extractRecommendedNextApp(output.recommendedNextApp),
    nextActions: Array.isArray(output.nextActions) ? output.nextActions.map(String) : [],
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

function buildHistoryItem(generation: any): HistoryItem {
  const metadata = generation.metadataJson as { recommendedNextApp?: { label?: string } } | null

  return {
    id: generation.id,
    title: generation.title,
    subtitle:
      typeof generation.outputData === "object" &&
      generation.outputData &&
      "diagnosisSummary" in generation.outputData
        ? String(generation.outputData.diagnosisSummary)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
    recommendedNextAppLabel: metadata?.recommendedNextApp?.label,
  }
}

export function BusinessDiagnosisTool({ initialHistory }: BusinessDiagnosisToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedBusinessDiagnosisResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha o contexto do negocio e gere um diagnostico curto com prioridades dos proximos 7 dias."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.businessName.trim() || !form.businessType.trim() || !form.mainProductOrService.trim()) {
      setStatusMessage("Revise negocio, tipo de negocio e produto ou servico principal.")
      return false
    }

    if (!form.targetAudience.trim() || !form.mainSalesChannel.trim() || !form.biggestCurrentDifficulty.trim()) {
      setStatusMessage("Revise publico, canal principal e maior dificuldade atual.")
      return false
    }

    return true
  }

  async function generateDiagnosis(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "business-diagnosis",
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
            ? "Voce ja usou as 2 regeneracoes deste diagnostico."
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
    setStatusMessage("Montando seu diagnostico express...")

    try {
      const generation = await generateDiagnosis("GENERATE")
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Diagnostico criado e salvo no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um diagnostico primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova leitura do negocio...")

    try {
      const generation = await generateDiagnosis("REGENERATE", selectedGenerationId)
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
        throw new Error("Nao foi possivel atualizar esse diagnostico agora.")
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

      if (action === "favorite") setStatusMessage("Diagnostico salvo como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Diagnostico removido dos favoritos.")
      if (action === "archive") setStatusMessage("Diagnostico arquivado.")
      if (action === "restore") setStatusMessage("Diagnostico restaurado.")
      if (action === "delete") setStatusMessage("Diagnostico removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o diagnostico.")
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
        throw new Error("Nao foi possivel duplicar esse diagnostico agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Diagnostico duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleNextActionCopy(kind: "offer" | "calendar" | "launch") {
    if (!result) {
      return
    }

    const base = [
      `Diagnostico: ${result.diagnosisSummary}`,
      `Maior gargalo: ${result.weaknesses[0] || ""}`,
      `Oportunidade rapida: ${result.quickOpportunities[0] || ""}`,
      `Proximo app recomendado: ${result.recommendedNextApp.label}`,
    ].join("\n")

    const text =
      kind === "offer"
        ? `Crie uma oferta com base neste diagnostico:\n\n${base}`
        : kind === "calendar"
          ? `Crie um calendario de conteudo com base neste diagnostico:\n\n${base}`
          : `Crie um plano de lancamento com base neste diagnostico:\n\n${base}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "offer"
        ? "Brief de oferta copiado."
        : kind === "calendar"
          ? "Brief de calendario copiado."
          : "Brief de plano de lancamento copiado."
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
            <label className={labelClass}>Tipo de negocio</label>
            <input
              className={fieldClass}
              value={form.businessType}
              onChange={(event) => updateField("businessType", event.target.value)}
              placeholder="Ex.: servico local recorrente"
            />
          </div>
          <div>
            <label className={labelClass}>Produto ou servico principal</label>
            <input
              className={fieldClass}
              value={form.mainProductOrService}
              onChange={(event) => updateField("mainProductOrService", event.target.value)}
              placeholder="Ex.: limpeza residencial premium"
            />
          </div>
          <div>
            <label className={labelClass}>Publico-alvo</label>
            <input
              className={fieldClass}
              value={form.targetAudience}
              onChange={(event) => updateField("targetAudience", event.target.value)}
              placeholder="Ex.: familias e brasileiras ocupadas"
            />
          </div>
          <div>
            <label className={labelClass}>Canal principal de venda</label>
            <input
              className={fieldClass}
              value={form.mainSalesChannel}
              onChange={(event) => updateField("mainSalesChannel", event.target.value)}
              placeholder="Ex.: WhatsApp e indicacao"
            />
          </div>
          <div>
            <label className={labelClass}>Faturamento aproximado</label>
            <input
              className={fieldClass}
              value={form.approximateRevenue}
              onChange={(event) => updateField("approximateRevenue", event.target.value)}
              placeholder="Ex.: ate $5k por mes"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Maior dificuldade atual</label>
            <textarea
              className={textareaClass}
              value={form.biggestCurrentDifficulty}
              onChange={(event) => updateField("biggestCurrentDifficulty", event.target.value)}
              placeholder="Ex.: tenho interesse, mas pouca conversao e follow-up inconsistente."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Cidade ou mercado</label>
            <input
              className={fieldClass}
              value={form.cityOrMarket}
              onChange={(event) => updateField("cityOrMarket", event.target.value)}
              placeholder="Ex.: Orlando e regiao"
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
            {isSubmitting ? "Gerando..." : "Gerar diagnostico"}
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
                {result ? result.title : "Seu diagnostico aparece aqui"}
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
                    Resumo do diagnostico
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.diagnosisSummary, "Resumo do diagnostico")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.diagnosisSummary}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">3 pontos fortes</p>
                  <div className="mt-3 space-y-2">
                    {result.strengths.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">3 pontos fracos</p>
                  <div className="mt-3 space-y-2">
                    {result.weaknesses.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">3 oportunidades rapidas</p>
                  <div className="mt-3 space-y-2">
                    {result.quickOpportunities.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">3 riscos</p>
                  <div className="mt-3 space-y-2">
                    {result.risks.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Plano de acao de 7 dias
                </p>
                <div className="mt-3 space-y-3">
                  {result.sevenDayPlan.map((item, index) => (
                    <div key={`${item.day}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#FCD34D]">{item.day}</p>
                      <p className="mt-2 text-sm leading-6 text-[#F0EDE6]">{item.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#FCD34D]/20 bg-[#FCD34D]/8 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#FCD34D]">
                  Proximo mini-app recomendado
                </p>
                <p className="mt-3 text-base font-semibold text-[#F0EDE6]">{result.recommendedNextApp.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#F0EDE6]">{result.recommendedNextApp.reason}</p>
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
                  onClick={() => handleNextActionCopy("offer")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar oferta
                </button>
                <button
                  type="button"
                  onClick={() => handleNextActionCopy("calendar")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar calendario
                </button>
                <button
                  type="button"
                  onClick={() => handleNextActionCopy("launch")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar plano de lancamento
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
              Voce ainda nao criou nenhum diagnostico neste app. Preencha o formulario e gere sua primeira leitura em poucos segundos.
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">
            Historico por negocio
          </p>
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#A09D97]">
                Cada nova geracao fica salva aqui para comparar resumos, gargalos e proximo app recomendado.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#F0EDE6]">{item.title}</p>
                      {item.subtitle ? <p className="mt-1 line-clamp-3 text-xs text-[#A09D97]">{item.subtitle}</p> : null}
                      {item.recommendedNextAppLabel ? (
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FCD34D]">
                          Proximo: {item.recommendedNextAppLabel}
                        </p>
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
      </aside>
    </div>
  )
}
