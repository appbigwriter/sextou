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

interface CalendarPost {
  day: string
  theme: string
  format: string
  caption: string
  cta: string
  visualIdea: string
  hashtags: string[]
}

interface ContentCalendarToolProps {
  initialHistory: HistoryItem[]
  initialPublishedMap: Record<string, boolean>
}

interface GeneratedCalendarResult {
  id: string
  title: string
  weekLabel: string
  posts: CalendarPost[]
  nextActions: string[]
  isFavorite: boolean
  status: string
}

const initialForm = {
  businessType: "",
  mainProductOrService: "",
  targetAudience: "",
  weeklyGoal: "autoridade",
  primaryChannel: "instagram",
  tone: "leve",
}

const weeklyGoalOptions = ["autoridade", "vendas", "relacionamento", "engajamento", "agenda cheia"]
const channelOptions = ["instagram", "facebook", "whatsapp status", "linkedin", "tiktok"]
const toneOptions = ["leve", "direto", "consultivo", "caloroso", "profissional"]

function extractResultFromGeneration(generation: any): GeneratedCalendarResult {
  const output = generation.outputData as Record<string, string | CalendarPost[] | string[]>

  return {
    id: generation.id,
    title: generation.title,
    weekLabel: String(output.weekLabel || ""),
    posts: Array.isArray(output.posts)
      ? output.posts.map((item) => ({
          day: String((item as CalendarPost).day || ""),
          theme: String((item as CalendarPost).theme || ""),
          format: String((item as CalendarPost).format || ""),
          caption: String((item as CalendarPost).caption || ""),
          cta: String((item as CalendarPost).cta || ""),
          visualIdea: String((item as CalendarPost).visualIdea || ""),
          hashtags: Array.isArray((item as CalendarPost).hashtags)
            ? (item as CalendarPost).hashtags.map(String)
            : [],
        }))
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
      "weekLabel" in generation.outputData
        ? String(generation.outputData.weekLabel)
        : undefined,
    timestamp: new Date(generation.createdAt).toLocaleString("pt-BR"),
    isFavorite: Boolean(generation.isFavorite),
    status: String(generation.status || "ACTIVE"),
  }
}

export function ContentCalendarTool({
  initialHistory,
  initialPublishedMap,
}: ContentCalendarToolProps) {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState(initialHistory)
  const [result, setResult] = useState<GeneratedCalendarResult | null>(null)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState(
    "Preencha os campos e gere um calendario semanal com 7 posts curtos e acionaveis."
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [publishedMap, setPublishedMap] = useState<Record<number, boolean>>(
    Object.fromEntries(
      Object.entries(initialPublishedMap).map(([key, value]) => [Number(key), value])
    )
  )

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.businessType.trim()) {
      setStatusMessage("Revise os campos destacados: informe o tipo de negocio.")
      return false
    }

    if (!form.mainProductOrService.trim()) {
      setStatusMessage("Revise os campos destacados: informe o produto ou servico principal.")
      return false
    }

    if (!form.targetAudience.trim()) {
      setStatusMessage("Revise os campos destacados: informe o publico-alvo.")
      return false
    }

    return true
  }

  async function generateCalendar(sourceAction: "GENERATE" | "REGENERATE", sourceGenerationId?: string) {
    const response = await fetch("/api/sextou-tools-pro/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appId: "calendario-conteudo-7-dias",
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
            ? "Voce ja usou as 2 regeneracoes deste calendario."
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
    setStatusMessage("Montando seu calendario semanal...")

    try {
      const generation = await generateCalendar("GENERATE")
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setPublishedMap({})
      setStatusMessage("Calendario criado e salvo no historico da sua conta.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao conseguimos gerar agora.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegenerate() {
    if (!selectedGenerationId) {
      setStatusMessage("Gere um calendario primeiro para usar a regeneracao.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("Criando uma nova versao do calendario...")

    try {
      const generation = await generateCalendar("REGENERATE", selectedGenerationId)
      const parsedResult = extractResultFromGeneration(generation)
      setResult(parsedResult)
      setSelectedGenerationId(generation.id)
      setHistory((current) => [buildHistoryItem(generation), ...current].slice(0, 8))
      setPublishedMap({})
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
        throw new Error("Nao foi possivel atualizar esse calendario agora.")
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

      if (action === "favorite") setStatusMessage("Calendario salvo como favorito/template.")
      if (action === "unfavorite") setStatusMessage("Calendario removido dos favoritos.")
      if (action === "archive") setStatusMessage("Calendario arquivado.")
      if (action === "restore") setStatusMessage("Calendario restaurado.")
      if (action === "delete") setStatusMessage("Calendario removido da sua biblioteca ativa.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o calendario.")
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
        throw new Error("Nao foi possivel duplicar esse calendario agora.")
      }

      setHistory((current) => [buildHistoryItem(payload.generation), ...current].slice(0, 8))
      setStatusMessage("Calendario duplicado no historico.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel duplicar agora.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function togglePublished(index: number) {
    if (!selectedGenerationId) {
      return
    }

    const nextValue = !publishedMap[index]
    setIsActionLoading(true)

    try {
      const response = await fetch(`/api/sextou-tools-pro/generations/${selectedGenerationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-calendar-post-published",
          postIndex: index,
          published: nextValue,
        }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar a marcacao deste post.")
      }

      setPublishedMap((current) => ({ ...current, [index]: nextValue }))
      setStatusMessage(nextValue ? "Post marcado como publicado." : "Marcacao de publicado removida.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a marcacao.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handlePostActionCopy(kind: "reels" | "ad" | "comments", post?: CalendarPost) {
    if (!result) {
      return
    }

    const sourcePost = post || result.posts[0]

    const text =
      kind === "reels"
        ? `Crie um roteiro de Reels com base neste post:\n\nTema: ${sourcePost.theme}\nLegenda: ${sourcePost.caption}\nCTA: ${sourcePost.cta}`
        : kind === "ad"
          ? `Crie um anuncio local com base neste post:\n\nTema: ${sourcePost.theme}\nLegenda: ${sourcePost.caption}\nCTA: ${sourcePost.cta}`
          : `Crie respostas para comentarios ou leads com base neste post:\n\nTema: ${sourcePost.theme}\nLegenda: ${sourcePost.caption}\nCTA: ${sourcePost.cta}`

    await navigator.clipboard.writeText(text)

    if (kind === "reels") {
      setStatusMessage("Brief de roteiro de Reels copiado.")
      return
    }

    if (kind === "ad") {
      setStatusMessage("Brief de anuncio local copiado.")
      return
    }

    setStatusMessage("Brief de resposta para comentarios ou leads copiado.")
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
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
              placeholder="Ex.: limpeza residencial"
            />
          </div>
          <div>
            <label className={labelClass}>Produto ou servico principal</label>
            <input
              className={fieldClass}
              value={form.mainProductOrService}
              onChange={(event) => updateField("mainProductOrService", event.target.value)}
              placeholder="Ex.: pacote semanal de limpeza"
            />
          </div>
          <div>
            <label className={labelClass}>Publico-alvo</label>
            <input
              className={fieldClass}
              value={form.targetAudience}
              onChange={(event) => updateField("targetAudience", event.target.value)}
              placeholder="Ex.: brasileiras que trabalham fora o dia todo"
            />
          </div>
          <div>
            <label className={labelClass}>Objetivo da semana</label>
            <select
              className={fieldClass}
              value={form.weeklyGoal}
              onChange={(event) => updateField("weeklyGoal", event.target.value)}
            >
              {weeklyGoalOptions.map((option) => (
                <option key={option} value={option} className="bg-[#171717]">
                  {option}
                </option>
              ))}
            </select>
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
            <label className={labelClass}>Tom de voz</label>
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
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isSubmitting ? "Gerando..." : "Gerar calendario"}
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
                {result ? result.title : "Seu calendario aparece aqui"}
              </h2>
              {result ? <p className="mt-2 text-sm text-[#A09D97]">{result.weekLabel}</p> : null}
            </div>
            {result ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A09D97]">
                {result.status === "ARCHIVED" ? "Arquivado" : "Ativo"}
              </span>
            ) : null}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              {result.posts.map((post, index) => (
                <div key={`${post.day}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A09D97]">
                        {post.day}
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#F0EDE6]">{post.theme}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePublished(index)}
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                        publishedMap[index]
                          ? "border border-[#34D399]/30 bg-[#34D399]/10 text-[#6EE7B7]"
                          : "border border-white/10 bg-black/20 text-[#A09D97]"
                      }`}
                    >
                      {publishedMap[index] ? "Publicado" : "Marcar publicado"}
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm leading-6 text-[#F0EDE6]">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Formato</p>
                      <p className="mt-1">{post.format}</p>
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Legenda</p>
                        <button
                          type="button"
                          onClick={() => handleCopy(post.caption, `${post.day} legenda`)}
                          className="text-xs font-semibold text-[#FCD34D] transition hover:text-white"
                        >
                          Copiar
                        </button>
                      </div>
                      <p className="mt-1">{post.caption}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">CTA</p>
                      <p className="mt-1">{post.cta}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Ideia visual</p>
                      <p className="mt-1">{post.visualIdea}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]">Hashtags</p>
                      <p className="mt-1 text-[#A09D97]">{post.hashtags.join(" ") || "Sem hashtags sugeridas."}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => handlePostActionCopy("reels", post)}
                      className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                    >
                      Gerar Reels
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostActionCopy("ad", post)}
                      className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                    >
                      Criar anuncio
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostActionCopy("comments", post)}
                      className="inline-flex h-11 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                    >
                      Respostas prontas
                    </button>
                  </div>
                </div>
              ))}

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
                  onClick={() => handlePostActionCopy("reels")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar roteiro de Reels
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("ad")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
                >
                  Criar anuncio local
                </button>
                <button
                  type="button"
                  onClick={() => handlePostActionCopy("comments")}
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10 md:col-span-2"
                >
                  Criar resposta para comentarios ou leads
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
              Voce ainda nao criou nenhum calendario neste app. Preencha o formulario e gere sua
              primeira semana em poucos segundos.
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
                Seu historico deste app vai aparecer aqui conforme voce gerar novos calendarios.
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
            A marcacao de publicado por dia agora fica persistida no historico do calendario. O
            registro principal continua sendo semanal, mas cada post pode ser marcado separadamente.
          </p>
        </div>
      </aside>
    </div>
  )
}
