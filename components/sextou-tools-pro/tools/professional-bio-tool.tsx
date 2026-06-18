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

interface ProfessionalBioToolProps {
  initialHistory: HistoryItem[]
}

interface GeneratedBioResult {
  id: string
  title: string
  instagramBio: string
  linkedinBio: string
  googleBusinessDescription: string
  shortHeadline: string
  profileCta: string
  positioningKeywords: string[]
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  businessName: "",
  segment: "",
  targetAudience: "",
  cityOrRegion: "",
  mainService: "",
  differentiator: "",
  desiredCta: "",
  tone: "profissional",
}

const toneOptions = ["profissional", "consultivo", "caloroso", "direto", "sofisticado"]
const channelLabels = {
  instagramBio: "Instagram",
  linkedinBio: "LinkedIn",
  googleBusinessDescription: "Google Business Profile",
} as const

type BioChannelKey = keyof typeof channelLabels

const channelOptionsBySource: Record<BioChannelKey, { value: BioChannelKey; label: string }[]> = {
  instagramBio: [
    { value: "linkedinBio", label: "LinkedIn" },
    { value: "googleBusinessDescription", label: "Google Business Profile" },
  ],
  linkedinBio: [
    { value: "instagramBio", label: "Instagram" },
    { value: "googleBusinessDescription", label: "Google Business Profile" },
  ],
  googleBusinessDescription: [
    { value: "instagramBio", label: "Instagram" },
    { value: "linkedinBio", label: "LinkedIn" },
  ],
}

function extractResultFromGeneration(generation: any): GeneratedBioResult {
  const output = generation.outputData as Record<string, string | string[]>

  return {
    id: generation.id,
    title: generation.title,
    instagramBio: String(output.instagramBio || ""),
    linkedinBio: String(output.linkedinBio || ""),
    googleBusinessDescription: String(output.googleBusinessDescription || ""),
    shortHeadline: String(output.shortHeadline || ""),
    profileCta: String(output.profileCta || ""),
    positioningKeywords: Array.isArray(output.positioningKeywords)
      ? output.positioningKeywords.map(String)
      : [],
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
      "shortHeadline" in generation.outputData
        ? String(generation.outputData.shortHeadline)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function ProfessionalBioTool({ initialHistory }: ProfessionalBioToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedBioResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha os campos e gere bios por canal com CTA claro e posicionamento profissional."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [channelTarget, setChannelTarget] = useState<Record<BioChannelKey, BioChannelKey>>({
    instagramBio: "linkedinBio",
    linkedinBio: "instagramBio",
    googleBusinessDescription: "instagramBio",
  })

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.businessName.trim() || !form.segment.trim() || !form.targetAudience.trim()) {
      setStatusMessage("Revise os campos destacados: informe nome, segmento e publico-alvo.")
      return false
    }

    if (!form.mainService.trim() || !form.differentiator.trim() || !form.desiredCta.trim()) {
      setStatusMessage("Revise os campos destacados: informe servico principal, diferencial e CTA.")
      return false
    }

    return true
  }

  async function generateBio(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: "professional-bio",
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
            ? "Voce ja usou as 2 regeneracoes desta bio."
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
    setStatusMessage("Montando suas bios por canal...")

    try {
      const generation = await generateBio("GENERATE")
      setResult(extractResultFromGeneration(generation))
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setStatusMessage("Bio criada e salva no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere uma bio primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao da bio...")

    try {
      const generation = await generateBio("REGENERATE", selectedGenerationId)
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

  async function handleChannelDuplicate(source: BioChannelKey) {
    if (!result) {
      return
    }

    const target = channelTarget[source]
    const sourceLabel = channelLabels[source]
    const targetLabel = channelLabels[target]
    const sourceText = result[source]
    const brief = [
      `Adapte esta bio de ${sourceLabel} para ${targetLabel}.`,
      `Mantenha a headline "${result.shortHeadline}" e a CTA "${result.profileCta}".`,
      `Preserve o posicionamento e ajuste o tamanho para o canal de destino.`,
      "",
      sourceText,
    ].join("\n")

    await navigator.clipboard.writeText(brief)
    setStatusMessage(`Brief de duplicacao de ${sourceLabel} para ${targetLabel} copiado.`)
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
        throw new Error("Nao foi possivel atualizar essa bio agora.")
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

      if (action === "favorite") setStatusMessage("Bio salva como favorita/template.")
      if (action === "unfavorite") setStatusMessage("Bio removida dos favoritos.")
      if (action === "archive") setStatusMessage("Bio arquivada.")
      if (action === "restore") setStatusMessage("Bio restaurada.")
      if (action === "delete") setStatusMessage("Bio removida da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a bio.")
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
        throw new Error("Nao foi possivel duplicar essa bio agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Bio duplicada no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "calendar" | "intro" | "faq") {
    if (!result) {
      return
    }

    const baseBio = [
      `Headline: ${result.shortHeadline}`,
      `CTA do perfil: ${result.profileCta}`,
      `Instagram: ${result.instagramBio}`,
      `LinkedIn: ${result.linkedinBio}`,
      `Google: ${result.googleBusinessDescription}`,
    ].join("\n")

    const text =
      kind === "calendar"
        ? `Crie um calendario de conteudo com base nesta bio:\n\n${baseBio}`
        : kind === "intro"
          ? `Crie posts de apresentacao com base nesta bio:\n\n${baseBio}`
          : `Crie um FAQ do negocio com base nesta bio:\n\n${baseBio}`

    await navigator.clipboard.writeText(text)
    setStatusMessage(
      kind === "calendar"
        ? "Brief de calendario de conteudo copiado."
        : kind === "intro"
          ? "Brief de posts de apresentacao copiado."
          : "Brief de FAQ do negocio copiado."
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
            <label className={labelClass}>Nome do negocio</label>
            <input
              className={fieldClass}
              value={form.businessName}
              onChange={(event) => updateField("businessName", event.target.value)}
              placeholder="Ex.: Casa Leve Cleaning"
            />
          </div>
          <div>
            <label className={labelClass}>Segmento</label>
            <input
              className={fieldClass}
              value={form.segment}
              onChange={(event) => updateField("segment", event.target.value)}
              placeholder="Ex.: limpeza residencial"
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
            <label className={labelClass}>Servico principal</label>
            <input
              className={fieldClass}
              value={form.mainService}
              onChange={(event) => updateField("mainService", event.target.value)}
              placeholder="Ex.: limpeza com checklist final"
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
            <label className={labelClass}>Diferencial</label>
            <input
              className={fieldClass}
              value={form.differentiator}
              onChange={(event) => updateField("differentiator", event.target.value)}
              placeholder="Ex.: atendimento claro e pontual"
            />
          </div>
          <div>
            <label className={labelClass}>CTA desejada</label>
            <input
              className={fieldClass}
              value={form.desiredCta}
              onChange={(event) => updateField("desiredCta", event.target.value)}
              placeholder="Ex.: chame no WhatsApp"
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
            {isSubmitting ? "Gerando..." : "Gerar bio"}
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
                {result ? result.title : "Sua bio aparece aqui"}
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
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    Headline curta
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.shortHeadline, "Headline curta")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.shortHeadline}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                    CTA para perfil
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.profileCta, "CTA para perfil")}
                    className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{result.profileCta}</p>
              </div>

              {[
                { key: "instagramBio", label: "Instagram", value: result.instagramBio },
                { key: "linkedinBio", label: "LinkedIn", value: result.linkedinBio },
                {
                  key: "googleBusinessDescription",
                  label: "Google Business Profile",
                  value: result.googleBusinessDescription,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                      {item.label}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.value, item.label)}
                      className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#F0EDE6]">{item.value}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <select
                      value={channelTarget[item.key as BioChannelKey]}
                      onChange={(event) =>
                        setChannelTarget((current) => ({
                          ...current,
                          [item.key]: event.target.value as BioChannelKey,
                        }))
                      }
                      className="h-10 rounded-2xl border border-white/10 bg-black/20 px-3 text-xs text-[#F0EDE6] outline-none"
                    >
                      {channelOptionsBySource[item.key as BioChannelKey].map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#171717]">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleChannelDuplicate(item.key as BioChannelKey)}
                      className="inline-flex h-10 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-xs font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                    >
                      Duplicar para outro canal
                    </button>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                  Palavras-chave de posicionamento
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.positioningKeywords.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-[#F0EDE6]"
                    >
                      {item}
                    </span>
                  ))}
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
                  onClick={() => handlePostActionCopy("calendar")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar calendario de conteudo
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("intro")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar posts de apresentacao
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("faq")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar FAQ do negocio
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
              Voce ainda nao criou nenhuma bio neste app. Preencha o formulario e gere sua primeira
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novas bios.
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
      </aside>
    </div>
  )
}
