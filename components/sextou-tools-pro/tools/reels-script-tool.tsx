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

interface ReelsScriptToolProps {
  initialHistory: HistoryItem[]
  initialOperationalStatus: string | null
}

interface GeneratedReelsResult {
  id: string
  title: string
  openingHook: string
  spokenScript: string[]
  sceneSuggestions: string[]
  onScreenText: string[]
  finalCta: string
  publishDescription: string
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  videoTheme: "",
  productOrService: "",
  targetAudience: "",
  objective: "vender",
  tone: "direto",
  duration: "30s" as "15s" | "30s" | "45s",
}

const objectiveOptions = ["vender", "educar", "autoridade", "gerar conversa"]
const toneOptions = ["direto", "leve", "consultivo", "energetico", "profissional"]
const durationOptions: Array<"15s" | "30s" | "45s"> = ["15s", "30s", "45s"]

function extractResultFromGeneration(generation: any): GeneratedReelsResult {
  const output = generation.outputData as Record<string, string | string[]>

  return {
    id: generation.id,
    title: generation.title,
    openingHook: String(output.openingHook || ""),
    spokenScript: Array.isArray(output.spokenScript) ? output.spokenScript.map(String) : [],
    sceneSuggestions: Array.isArray(output.sceneSuggestions) ? output.sceneSuggestions.map(String) : [],
    onScreenText: Array.isArray(output.onScreenText) ? output.onScreenText.map(String) : [],
    finalCta: String(output.finalCta || ""),
    publishDescription: String(output.publishDescription || ""),
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
      "openingHook" in generation.outputData
        ? String(generation.outputData.openingHook)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

function getDurationGuidance(duration: "15s" | "30s" | "45s") {
  if (duration === "15s") {
    return "Saida curta: gancho rapido, 3 blocos de fala e CTA enxuto."
  }

  if (duration === "45s") {
    return "Saida mais desenvolvida: mantenha ritmo simples com 4-6 blocos curtos."
  }

  return "Saida equilibrada: gancho, desenvolvimento objetivo e CTA claro."
}

export function ReelsScriptTool({
  initialHistory,
  initialOperationalStatus,
}: ReelsScriptToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedReelsResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Defina o tema do video e gere um roteiro curto, escaneavel e pronto para gravar."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [operationalState, setOperationalState] = useState<"draft" | "gravado" | "publicado">(
    initialOperationalStatus === "RECORDED"
      ? "gravado"
      : initialOperationalStatus === "PUBLISHED"
        ? "publicado"
        : "draft"
  )

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.videoTheme.trim()) {
      setStatusMessage("Revise os campos destacados: informe o tema do video.")
      return false
    }

    if (!form.productOrService.trim()) {
      setStatusMessage("Revise os campos destacados: informe o produto ou servico.")
      return false
    }

    if (!form.targetAudience.trim()) {
      setStatusMessage("Revise os campos destacados: informe o publico-alvo.")
      return false
    }

    return true
  }

  async function generateScript(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appId: "roteiro-reels-shorts-30s",
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
            ? "Voce ja usou as 2 regeneracoes deste roteiro."
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
    setStatusMessage("Montando seu roteiro de video...")

    try {
      const generation = await generateScript("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setOperationalState("draft")
      setStatusMessage("Roteiro criado e salvo no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um roteiro primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao do roteiro...")

    try {
      const generation = await generateScript("REGENERATE", selectedGenerationId)
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setOperationalState("draft")
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
        throw new Error("Nao foi possivel atualizar esse roteiro agora.")
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

      if (action === "favorite") setStatusMessage("Roteiro salvo como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Roteiro removido dos favoritos.")
      if (action === "archive") setStatusMessage("Roteiro arquivado.")
      if (action === "restore") setStatusMessage("Roteiro restaurado.")
      if (action === "delete") setStatusMessage("Roteiro removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o roteiro.")
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
        throw new Error("Nao foi possivel duplicar esse roteiro agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Roteiro duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function markOperationalState(next: "draft" | "gravado" | "publicado") {
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
          operationalStatus:
            next === "gravado" ? "RECORDED" : next === "publicado" ? "PUBLISHED" : "DRAFT",
        }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar o status operacional do roteiro.")
      }

      setOperationalState(next)
      setStatusMessage(
        next === "gravado"
          ? "Roteiro marcado como gravado."
          : next === "publicado"
            ? "Roteiro marcado como publicado."
            : "Roteiro voltou para rascunho."
      )
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Nao foi possivel atualizar o status operacional."
      )
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "caption" | "offer" | "followup") {
    if (!result) {
      return
    }

    const baseScript = [
      `Gancho: ${result.openingHook}`,
      `Falas: ${result.spokenScript.join(" | ")}`,
      `CTA final: ${result.finalCta}`,
    ].join("\n")

    const text =
      kind === "caption"
        ? `Crie uma legenda de post com base neste roteiro:\n\n${baseScript}`
        : kind === "offer"
          ? `Crie uma oferta associada com base neste roteiro:\n\n${baseScript}`
          : `Crie um follow-up para quem respondeu a este video:\n\n${baseScript}`

    await navigator.clipboard.writeText(text)

    if (kind === "caption") {
      setStatusMessage("Brief de legenda do post copiado.")
      return
    }

    if (kind === "offer") {
      setStatusMessage("Brief de oferta associada copiado.")
      return
    }

    setStatusMessage("Brief de follow-up copiado.")
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Tema do video</label>
            <input
              className={fieldClass}
              value={form.videoTheme}
              onChange={(event) => updateField("videoTheme", event.target.value)}
              placeholder="Ex.: erro comum ao contratar limpeza"
            />
          </div>
          <div>
            <label className={labelClass}>Produto ou servico</label>
            <input
              className={fieldClass}
              value={form.productOrService}
              onChange={(event) => updateField("productOrService", event.target.value)}
              placeholder="Ex.: limpeza residencial"
            />
          </div>
          <div>
            <label className={labelClass}>Publico-alvo</label>
            <input
              className={fieldClass}
              value={form.targetAudience}
              onChange={(event) => updateField("targetAudience", event.target.value)}
              placeholder="Ex.: maes ocupadas na Florida"
            />
          </div>
          <div>
            <label className={labelClass}>Objetivo</label>
            <select
              className={fieldClass}
              value={form.objective}
              onChange={(event) => updateField("objective", event.target.value)}
            >
              {objectiveOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tom</label>
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
          <div className="md:col-span-2">
            <label className={labelClass}>Duracao</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {durationOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField("duration", option)}
                  className={`inline-flex h-12 items-center justify-center rounded-[16px] border px-4 text-sm font-semibold transition ${
                    form.duration === option
                      ? "border-[#FF3D57] bg-[#FF3D57]/12 text-white"
                      : "border-white/10 bg-white/5 text-[#A09D97] hover:bg-white/10 hover:text-[#F0EDE6]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-[#A09D97]">{getDurationGuidance(form.duration)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isSubmitting ? "Gerando..." : "Gerar roteiro"}
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
                {result ? result.title : "Seu roteiro aparece aqui"}
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
                    Gancho inicial
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.openingHook, "Gancho inicial")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.openingHook}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Roteiro falado
                </p>
                <div className="mt-3 space-y-2">
                  {result.spokenScript.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                      <p className="text-sm leading-6 text-[#F0EDE6]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Sugestao de cenas
                  </p>
                  <div className="mt-3 space-y-2">
                    {result.sceneSuggestions.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Texto na tela
                  </p>
                  <div className="mt-3 space-y-2">
                    {result.onScreenText.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    CTA final
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.finalCta, "CTA final")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.finalCta}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Descricao para publicar
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.publishDescription, "Descricao para publicar")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.publishDescription}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => markOperationalState("gravado")}
                  className={`inline-flex h-11 items-center justify-center rounded-[14px] border px-3 text-sm font-semibold transition ${
                    operationalState === "gravado"
                      ? "border-[#34D399]/30 bg-[#34D399]/10 text-[#6EE7B7]"
                      : "border-white/10 bg-black/20 text-[#F0EDE6] hover:bg-white/10"
                  }`}
                >
                  Marcar gravado
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => markOperationalState("publicado")}
                  className={`inline-flex h-11 items-center justify-center rounded-[14px] border px-3 text-sm font-semibold transition ${
                    operationalState === "publicado"
                      ? "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#93C5FD]"
                      : "border-white/10 bg-black/20 text-[#F0EDE6] hover:bg-white/10"
                  }`}
                >
                  Marcar publicado
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => markOperationalState("draft")}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#A09D97] transition hover:bg-white/10 hover:text-[#F0EDE6]"
                >
                  Voltar para rascunho
                </button>
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
                  onClick={() => handlePostActionCopy("caption")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar legenda do post
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("offer")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar oferta associada
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("followup")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar follow-up
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
              Voce ainda nao criou nenhum roteiro neste app. Preencha o formulario e gere sua
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novos roteiros.
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
            As marcacoes de `gravado` e `publicado` agora ficam persistidas no historico do roteiro
            via metadados operacionais, sem alterar o status macro da geracao.
          </p>
        </div>
      </aside>
    </div>
  )
}
