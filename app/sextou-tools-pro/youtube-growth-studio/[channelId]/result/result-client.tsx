"use client"

import { useState } from "react"
import { Sparkles, ArrowLeft, Copy, Check, RotateCw, Loader2, FileText, Share2, HelpCircle, Download } from "lucide-react"

interface ContentItem {
  id: string
  itemType: string
  scheduledDate: Date
  title: string | null
  hook: string | null
  scriptJson: any
  seoPack: any
  socialPack: any
  captionsJson: any
  thumbnailBrief: any
  thumbnailUrl: string | null
}

interface Plan {
  id: string
  month: number
  year: number
  totalVideos: number | null
  totalShorts: number | null
  totalPosts: number | null
  strategySummary: string | null
  calendarJson: any
}

interface Channel {
  id: string
  channelName: string
  niche: string
  city: string | null
}

export function ResultClient({
  channel,
  plan,
  initialItems
}: {
  channel: Channel
  plan: Plan
  initialItems: ContentItem[]
}) {
  const [items, setItems] = useState<ContentItem[]>(initialItems)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(initialItems[0]?.id || null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)
  const [adjustPrompt, setAdjustPrompt] = useState("")
  
  // Celebration and export states
  const [isCelebrateOpen, setIsCelebrateOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const activeItem = items.find(it => it.id === selectedItemId)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGenerateContent = async (itemId: string) => {
    setLoadingItemId(itemId)
    try {
      const res = await fetch(`/api/youtube-growth-studio/channels/${channel.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, itemId })
      })
      if (!res.ok) throw new Error("Erro ao gerar roteiro")

      // Recarrega o item de conteúdo atualizado
      const updatedItemsRes = await fetch(`/api/youtube-growth-studio/channels/${channel.id}/plan-items?planId=${plan.id}`)
      if (updatedItemsRes.ok) {
        const data = await updatedItemsRes.json()
        setItems(data.items)
      }
    } catch (err) {
      alert("Falha ao gerar o roteiro e copys. Tente novamente.")
    } finally {
      setLoadingItemId(null)
    }
  }

  const handleRegenerate = async (itemId: string) => {
    if (!adjustPrompt.trim()) return
    setLoadingItemId(itemId)
    try {
      const res = await fetch(`/api/youtube-growth-studio/channels/${channel.id}/regenerate-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, prompt: adjustPrompt })
      })
      if (!res.ok) throw new Error("Erro ao refinar conteúdo")

      const data = await res.json()
      setItems(prev => prev.map(it => it.id === itemId ? data.item : it))
      setAdjustPrompt("")
    } catch (err) {
      alert("Falha ao aplicar refinamento.")
    } finally {
      setLoadingItemId(null)
    }
  }

  const triggerExport = async (format: "md" | "csv" | "html" | "docx") => {
    setIsExporting(true)
    try {
      // Dispara o modal de celebração antes do download iniciar
      setIsCelebrateOpen(true)
      
      const res = await fetch(`/api/youtube-growth-studio/channels/${channel.id}/export?planId=${plan.id}&format=${format}`)
      if (!res.ok) throw new Error("Falha ao exportar arquivo")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const extension = format === "docx" ? "doc" : format
      a.download = `plano-editorial-${channel.channelName.toLowerCase().replace(/\s+/g, "-")}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert("Erro ao realizar exportação.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6">
        <div>
          <button
            onClick={() => window.location.href = "/sextou-tools-pro/youtube-growth-studio"}
            className="inline-flex items-center gap-1.5 text-xs text-[#A09D97] hover:text-white transition mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Painel
          </button>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FF3D57]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FF3D57]">
            <Sparkles className="h-3.5 w-3.5" /> Geração Premium
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-[#F0EDE6] md:text-4xl">
            {channel.channelName} - Plano Editorial
          </h1>
          <p className="mt-1 text-sm text-[#A09D97]">
            Mês {plan.month} / {plan.year} • Nicho: {channel.niche} • {channel.city || "Estados Unidos"}
          </p>
        </div>
        
        {/* EXPORT SELECTOR BUTTONS */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => triggerExport("docx")}
            disabled={isExporting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-4 text-xs font-bold text-white transition hover:opacity-95 shadow-lg shadow-[#FF3D57]/10 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Baixar Word (.doc)
          </button>
          
          <button
            onClick={() => triggerExport("md")}
            disabled={isExporting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 text-xs font-bold text-[#F0EDE6] transition disabled:opacity-50"
          >
            Baixar Markdown
          </button>

          <button
            onClick={() => triggerExport("csv")}
            disabled={isExporting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 text-xs font-bold text-[#F0EDE6] transition disabled:opacity-50"
          >
            Baixar CSV
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 text-xs font-bold text-[#F0EDE6] transition"
          >
            <Share2 className="h-4 w-4" /> Imprimir
          </button>
        </div>
      </div>

      {/* STRATEGY CARD */}
      <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          🎯 Visão Geral da Estratégia
        </h2>
        <p className="text-sm text-[#A09D97] leading-relaxed">
          {plan.strategySummary || "Estratégia do mês carregada com base nos pilares de conteúdo."}
        </p>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* CALENDAR COLUMN */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display text-lg font-bold text-white">
            📅 Calendário de 30 Dias
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
            {items.map((item, idx) => {
              const isActive = item.id === selectedItemId
              const isGenerated = !!item.scriptJson
              const dateStr = new Date(item.scheduledDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                    isActive
                      ? "border-[#FF3D57] bg-[#FF3D57]/5"
                      : "border-white/5 bg-[#171717]/60 hover:border-white/15"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#5A5755] uppercase tracking-wider">
                        Dia {idx + 1} ({dateStr})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.itemType === "video" ? "bg-red-500/10 text-red-400" :
                        item.itemType === "short" ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {item.itemType}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">
                      {item.title || "Placeholder de Conteúdo"}
                    </p>
                  </div>
                  <div>
                    {isGenerated ? (
                      <span className="text-xs text-green-400 font-bold">✓ Pronto</span>
                    ) : (
                      <span className="text-xs text-[#5A5755] font-bold">Pendente</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* WORK BENCH COLUMN */}
        <div className="lg:col-span-7">
          {activeItem ? (
            <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              {/* ITEM ACTIONS HEADER */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#FF3D57] uppercase tracking-wider">
                    Visualização & Edição
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-1">
                    {activeItem.title || "Sem título definitivo"}
                  </h3>
                </div>

                {!activeItem.scriptJson && (
                  <button
                    disabled={loadingItemId === activeItem.id}
                    onClick={() => handleGenerateContent(activeItem.id)}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-4 text-xs font-bold text-white transition hover:opacity-95 disabled:opacity-50"
                  >
                    {loadingItemId === activeItem.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Gerar Conteúdo"
                    )}
                  </button>
                )}
              </div>

              {activeItem.scriptJson ? (
                <div className="space-y-8">
                  {/* SCRIPTS ACCORDION */}
                  <div className="space-y-3">
                    <h4 className="font-display text-sm font-bold text-white flex items-center justify-between">
                      <span>🎬 Roteiro de Vídeo</span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(activeItem.scriptJson), activeItem.id + "-script")}
                        className="text-xs text-[#A09D97] hover:text-white transition inline-flex items-center gap-1"
                      >
                        {copiedId === activeItem.id + "-script" ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                        {copiedId === activeItem.id + "-script" ? "Copiado" : "Copiar"}
                      </button>
                    </h4>
                    <div className="bg-white/5 rounded-xl p-4 space-y-4 text-sm text-[#A09D97] leading-relaxed font-mono">
                      <div>
                        <span className="block text-xs text-white font-bold uppercase mb-1">Gancho:</span>
                        <p>{activeItem.hook || activeItem.scriptJson.hook}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-white font-bold uppercase mb-1">Introdução:</span>
                        <p>{activeItem.scriptJson.intro}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-white font-bold uppercase mb-1">Talking Points:</span>
                        <ul className="list-disc list-inside pl-2 space-y-1">
                          {activeItem.scriptJson.sections?.map((sec: any, idx: number) => (
                            <li key={idx}>
                              <strong>{sec.title}:</strong> {sec.talking_points?.join(", ")}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="block text-xs text-white font-bold uppercase mb-1">Chamada para Ação (CTA):</span>
                        <p>{activeItem.scriptJson.cta}</p>
                      </div>
                    </div>
                  </div>

                  {/* SEO PACK */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <h4 className="font-display text-sm font-bold text-white">
                      🔍 Otimização de SEO (Descrições & Títulos)
                    </h4>
                    <div className="bg-white/5 rounded-xl p-4 space-y-4 text-sm text-[#A09D97] leading-relaxed">
                      <div>
                        <span className="block text-xs text-white font-bold uppercase mb-1">Títulos Alternativos:</span>
                        <ul className="list-disc list-inside space-y-1">
                          {activeItem.seoPack?.titles?.map((t: any, idx: number) => (
                            <li key={idx}>
                              <span className="text-[10px] font-bold uppercase text-yellow-500 font-mono mr-1">[{t.variant}]</span>
                              {t.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="block text-xs text-white font-bold uppercase mb-1">Descrição do Vídeo:</span>
                        <p className="whitespace-pre-line">{activeItem.seoPack?.description?.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* THUMBNAIL BRIEF */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <h4 className="font-display text-sm font-bold text-white">
                      🎨 Briefing Visual para Thumbnail
                    </h4>
                    <div className="bg-white/5 rounded-xl p-4 text-sm text-[#A09D97] leading-relaxed space-y-2">
                      <p><strong>Fundo Sugerido:</strong> {activeItem.thumbnailBrief?.background_description}</p>
                      <p><strong>Texto na Imagem:</strong> {activeItem.thumbnailBrief?.text_on_screen}</p>
                      <p><strong>Pose/Ator:</strong> {activeItem.thumbnailBrief?.expression_and_actor}</p>
                    </div>
                  </div>

                  {/* REGENERATE SECTION */}
                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <h4 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                      <RotateCw className="h-4 w-4 text-[#FF3D57]" /> Ajustar ou Refinar este Conteúdo
                    </h4>
                    <p className="text-xs text-[#A09D97]">
                      Fez alterações no negócio ou deseja direcionar a IA em pontos específicos do roteiro? Descreva abaixo:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Deixe o tom mais comercial / Simplifique a introdução"
                        value={adjustPrompt}
                        onChange={(e) => setAdjustPrompt(e.target.value)}
                        className="flex-1 bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF3D57]"
                      />
                      <button
                        onClick={() => handleRegenerate(activeItem.id)}
                        disabled={loadingItemId === activeItem.id || !adjustPrompt.trim()}
                        className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 px-5 text-sm font-bold text-white transition disabled:opacity-50"
                      >
                        {loadingItemId === activeItem.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Ajustar"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#A09D97]">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-30 text-white" />
                  <p className="text-sm">Roteiro e copys ainda não gerados para este item do calendário.</p>
                  <p className="text-xs mt-1">Clique no botão "Gerar Conteúdo" acima para criá-lo instantaneamente.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-[#A09D97]">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-30 text-white" />
              <p className="text-sm">Selecione um item no calendário ao lado para ver detalhes.</p>
            </div>
          )}
        </div>
      </div>

      {/* CELEBRATION MODAL */}
      {isCelebrateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-filter backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171717] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 text-center space-y-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Sua Estratégia de YouTube está pronta!
            </h2>
            <p className="text-sm text-[#A09D97] leading-relaxed">
              O arquivo foi estruturado e o download começou automaticamente. Pronto para começar a gravar e dominar seu nicho de negócios nos EUA!
            </p>
            <button
              onClick={() => setIsCelebrateOpen(false)}
              className="w-full btn-grad inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-sm font-bold text-white transition hover:opacity-95 shadow-lg shadow-[#FF3D57]/10"
            >
              Excelente!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
