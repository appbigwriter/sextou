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

interface FaqItem {
  question: string
  answer: string
}

interface ObjectionItem {
  objection: string
  answer: string
}

interface FaqObjectionsToolProps {
  initialHistory: HistoryItem[]
}

interface GeneratedFaqResult {
  id: string
  title: string
  faqs: FaqItem[]
  objections: ObjectionItem[]
  whatsappMessage: string
  suggestedUsage: string
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  businessType: "",
  productOrService: "",
  knownQuestions: "",
  knownObjections: "",
  responseTone: "profissional",
  channel: "whatsapp",
}

const toneOptions = ["profissional", "caloroso", "direto", "consultivo", "popular"]
const channelOptions = ["whatsapp", "instagram", "google business profile", "site", "atendimento comercial"]

function extractResultFromGeneration(generation: any): GeneratedFaqResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    faqs: Array.isArray(output.faqs)
      ? output.faqs.map((item) => ({
          question: String((item as FaqItem).question || ""),
          answer: String((item as FaqItem).answer || ""),
        }))
      : [],
    objections: Array.isArray(output.objections)
      ? output.objections.map((item) => ({
          objection: String((item as ObjectionItem).objection || ""),
          answer: String((item as ObjectionItem).answer || ""),
        }))
      : [],
    whatsappMessage: String(output.whatsappMessage || ""),
    suggestedUsage: String(output.suggestedUsage || ""),
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
      "suggestedUsage" in generation.outputData
        ? String(generation.outputData.suggestedUsage)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function FaqObjectionsTool({ initialHistory }: FaqObjectionsToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedFaqResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha os campos e gere um FAQ com objecoes prontas para reaproveitar no atendimento."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.businessType.trim() || !form.productOrService.trim()) {
      setStatusMessage("Revise os campos destacados: informe tipo de negocio e produto ou servico.")
      return false
    }

    return true
  }

  async function generateFaq(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "faq-objections",
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
            ? "Voce ja usou as 2 regeneracoes deste FAQ."
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
    setStatusMessage("Montando seu FAQ comercial...")

    try {
      const generation = await generateFaq("GENERATE")
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("FAQ criado e salvo no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um FAQ primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao do FAQ...")

    try {
      const generation = await generateFaq("REGENERATE", selectedGenerationId)
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

  async function handleLoadHistoryItem(generationId: string) {
    setIsHistoryLoading(true)
    setStatusMessage("Carregando FAQ salvo para edicao...")

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations?id=${generationId}`)
      const payload = await response.json()

      if (!response.ok || !payload?.generation) {
        throw new Error("Nao foi possivel carregar esse FAQ salvo.")
      }

      const generation = payload.generation
      const input = generation.inputData as Partial<typeof initialForm>

      setForm({
        businessType: String(input.businessType || ""),
        productOrService: String(input.productOrService || ""),
        knownQuestions: String(input.knownQuestions || ""),
        knownObjections: String(input.knownObjections || ""),
        responseTone: String(input.responseTone || initialForm.responseTone),
        channel: String(input.channel || initialForm.channel),
      })
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
      setStatusMessage("FAQ carregado do historico. Ajuste os campos e gere uma nova versao.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel carregar o FAQ salvo.")
    } finally {
      setIsHistoryLoading(false)
    }
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
        throw new Error("Nao foi possivel atualizar esse FAQ agora.")
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

      if (action === "favorite") setStatusMessage("FAQ salvo como favorito/template.")
      if (action === "unfavorite") setStatusMessage("FAQ removido dos favoritos.")
      if (action === "archive") setStatusMessage("FAQ arquivado.")
      if (action === "restore") setStatusMessage("FAQ restaurado.")
      if (action === "delete") setStatusMessage("FAQ removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o FAQ.")
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
        throw new Error("Nao foi possivel duplicar esse FAQ agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("FAQ duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "whatsapp" | "bio" | "calendar") {
    if (!result) {
      return
    }

    const baseFaq = [
      `Mensagem base: ${result.whatsappMessage}`,
      `Uso sugerido: ${result.suggestedUsage}`,
      `Primeira FAQ: ${result.faqs[0]?.question || ""} - ${result.faqs[0]?.answer || ""}`,
      `Primeira objecao: ${result.objections[0]?.objection || ""} - ${result.objections[0]?.answer || ""}`,
    ].join("\n")

    const text =
      kind === "whatsapp"
        ? `Crie respostas prontas para WhatsApp com base neste FAQ:\n\n${baseFaq}`
        : kind === "bio"
          ? `Crie uma bio do negocio com base neste FAQ:\n\n${baseFaq}`
          : `Crie um calendario de conteudo educativo com base neste FAQ:\n\n${baseFaq}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "whatsapp"
        ? "Brief de respostas para WhatsApp copiado."
        : kind === "bio"
          ? "Brief de bio do negocio copiado."
          : "Brief de calendario de conteudo educativo copiado."
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
            <label className={labelClass}>Tipo de negocio</label>
            <input
              className={fieldClass}
              value={form.businessType}
              onChange={(event) => updateField("businessType", event.target.value)}
              placeholder="Ex.: servico residencial"
            />
          </div>
          <div>
            <label className={labelClass}>Produto ou servico</label>
            <input
              className={fieldClass}
              value={form.productOrService}
              onChange={(event) => updateField("productOrService", event.target.value)}
              placeholder="Ex.: limpeza com checklist final"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Principais duvidas conhecidas</label>
            <textarea
              className={textareaClass}
              value={form.knownQuestions}
              onChange={(event) => updateField("knownQuestions", event.target.value)}
              placeholder="Liste perguntas que clientes fazem com frequencia."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Principais objecoes conhecidas</label>
            <textarea
              className={textareaClass}
              value={form.knownObjections}
              onChange={(event) => updateField("knownObjections", event.target.value)}
              placeholder="Liste objecoes recorrentes sobre preco, prazo, confianca ou comparacao."
            />
          </div>
          <div>
            <label className={labelClass}>Tom da resposta</label>
            <select
              className={fieldClass}
              value={form.responseTone}
              onChange={(event) => updateField("responseTone", event.target.value)}
            >
              {toneOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Canal de uso</label>
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
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting || isHistoryLoading}
            className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isSubmitting ? "Gerando..." : "Gerar FAQ"}
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isSubmitting || isHistoryLoading || !selectedGenerationId}
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
                {result ? result.title : "Seu FAQ aparece aqui"}
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
                    Mensagem curta para WhatsApp
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.whatsappMessage, "Mensagem curta para WhatsApp")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.whatsappMessage}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  FAQ do negocio
                </p>
                <div className="mt-3 space-y-3">
                  {result.faqs.map((item, index) => (
                    <div key={`${item.question}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-sm font-semibold text-[#F0EDE6]">{item.question}</p>
                      <p className="mt-2 text-sm leading-6 text-[#A09D97]">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Objecoes comuns
                </p>
                <div className="mt-3 space-y-3">
                  {result.objections.map((item, index) => (
                    <div key={`${item.objection}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-sm font-semibold text-[#F0EDE6]">{item.objection}</p>
                      <p className="mt-2 text-sm leading-6 text-[#A09D97]">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Uso sugerido
                </p>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.suggestedUsage}</p>
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
                  onClick={() => handlePostActionCopy("whatsapp")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar respostas de WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("bio")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar bio do negocio
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("calendar")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar calendario de conteudo educativo
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
              Voce ainda nao criou nenhum FAQ neste app. Preencha o formulario e gere sua primeira
              versao em poucos segundos.
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novos FAQs.
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
                  <button
                    type="button"
                    disabled={isHistoryLoading}
                    onClick={() => handleLoadHistoryItem(item.id)}
                    className="mt-3 inline-flex h-9 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-xs font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {isHistoryLoading ? "Carregando..." : "Editar base"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
