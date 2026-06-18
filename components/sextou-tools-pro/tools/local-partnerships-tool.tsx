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

interface PartnershipIdea {
  partnerCategory: string
  partnershipReason: string
  approachProposal: string
  firstContactMessage: string
  jointCampaignIdea: string
  recommendedNextStep: string
}

interface LocalPartnershipsToolProps {
  initialHistory: HistoryItem[]
  initialStatusMap: Record<string, string>
}

interface GeneratedLocalPartnershipsResult {
  id: string
  title: string
  campaignLabel: string
  ideas: PartnershipIdea[]
  nextActions: string[]
  statusMap: Record<string, string>
  isFavorite: boolean
  status: string
}

const initialForm = {
  businessType: "",
  cityOrRegion: "",
  targetAudience: "",
  averageTicket: "",
  partnershipGoal: "",
  restrictionsOrPreferences: "",
}

const statusLabels: Record<string, string> = {
  novo: "Novo",
  contatado: "Contatado",
  interessado: "Interessado",
}

function extractStatusMap(metadataJson: unknown) {
  if (!metadataJson || typeof metadataJson !== "object" || Array.isArray(metadataJson)) {
    return {}
  }

  const statusValue = (metadataJson as Record<string, unknown>).localPartnershipStatus

  if (!statusValue || typeof statusValue !== "object" || Array.isArray(statusValue)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(statusValue).filter(
      (entry): entry is [string, string] => typeof entry[0] === "string" && typeof entry[1] === "string"
    )
  )
}

function extractResultFromGeneration(generation: any): GeneratedLocalPartnershipsResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    campaignLabel: String(output.campaignLabel || ""),
    ideas: Array.isArray(output.ideas)
      ? output.ideas.map((item) => ({
          partnerCategory: String((item as PartnershipIdea).partnerCategory || ""),
          partnershipReason: String((item as PartnershipIdea).partnershipReason || ""),
          approachProposal: String((item as PartnershipIdea).approachProposal || ""),
          firstContactMessage: String((item as PartnershipIdea).firstContactMessage || ""),
          jointCampaignIdea: String((item as PartnershipIdea).jointCampaignIdea || ""),
          recommendedNextStep: String((item as PartnershipIdea).recommendedNextStep || ""),
        }))
      : [],
    nextActions: Array.isArray(output.nextActions) ? output.nextActions.map(String) : [],
    statusMap: extractStatusMap(generation.metadataJson),
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
      "campaignLabel" in generation.outputData
        ? String(generation.outputData.campaignLabel)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function LocalPartnershipsTool({
  initialHistory,
  initialStatusMap,
}: LocalPartnershipsToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedLocalPartnershipsResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMap, setStatusMap] = useState(initialStatusMap)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha o contexto local e gere 10 ideias de parceria por categoria, sem depender de empresas reais."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.businessType.trim() || !form.cityOrRegion.trim() || !form.targetAudience.trim()) {
      setStatusMessage("Revise tipo de negocio, regiao e publico antes de gerar as ideias.")
      return false
    }

    if (!form.partnershipGoal.trim()) {
      setStatusMessage("Informe o objetivo principal da parceria para gerar ideias mais acionaveis.")
      return false
    }

    return true
  }

  async function generatePartnerships(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "local-partnerships",
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
            ? "Voce ja usou as 2 regeneracoes desta lista."
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
    setStatusMessage("Criando suas ideias de parcerias locais...")

    try {
      const generation = await generatePartnerships("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setStatusMap(parsedResult.statusMap)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Lista criada e salva no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere uma lista primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao das parcerias...")

    try {
      const generation = await generatePartnerships("REGENERATE", selectedGenerationId)
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setStatusMap(parsedResult.statusMap)
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
        throw new Error("Nao foi possivel atualizar essa lista agora.")
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

      if (action === "favorite") setStatusMessage("Lista salva como favorita/template.")
      if (action === "unfavorite") setStatusMessage("Lista removida dos favoritos.")
      if (action === "archive") setStatusMessage("Lista arquivada.")
      if (action === "restore") setStatusMessage("Lista restaurada.")
      if (action === "delete") setStatusMessage("Lista removida da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a lista.")
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
        throw new Error("Nao foi possivel duplicar essa lista agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Lista duplicada no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleStatusChange(index: number, nextStatus: "novo" | "contatado" | "interessado") {
    if (!selectedGenerationId || !result) {
      return
    }

    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations/${selectedGenerationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-local-partnership-status",
          partnerIndex: index,
          partnershipStatus: nextStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar o status desta parceria.")
      }

      const payload = await response.json()
      const updatedStatusMap = extractStatusMap(payload.generation.metadataJson)
      setStatusMap(updatedStatusMap)
      setResult((current) => (current ? { ...current, statusMap: updatedStatusMap } : current))
      setStatusMessage(`Parceria ${index + 1} marcada como ${statusLabels[nextStatus].toLowerCase()}.`)
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o status.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleDerivedActionCopy(kind: "message" | "ads" | "launch", idea?: PartnershipIdea) {
    const sourceIdea = idea || result?.ideas[0]

    if (!sourceIdea) {
      return
    }

    const text =
      kind === "message"
        ? `Crie uma mensagem de abordagem com base nesta parceria:\n\nCategoria: ${sourceIdea.partnerCategory}\nMotivo: ${sourceIdea.partnershipReason}\nAbordagem: ${sourceIdea.approachProposal}\nMensagem base: ${sourceIdea.firstContactMessage}`
        : kind === "ads"
          ? `Crie um anuncio local com base nesta parceria:\n\nCategoria: ${sourceIdea.partnerCategory}\nCampanha conjunta: ${sourceIdea.jointCampaignIdea}\nProximo passo: ${sourceIdea.recommendedNextStep}`
          : `Crie um plano de lancamento com base nesta parceria:\n\nCategoria: ${sourceIdea.partnerCategory}\nCampanha conjunta: ${sourceIdea.jointCampaignIdea}\nProximo passo: ${sourceIdea.recommendedNextStep}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "message"
        ? "Brief de mensagem de abordagem copiado."
        : kind === "ads"
          ? "Brief de anuncio local copiado."
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
            <label className={labelClass}>Tipo de negocio</label>
            <input
              className={fieldClass}
              value={form.businessType}
              onChange={(event) => updateField("businessType", event.target.value)}
              placeholder="Ex.: servico local premium"
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
              placeholder="Ex.: brasileiras ocupadas da regiao"
            />
          </div>
          <div>
            <label className={labelClass}>Ticket medio</label>
            <input
              className={fieldClass}
              value={form.averageTicket}
              onChange={(event) => updateField("averageTicket", event.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Objetivo da parceria</label>
            <textarea
              className={textareaClass}
              value={form.partnershipGoal}
              onChange={(event) => updateField("partnershipGoal", event.target.value)}
              placeholder="Ex.: gerar novas indicacoes, aumentar autoridade local ou criar oferta cruzada."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Restricoes ou preferencias</label>
            <textarea
              className={textareaClass}
              value={form.restrictionsOrPreferences}
              onChange={(event) => updateField("restrictionsOrPreferences", event.target.value)}
              placeholder="Ex.: evitar parceiros que competem direto, preferir negocios com publico semelhante e acao simples."
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
            {isSubmitting ? "Gerando..." : "Gerar parcerias"}
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
                {result ? result.title : "Suas parcerias aparecem aqui"}
              </h2>
              {result ? <p className="mt-2 text-sm text-[#A09D97]">{result.campaignLabel}</p> : null}
            </div>
            {result ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A09D97]">
                {result.status === "ARCHIVED" ? "Arquivada" : "Ativa"}
              </span>
            ) : null}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              {result.ideas.map((item, index) => {
                const currentStatus = statusMap[String(index)] || "novo"

                return (
                  <div key={`${item.partnerCategory}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                          Ideia {index + 1}
                        </p>
                        <p className="mt-1 text-base font-semibold text-[#F0EDE6]">{item.partnerCategory}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FCD34D]">
                        {statusLabels[currentStatus] || "Novo"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3 text-sm leading-7">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Motivo da parceria</p>
                        <p className="mt-1 text-[#F0EDE6]">{item.partnershipReason}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Abordagem proposta</p>
                        <p className="mt-1 text-[#F0EDE6]">{item.approachProposal}</p>
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Mensagem inicial</p>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.firstContactMessage, `Mensagem inicial ${index + 1}`)}
                            className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="mt-1 text-[#F0EDE6]">{item.firstContactMessage}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Campanha conjunta</p>
                        <p className="mt-1 text-[#F0EDE6]">{item.jointCampaignIdea}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Proximo passo</p>
                        <p className="mt-1 text-[#F0EDE6]">{item.recommendedNextStep}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() => handleStatusChange(index, "contatado")}
                        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                      >
                        Marcar contatado
                      </button>
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() => handleStatusChange(index, "interessado")}
                        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                      >
                        Marcar interessado
                      </button>
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() => handleStatusChange(index, "novo")}
                        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 disabled:opacity-50"
                      >
                        Voltar para novo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDerivedActionCopy("message", item)}
                        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                      >
                        Criar mensagem
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDerivedActionCopy("ads", item)}
                        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                      >
                        Criar anuncio
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDerivedActionCopy("launch", item)}
                        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                      >
                        Criar lancamento
                      </button>
                    </div>
                  </div>
                )
              })}

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
                  onClick={() => handleDerivedActionCopy("message")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar mensagem de abordagem
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
                  onClick={() => handleDerivedActionCopy("launch")}
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
                  Arquivar lista
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
              Voce ainda nao criou nenhuma lista neste app. Preencha o formulario e gere sua primeira versao em poucos segundos.
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novas listas.
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
