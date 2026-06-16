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

interface OnePageProposalToolProps {
  initialHistory: HistoryItem[]
}

interface GeneratedProposalResult {
  id: string
  title: string
  clientContext: string
  proposedSolution: string
  scopeBullets: string[]
  timeline: string
  investment: string
  nextSteps: string[]
  deliveryMessage: string
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  clientName: "",
  businessName: "",
  proposedService: "",
  clientProblem: "",
  scope: "",
  deadline: "",
  price: "",
  paymentTerms: "",
  guaranteesOrNotes: "",
}

function extractResultFromGeneration(generation: any): GeneratedProposalResult {
  const output = generation.outputData as Record<string, string | string[]>

  return {
    id: generation.id,
    title: generation.title,
    clientContext: String(output.clientContext || ""),
    proposedSolution: String(output.proposedSolution || ""),
    scopeBullets: Array.isArray(output.scopeBullets) ? output.scopeBullets.map(String) : [],
    timeline: String(output.timeline || ""),
    investment: String(output.investment || ""),
    nextSteps: Array.isArray(output.nextSteps) ? output.nextSteps.map(String) : [],
    deliveryMessage: String(output.deliveryMessage || ""),
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
      "clientContext" in generation.outputData
        ? String(generation.outputData.clientContext)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function OnePageProposalTool({ initialHistory }: OnePageProposalToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedProposalResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Descreva o cliente e o escopo para gerar uma proposta textual curta e profissional."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.businessName.trim()) {
      setStatusMessage("Revise os campos destacados: informe o nome do negocio ou profissional.")
      return false
    }

    if (!form.proposedService.trim()) {
      setStatusMessage("Revise os campos destacados: informe o servico ou produto proposto.")
      return false
    }

    if (!form.clientProblem.trim()) {
      setStatusMessage("Revise os campos destacados: descreva o problema do cliente.")
      return false
    }

    if (!form.scope.trim()) {
      setStatusMessage("Revise os campos destacados: informe o escopo da proposta.")
      return false
    }

    if (!form.deadline.trim()) {
      setStatusMessage("Revise os campos destacados: informe o prazo.")
      return false
    }

    return true
  }

  async function generateProposal(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appId: "proposta-comercial-one-page",
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
            ? "Voce ja usou as 2 regeneracoes desta proposta."
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
    setStatusMessage("Montando sua proposta comercial textual...")

    try {
      const generation = await generateProposal("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Proposta criada e salva no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere uma proposta primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao da proposta...")

    try {
      const generation = await generateProposal("REGENERATE", selectedGenerationId)
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
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
        throw new Error("Nao foi possivel atualizar essa proposta agora.")
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

      if (action === "favorite") setStatusMessage("Proposta salva como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Proposta removida dos favoritos.")
      if (action === "archive") setStatusMessage("Proposta arquivada.")
      if (action === "restore") setStatusMessage("Proposta restaurada.")
      if (action === "delete") setStatusMessage("Proposta removida da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a proposta.")
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
        throw new Error("Nao foi possivel duplicar essa proposta agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Proposta duplicada no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "followup" | "offer" | "briefing") {
    if (!result) {
      return
    }

    const baseProposal = [
      `Contexto do cliente: ${result.clientContext}`,
      `Solucao proposta: ${result.proposedSolution}`,
      `Escopo: ${result.scopeBullets.join(" | ")}`,
      `Investimento: ${result.investment}`,
    ].join("\n")

    const text =
      kind === "followup"
        ? `Crie um follow-up para esta proposta:\n\n${baseProposal}`
        : kind === "offer"
          ? `Crie uma oferta irresistivel com base nesta proposta:\n\n${baseProposal}`
          : `Crie um briefing visual de apresentacao com base nesta proposta:\n\n${baseProposal}`

    await navigator.clipboard.writeText(text)

    if (kind === "followup") {
      setStatusMessage("Brief de follow-up copiado.")
      return
    }

    if (kind === "offer") {
      setStatusMessage("Brief de oferta irresistivel copiado.")
      return
    }

    setStatusMessage("Brief de briefing visual copiado.")
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const textareaClass =
    "min-h-[132px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
        <div className="mb-5 rounded-[20px] border border-[#FCD34D]/15 bg-[#FCD34D]/8 p-4 text-sm leading-7 text-[#F0EDE6]">
          Esta ferramenta gera uma proposta textual curta para revisar e enviar rapido. Ela nao
          substitui o gerador de orcamento PDF do pacote anterior.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nome do cliente</label>
            <input
              className={fieldClass}
              value={form.clientName}
              onChange={(event) => updateField("clientName", event.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className={labelClass}>Nome do negocio ou profissional</label>
            <input
              className={fieldClass}
              value={form.businessName}
              onChange={(event) => updateField("businessName", event.target.value)}
              placeholder="Ex.: Casa Leve Cleaning"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Servico ou produto proposto</label>
            <input
              className={fieldClass}
              value={form.proposedService}
              onChange={(event) => updateField("proposedService", event.target.value)}
              placeholder="Ex.: pacote mensal de limpeza residencial"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Problema do cliente</label>
            <textarea
              className={textareaClass}
              value={form.clientProblem}
              onChange={(event) => updateField("clientProblem", event.target.value)}
              placeholder="Explique o contexto atual e a dor principal que a proposta resolve."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Escopo</label>
            <textarea
              className={textareaClass}
              value={form.scope}
              onChange={(event) => updateField("scope", event.target.value)}
              placeholder="Liste as entregas, frequencia, revisoes e tudo que deve entrar na proposta."
            />
          </div>
          <div>
            <label className={labelClass}>Prazo</label>
            <input
              className={fieldClass}
              value={form.deadline}
              onChange={(event) => updateField("deadline", event.target.value)}
              placeholder="Ex.: inicio em 3 dias uteis"
            />
          </div>
          <div>
            <label className={labelClass}>Valor</label>
            <input
              className={fieldClass}
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className={labelClass}>Condicoes de pagamento</label>
            <input
              className={fieldClass}
              value={form.paymentTerms}
              onChange={(event) => updateField("paymentTerms", event.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className={labelClass}>Garantias ou observacoes</label>
            <input
              className={fieldClass}
              value={form.guaranteesOrNotes}
              onChange={(event) => updateField("guaranteesOrNotes", event.target.value)}
              placeholder="Opcional"
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
            {isSubmitting ? "Gerando..." : "Gerar proposta"}
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
                {result ? result.title : "Sua proposta aparece aqui"}
              </h2>
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
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Contexto do cliente
                </p>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.clientContext}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Solucao proposta
                </p>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.proposedSolution}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Escopo
                </p>
                <div className="mt-3 space-y-2">
                  {result.scopeBullets.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                      <p className="text-sm leading-6 text-[#F0EDE6]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Prazo</p>
                  <p className="mt-3 text-sm leading-6 text-[#F0EDE6]">{result.timeline}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Investimento</p>
                  <p className="mt-3 text-sm leading-6 text-[#F0EDE6]">{result.investment}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Proximos passos
                </p>
                <div className="mt-3 space-y-2">
                  {result.nextSteps.map((item, index) => (
                    <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Mensagem de envio
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.deliveryMessage, "Mensagem de envio")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.deliveryMessage}</p>
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
                  Duplicar para novo cliente
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("followup")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar follow-up da proposta
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
                  onClick={() => handlePostActionCopy("briefing")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar briefing visual
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
              Voce ainda nao criou nenhuma proposta neste app. Preencha o formulario e gere sua
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novas propostas.
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
            Esta proposta e um texto comercial enxuto para revisar e enviar rapido. Quando voce
            precisar de PDF formal, continue usando o gerador de orcamento do pacote anterior.
          </p>
        </div>
      </aside>
    </div>
  )
}
