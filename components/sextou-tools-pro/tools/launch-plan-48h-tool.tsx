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

interface LaunchPlanTask {
  label: string
  owner: string
  expectedOutcome: string
}

interface LaunchPlanStage {
  stage: string
  hourWindow: string
  goal: string
  actions: string[]
}

interface LaunchPlanMessage {
  label: string
  text: string
}

interface LaunchPlan48hToolProps {
  initialHistory: HistoryItem[]
  initialChecklistMap: Record<string, boolean>
  initialTimelineMap: Record<string, boolean>
}

interface GeneratedLaunchPlanResult {
  id: string
  title: string
  planLabel: string
  checklist: LaunchPlanTask[]
  timeline: LaunchPlanStage[]
  keyMessages: LaunchPlanMessage[]
  announcementPost: string
  whatsappMessage: string
  ethicalUrgency: string
  simpleMetrics: string[]
  nextActions: string[]
  checklistMap: Record<string, boolean>
  timelineMap: Record<string, boolean>
  isFavorite: boolean
  status: string
}

const initialForm = {
  launchTarget: "",
  targetAudience: "",
  primaryChannel: "instagram",
  offerOrBenefit: "",
  campaignDeadline: "",
  availableResources: "",
  campaignTone: "direto",
}

const channelOptions = ["instagram", "facebook", "whatsapp", "lista de contatos", "google business profile"]
const toneOptions = ["direto", "consultivo", "caloroso", "profissional", "leve"]

function extractBooleanMap(metadataJson: unknown, key: string) {
  if (!metadataJson || typeof metadataJson !== "object" || Array.isArray(metadataJson)) {
    return {}
  }

  const mapValue = (metadataJson as Record<string, unknown>)[key]

  if (!mapValue || typeof mapValue !== "object" || Array.isArray(mapValue)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(mapValue).filter(
      (entry): entry is [string, boolean] => typeof entry[0] === "string" && typeof entry[1] === "boolean"
    )
  )
}

function extractResultFromGeneration(generation: any): GeneratedLaunchPlanResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    planLabel: String(output.planLabel || ""),
    checklist: Array.isArray(output.checklist)
      ? output.checklist.map((item) => ({
          label: String((item as LaunchPlanTask).label || ""),
          owner: String((item as LaunchPlanTask).owner || ""),
          expectedOutcome: String((item as LaunchPlanTask).expectedOutcome || ""),
        }))
      : [],
    timeline: Array.isArray(output.timeline)
      ? output.timeline.map((item) => ({
          stage: String((item as LaunchPlanStage).stage || ""),
          hourWindow: String((item as LaunchPlanStage).hourWindow || ""),
          goal: String((item as LaunchPlanStage).goal || ""),
          actions: Array.isArray((item as LaunchPlanStage).actions)
            ? (item as LaunchPlanStage).actions.map(String)
            : [],
        }))
      : [],
    keyMessages: Array.isArray(output.keyMessages)
      ? output.keyMessages.map((item) => ({
          label: String((item as LaunchPlanMessage).label || ""),
          text: String((item as LaunchPlanMessage).text || ""),
        }))
      : [],
    announcementPost: String(output.announcementPost || ""),
    whatsappMessage: String(output.whatsappMessage || ""),
    ethicalUrgency: String(output.ethicalUrgency || ""),
    simpleMetrics: Array.isArray(output.simpleMetrics) ? output.simpleMetrics.map(String) : [],
    nextActions: Array.isArray(output.nextActions) ? output.nextActions.map(String) : [],
    checklistMap: extractBooleanMap(generation.metadataJson, "launchPlanChecklist"),
    timelineMap: extractBooleanMap(generation.metadataJson, "launchPlanTimeline"),
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
      "planLabel" in generation.outputData
        ? String(generation.outputData.planLabel)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function LaunchPlan48hTool({
  initialHistory,
  initialChecklistMap,
  initialTimelineMap,
}: LaunchPlan48hToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedLaunchPlanResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [checklistMap, setChecklistMap] = useState(initialChecklistMap)
  const [timelineMap, setTimelineMap] = useState(initialTimelineMap)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha os dados da campanha e gere um plano objetivo para executar nas proximas 48 horas."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.launchTarget.trim() || !form.targetAudience.trim() || !form.offerOrBenefit.trim()) {
      setStatusMessage("Revise os campos destacados: informe o que sera lancado, publico e oferta.")
      return false
    }

    if (!form.campaignDeadline.trim() || !form.availableResources.trim()) {
      setStatusMessage("Revise os campos destacados: informe prazo e recursos disponiveis.")
      return false
    }

    return true
  }

  async function generatePlan(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "launch-plan-48h",
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
            ? "Voce ja usou as 2 regeneracoes deste plano."
            : "Voce usou suas geracoes gratuitas de hoje."
        )
      }

      throw new Error("Nao conseguimos gerar agora. Revise os campos ou tente novamente em alguns instantes.")
    }

    return payload.generation
  }

  async function handleHistorySelect(generationId: string) {
    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations?id=${generationId}`)
      const payload = await response.json()

      if (!response.ok || !payload?.generation) {
        throw new Error("Nao foi possivel reabrir esse plano.")
      }

      const parsedResult = extractResultFromGeneration(payload.generation)
      setResult(parsedResult)
      setSelectedGenerationId(payload.generation.id)
      setChecklistMap(parsedResult.checklistMap)
      setTimelineMap(parsedResult.timelineMap)
      setStatusMessage("Plano reaberto do historico para continuar a marcacao.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel reabrir o plano.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleGenerate() {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Montando seu plano de lancamento em 48 horas...")

    try {
      const generation = await generatePlan("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setChecklistMap(parsedResult.checklistMap)
      setTimelineMap(parsedResult.timelineMap)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Plano criado e salvo no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um plano primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao do plano...")

    try {
      const generation = await generatePlan("REGENERATE", selectedGenerationId)
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setChecklistMap(parsedResult.checklistMap)
      setTimelineMap(parsedResult.timelineMap)
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
        throw new Error("Nao foi possivel atualizar esse plano agora.")
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

      if (action === "favorite") setStatusMessage("Plano salvo como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Plano removido dos favoritos.")
      if (action === "archive") setStatusMessage("Plano arquivado.")
      if (action === "restore") setStatusMessage("Plano restaurado.")
      if (action === "delete") setStatusMessage("Plano removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o plano.")
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
        throw new Error("Nao foi possivel duplicar esse plano agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Plano duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleTaskToggle(section: "checklist" | "timeline", index: number) {
    if (!selectedGenerationId) {
      return
    }

    const sourceMap = section === "checklist" ? checklistMap : timelineMap
    const nextCompleted = !Boolean(sourceMap[String(index)])
    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations/${selectedGenerationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-launch-plan-task-completed",
          section,
          taskIndex: index,
          completed: nextCompleted,
        }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar essa marcacao.")
      }

      const payload = await response.json()
      const updatedChecklistMap = extractBooleanMap(payload.generation.metadataJson, "launchPlanChecklist")
      const updatedTimelineMap = extractBooleanMap(payload.generation.metadataJson, "launchPlanTimeline")
      setChecklistMap(updatedChecklistMap)
      setTimelineMap(updatedTimelineMap)
      setResult((current) =>
        current
          ? {
              ...current,
              checklistMap: updatedChecklistMap,
              timelineMap: updatedTimelineMap,
            }
          : current
      )
      setStatusMessage(nextCompleted ? "Marcacao salva na campanha." : "Marcacao removida da campanha.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a marcacao.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleDerivedActionCopy(kind: "ads" | "reels" | "followup") {
    if (!result) {
      return
    }

    const base = [
      `Plano: ${result.planLabel}`,
      `Mensagem principal: ${result.keyMessages[0]?.text || ""}`,
      `Post: ${result.announcementPost}`,
      `WhatsApp: ${result.whatsappMessage}`,
    ].join("\n")

    const text =
      kind === "ads"
        ? `Crie um anuncio local com base neste plano:\n\n${base}`
        : kind === "reels"
          ? `Crie um roteiro de Reels com base neste plano:\n\n${base}`
          : `Crie um follow-up de campanha com base neste plano:\n\n${base}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "ads"
        ? "Brief de anuncio local copiado."
        : kind === "reels"
          ? "Brief de Reels copiado."
          : "Brief de follow-up copiado."
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
            <label className={labelClass}>O que sera lancado</label>
            <input
              className={fieldClass}
              value={form.launchTarget}
              onChange={(event) => updateField("launchTarget", event.target.value)}
              placeholder="Ex.: pacote inicial de consultoria comercial"
            />
          </div>
          <div>
            <label className={labelClass}>Canal principal</label>
            <select
              className={fieldClass}
              value={form.primaryChannel}
              onChange={(event) => updateField("primaryChannel", event.target.value)}
            >
              {channelOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Publico-alvo</label>
            <input
              className={fieldClass}
              value={form.targetAudience}
              onChange={(event) => updateField("targetAudience", event.target.value)}
              placeholder="Ex.: donos de negocios locais que precisam vender rapido"
            />
          </div>
          <div>
            <label className={labelClass}>Prazo da campanha</label>
            <input
              className={fieldClass}
              value={form.campaignDeadline}
              onChange={(event) => updateField("campaignDeadline", event.target.value)}
              placeholder="Ex.: ate sexta 18h"
            />
          </div>
          <div>
            <label className={labelClass}>Tom da campanha</label>
            <select
              className={fieldClass}
              value={form.campaignTone}
              onChange={(event) => updateField("campaignTone", event.target.value)}
            >
              {toneOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Oferta ou beneficio</label>
            <textarea
              className={textareaClass}
              value={form.offerOrBenefit}
              onChange={(event) => updateField("offerOrBenefit", event.target.value)}
              placeholder="Ex.: diagnostico inicial + plano de acao com condicao especial nas proximas 48 horas."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Recursos disponiveis</label>
            <textarea
              className={textareaClass}
              value={form.availableResources}
              onChange={(event) => updateField("availableResources", event.target.value)}
              placeholder="Ex.: celular, lista de contatos quente, Instagram ativo, 2 horas por dia para responder."
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
            {isSubmitting ? "Gerando..." : "Gerar plano 48h"}
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
                {result ? result.title : "Seu plano aparece aqui"}
              </h2>
              {result ? <p className="mt-2 text-sm text-[#A09D97]">{result.planLabel}</p> : null}
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
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Checklist das proximas 48 horas
                </p>
                <div className="mt-3 space-y-3">
                  {result.checklist.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#F0EDE6]">{item.label}</p>
                          <p className="mt-1 text-xs text-[#A09D97]">Responsavel: {item.owner}</p>
                        </div>
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleTaskToggle("checklist", index)}
                          className="inline-flex h-9 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-xs font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                        >
                          {checklistMap[String(index)] ? "Concluida" : "Marcar concluida"}
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#A09D97]">{item.expectedOutcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Cronograma por etapa</p>
                <div className="mt-3 space-y-3">
                  {result.timeline.map((item, index) => (
                    <div key={`${item.stage}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#F0EDE6]">{item.stage}</p>
                          <p className="mt-1 text-xs text-[#FCD34D]">{item.hourWindow}</p>
                        </div>
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleTaskToggle("timeline", index)}
                          className="inline-flex h-9 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-xs font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                        >
                          {timelineMap[String(index)] ? "Etapa concluida" : "Marcar etapa"}
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-[#F0EDE6]">{item.goal}</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#A09D97]">
                        {item.actions.map((action) => (
                          <li key={action}>- {action}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Mensagens principais</p>
                <div className="mt-3 space-y-3">
                  {result.keyMessages.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-[#F0EDE6]">{item.label}</p>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.text, item.label)}
                          className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                        >
                          Copiar
                        </button>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#A09D97]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Post de anuncio</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.announcementPost, "Post de anuncio")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.announcementPost}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Mensagem para WhatsApp
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.whatsappMessage, "Mensagem para WhatsApp")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.whatsappMessage}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Urgencia etica</p>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.ethicalUrgency}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Metricas simples</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#A09D97]">
                  {result.simpleMetrics.map((metric) => (
                    <li key={metric}>- {metric}</li>
                  ))}
                </ul>
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
                  onClick={() => handleDerivedActionCopy("ads")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar anuncio local
                </button>
                <button
                  type="button"
                  onClick={() => handleDerivedActionCopy("reels")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar roteiro de Reels
                </button>
                <button
                  type="button"
                  onClick={() => handleDerivedActionCopy("followup")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar follow-up da campanha
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
                  onClick={() => handleGenerationAction(result.status === "ARCHIVED" ? "restore" : "delete")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-[#FF3D57]/20 bg-[#FF3D57]/8 px-4 text-sm font-semibold text-[#FFD7DD] transition hover:bg-[#FF3D57]/12 disabled:opacity-50"
                >
                  {result.status === "ARCHIVED" ? "Restaurar" : "Excluir da biblioteca"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#A09D97]">
              Voce ainda nao criou nenhum plano neste app. Preencha o formulario e gere sua primeira versao em poucos segundos.
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novos planos.
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
                </button>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
