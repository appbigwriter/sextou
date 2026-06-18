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

interface CreativeBriefToolProps {
  initialHistory: HistoryItem[]
}

interface GeneratedCreativeBriefResult {
  id: string
  title: string
  organizedBrief: string
  projectGoal: string
  targetAudience: string
  mainMessage: string
  visualDirection: string[]
  requiredContent: string[]
  openQuestions: string[]
  deliveryChecklist: string[]
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  projectType: "",
  businessName: "",
  targetAudience: "",
  projectGoal: "",
  desiredStyle: "",
  preferredColors: "",
  references: "",
  requiredInformation: "",
}

function extractResultFromGeneration(generation: any): GeneratedCreativeBriefResult {
  const output = generation.outputData as Record<string, unknown>

  return {
    id: generation.id,
    title: generation.title,
    organizedBrief: String(output.organizedBrief || ""),
    projectGoal: String(output.projectGoal || ""),
    targetAudience: String(output.targetAudience || ""),
    mainMessage: String(output.mainMessage || ""),
    visualDirection: Array.isArray(output.visualDirection) ? output.visualDirection.map(String) : [],
    requiredContent: Array.isArray(output.requiredContent) ? output.requiredContent.map(String) : [],
    openQuestions: Array.isArray(output.openQuestions) ? output.openQuestions.map(String) : [],
    deliveryChecklist: Array.isArray(output.deliveryChecklist) ? output.deliveryChecklist.map(String) : [],
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
      "projectGoal" in generation.outputData
        ? String(generation.outputData.projectGoal)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function CreativeBriefTool({ initialHistory }: CreativeBriefToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedCreativeBriefResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha os dados do projeto e gere um briefing curto, claro e pronto para enviar ao designer."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.projectType.trim() || !form.businessName.trim() || !form.targetAudience.trim()) {
      setStatusMessage("Revise tipo de projeto, nome do negocio e publico-alvo.")
      return false
    }

    if (!form.projectGoal.trim() || !form.desiredStyle.trim() || !form.requiredInformation.trim()) {
      setStatusMessage("Revise objetivo, estilo desejado e informacoes obrigatorias do material.")
      return false
    }

    return true
  }

  async function generateBrief(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "creative-brief",
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
            ? "Voce ja usou as 2 regeneracoes deste briefing."
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
    setStatusMessage("Organizando seu briefing criativo...")

    try {
      const generation = await generateBrief("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Briefing criado e salvo no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um briefing primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao do briefing...")

    try {
      const generation = await generateBrief("REGENERATE", selectedGenerationId)
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
        throw new Error("Nao foi possivel atualizar esse briefing agora.")
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

      if (action === "favorite") setStatusMessage("Briefing salvo como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Briefing removido dos favoritos.")
      if (action === "archive") setStatusMessage("Briefing arquivado.")
      if (action === "restore") setStatusMessage("Briefing restaurado.")
      if (action === "delete") setStatusMessage("Briefing removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o briefing.")
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
        throw new Error("Nao foi possivel duplicar esse briefing agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Briefing duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleDerivedActionCopy(kind: "service" | "proposal" | "ads") {
    if (!result) {
      return
    }

    const base = [
      `Resumo: ${result.organizedBrief}`,
      `Objetivo: ${result.projectGoal}`,
      `Mensagem principal: ${result.mainMessage}`,
      `Conteudo obrigatorio: ${result.requiredContent.join(" | ")}`,
    ].join("\n")

    const text =
      kind === "service"
        ? `Monte uma solicitacao de servico pago com base neste briefing:\n\n${base}`
        : kind === "proposal"
          ? `Crie uma proposta comercial com base neste briefing:\n\n${base}`
          : `Crie um anuncio local com base neste briefing:\n\n${base}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "service"
        ? "Brief de solicitacao de servico copiado."
        : kind === "proposal"
          ? "Brief de proposta comercial copiado."
          : "Brief de anuncio local copiado."
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
            <label className={labelClass}>Tipo de projeto</label>
            <input
              className={fieldClass}
              value={form.projectType}
              onChange={(event) => updateField("projectType", event.target.value)}
              placeholder="Ex.: logo, site one-page, panfleto, card digital"
            />
          </div>
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
            <label className={labelClass}>Publico-alvo</label>
            <input
              className={fieldClass}
              value={form.targetAudience}
              onChange={(event) => updateField("targetAudience", event.target.value)}
              placeholder="Ex.: mulheres ocupadas que valorizam organizacao"
            />
          </div>
          <div>
            <label className={labelClass}>Estilo desejado</label>
            <input
              className={fieldClass}
              value={form.desiredStyle}
              onChange={(event) => updateField("desiredStyle", event.target.value)}
              placeholder="Ex.: clean, premium, acolhedor, moderno"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Objetivo do material</label>
            <textarea
              className={textareaClass}
              value={form.projectGoal}
              onChange={(event) => updateField("projectGoal", event.target.value)}
              placeholder="Ex.: passar mais confianca, organizar apresentacao e facilitar pedido de orcamento."
            />
          </div>
          <div>
            <label className={labelClass}>Cores preferidas</label>
            <input
              className={fieldClass}
              value={form.preferredColors}
              onChange={(event) => updateField("preferredColors", event.target.value)}
              placeholder="Ex.: bege, preto, dourado"
            />
          </div>
          <div>
            <label className={labelClass}>Referencias</label>
            <input
              className={fieldClass}
              value={form.references}
              onChange={(event) => updateField("references", event.target.value)}
              placeholder="Ex.: perfis, sites ou estilos que fazem sentido"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Informacoes obrigatorias</label>
            <textarea
              className={textareaClass}
              value={form.requiredInformation}
              onChange={(event) => updateField("requiredInformation", event.target.value)}
              placeholder="Ex.: servicos, CTA, WhatsApp, local de atendimento, diferenciais e observacoes."
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
            {isSubmitting ? "Gerando..." : "Gerar briefing"}
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
                {result ? result.title : "Seu briefing aparece aqui"}
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
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Briefing organizado</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.organizedBrief, "Briefing organizado")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.organizedBrief}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Objetivo do projeto</p>
                  <p className="mt-3 text-sm leading-6 text-[#F0EDE6]">{result.projectGoal}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Publico-alvo</p>
                  <p className="mt-3 text-sm leading-6 text-[#F0EDE6]">{result.targetAudience}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Mensagem principal</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.mainMessage, "Mensagem principal")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.mainMessage}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Direcao visual</p>
                  <div className="mt-3 space-y-2">
                    {result.visualDirection.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">{item}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Conteudo obrigatorio</p>
                  <div className="mt-3 space-y-2">
                    {result.requiredContent.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">{item}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Perguntas pendentes</p>
                  <div className="mt-3 space-y-2">
                    {result.openQuestions.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">{item}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">Checklist de envio</p>
                  <div className="mt-3 space-y-2">
                    {result.deliveryChecklist.map((item, index) => (
                      <p key={`${item}-${index}`} className="text-sm leading-6 text-[#F0EDE6]">{item}</p>
                    ))}
                  </div>
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
                  onClick={() => handleDerivedActionCopy("service")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Solicitar servico pago
                </button>
                <button
                  type="button"
                  onClick={() => handleDerivedActionCopy("proposal")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar proposta comercial
                </button>
                <button
                  type="button"
                  onClick={() => handleDerivedActionCopy("ads")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar anuncio local
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
              Voce ainda nao criou nenhum briefing neste app. Preencha o formulario e gere sua primeira versao em poucos segundos.
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">
            Historico por tipo de projeto
          </p>
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#A09D97]">
                Seu historico deste app vai aparecer aqui conforme voce gerar novos briefings.
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
