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

interface FollowUpMessage {
  stepLabel: string
  suggestedDelay: string
  message: string
  cta: string
}

interface FollowUp5MessagesToolProps {
  initialHistory: HistoryItem[]
  initialSentMap: Record<string, boolean>
}

interface GeneratedFollowUpResult {
  id: string
  title: string
  sequenceLabel: string
  messages: FollowUpMessage[]
  shortFirstMessage: string
  closingMessage: string
  nextActions: string[]
  sentMap: Record<string, boolean>
  isFavorite: boolean
  status: string
}

const initialForm = {
  productOrService: "",
  leadSituation: "",
  timeSinceLastContact: "",
  knownObjection: "",
  tone: "profissional",
  channel: "whatsapp",
}

const toneOptions = ["profissional", "caloroso", "direto", "consultivo", "leve"]
const channelOptions = ["whatsapp", "instagram", "email", "ligacao", "mensagem comercial"]

function extractSentMap(metadataJson: unknown) {
  if (!metadataJson || typeof metadataJson !== "object" || Array.isArray(metadataJson)) {
    return {}
  }

  const sentMessages = (metadataJson as Record<string, unknown>).sentMessages

  if (!sentMessages || typeof sentMessages !== "object" || Array.isArray(sentMessages)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(sentMessages).filter(
      (entry): entry is [string, boolean] => typeof entry[0] === "string" && typeof entry[1] === "boolean"
    )
  )
}

function extractResultFromGeneration(generation: any): GeneratedFollowUpResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    sequenceLabel: String(output.sequenceLabel || ""),
    messages: Array.isArray(output.messages)
      ? output.messages.map((item) => ({
          stepLabel: String((item as FollowUpMessage).stepLabel || ""),
          suggestedDelay: String((item as FollowUpMessage).suggestedDelay || ""),
          message: String((item as FollowUpMessage).message || ""),
          cta: String((item as FollowUpMessage).cta || ""),
        }))
      : [],
    shortFirstMessage: String(output.shortFirstMessage || ""),
    closingMessage: String(output.closingMessage || ""),
    nextActions: Array.isArray(output.nextActions) ? output.nextActions.map(String) : [],
    sentMap: extractSentMap(generation.metadataJson),
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
      "shortFirstMessage" in generation.outputData
        ? String(generation.outputData.shortFirstMessage)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function FollowUp5MessagesTool({
  initialHistory,
  initialSentMap,
}: FollowUp5MessagesToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedFollowUpResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [sentMap, setSentMap] = useState(initialSentMap)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha o contexto do lead e gere uma sequencia curta de follow-up com 5 mensagens."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.productOrService.trim() || !form.leadSituation.trim() || !form.timeSinceLastContact.trim()) {
      setStatusMessage("Revise os campos destacados: informe servico, situacao do lead e tempo desde o ultimo contato.")
      return false
    }

    return true
  }

  async function generateFollowUp(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "follow-up-5-messages",
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
            ? "Voce ja usou as 2 regeneracoes desta sequencia."
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
    setStatusMessage("Criando sua sequencia de follow-up...")

    try {
      const generation = await generateFollowUp("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setSentMap(parsedResult.sentMap)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Sequencia criada e salva no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere uma sequencia primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao da sequencia...")

    try {
      const generation = await generateFollowUp("REGENERATE", selectedGenerationId)
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setSentMap(parsedResult.sentMap)
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
        throw new Error("Nao foi possivel atualizar essa sequencia agora.")
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

      if (action === "favorite") setStatusMessage("Sequencia salva como favorita/template.")
      if (action === "unfavorite") setStatusMessage("Sequencia removida dos favoritos.")
      if (action === "archive") setStatusMessage("Sequencia arquivada.")
      if (action === "restore") setStatusMessage("Sequencia restaurada.")
      if (action === "delete") setStatusMessage("Sequencia removida da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a sequencia.")
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
        throw new Error("Nao foi possivel duplicar essa sequencia agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Sequencia duplicada no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleToggleSent(index: number) {
    if (!selectedGenerationId || !result) {
      return
    }

    const nextSent = !Boolean(sentMap[String(index)])
    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations/${selectedGenerationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-follow-up-message-sent",
          messageIndex: index,
          sent: nextSent,
        }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar a marcacao desta mensagem.")
      }

      const payload = await response.json()
      const updatedSentMap = extractSentMap(payload.generation.metadataJson)
      setSentMap(updatedSentMap)
      setResult((current) => (current ? { ...current, sentMap: updatedSentMap } : current))
      setStatusMessage(nextSent ? `Mensagem ${index + 1} marcada como enviada.` : `Mensagem ${index + 1} desmarcada.`)
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a marcacao.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "objection" | "proposal" | "offer") {
    if (!result) {
      return
    }

    const base = [
      `Contexto: ${result.sequenceLabel}`,
      `Mensagem 1 curta: ${result.shortFirstMessage}`,
      `Mensagem final: ${result.closingMessage}`,
      `CTA da primeira mensagem: ${result.messages[0]?.cta || ""}`,
    ].join("\n")

    const text =
      kind === "objection"
        ? `Crie uma resposta para objecao com base neste follow-up:\n\n${base}`
        : kind === "proposal"
          ? `Crie uma proposta comercial com base neste follow-up:\n\n${base}`
          : `Crie uma oferta melhorada com base neste follow-up:\n\n${base}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "objection"
        ? "Brief de objecao copiado."
        : kind === "proposal"
          ? "Brief de proposta comercial copiado."
          : "Brief de oferta melhorada copiado."
    )
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Produto ou servico vendido</label>
            <input
              className={fieldClass}
              value={form.productOrService}
              onChange={(event) => updateField("productOrService", event.target.value)}
              placeholder="Ex.: gestao de redes sociais mensal"
            />
          </div>
          <div>
            <label className={labelClass}>Canal</label>
            <select
              className={fieldClass}
              value={form.channel}
              onChange={(event) => updateField("channel", event.target.value)}
            >
              {channelOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Situacao do lead</label>
            <input
              className={fieldClass}
              value={form.leadSituation}
              onChange={(event) => updateField("leadSituation", event.target.value)}
              placeholder="Ex.: recebeu proposta, mas nao respondeu"
            />
          </div>
          <div>
            <label className={labelClass}>Tempo desde o ultimo contato</label>
            <input
              className={fieldClass}
              value={form.timeSinceLastContact}
              onChange={(event) => updateField("timeSinceLastContact", event.target.value)}
              placeholder="Ex.: 4 dias"
            />
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
          <div>
            <label className={labelClass}>Objecao conhecida</label>
            <input
              className={fieldClass}
              value={form.knownObjection}
              onChange={(event) => updateField("knownObjection", event.target.value)}
              placeholder="Ex.: preco, timing, prioridade"
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
            {isSubmitting ? "Gerando..." : "Gerar follow-up"}
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
                {result ? result.title : "Sua sequencia aparece aqui"}
              </h2>
              {result ? <p className="mt-2 text-sm text-[#A09D97]">{result.sequenceLabel}</p> : null}
            </div>
            {result ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A09D97]">
                {result.status === "ARCHIVED" ? "Arquivada" : "Ativa"}
              </span>
            ) : null}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Primeira mensagem curta
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.shortFirstMessage, "Primeira mensagem curta")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.shortFirstMessage}</p>
              </div>

              {result.messages.map((item, index) => (
                <div key={`${item.stepLabel}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                        {item.stepLabel}
                      </p>
                      <p className="mt-1 text-xs text-[#FCD34D]">{item.suggestedDelay}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.message, item.stepLabel)}
                        className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                      >
                        Copiar
                      </button>
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() => handleToggleSent(index)}
                        className="inline-flex h-9 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-xs font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                      >
                        {sentMap[String(index)] ? "Marcar como nao enviada" : "Marcar como enviada"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{item.message}</p>
                  <p className="mt-3 text-sm text-[#A09D97]">CTA: {item.cta}</p>
                  {sentMap[String(index)] ? (
                    <span className="mt-3 inline-flex rounded-full border border-[#FCD34D]/30 bg-[#FCD34D]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FCD34D]">
                      Enviada
                    </span>
                  ) : null}
                </div>
              ))}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Encerramento elegante
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.closingMessage, "Encerramento elegante")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.closingMessage}</p>
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
                  onClick={() => handlePostActionCopy("objection")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar resposta para objecao
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("proposal")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar proposta comercial
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("offer")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar oferta melhorada
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
              Voce ainda nao criou nenhuma sequencia neste app. Preencha o formulario e gere sua primeira versao em poucos segundos.
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novas sequencias.
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
