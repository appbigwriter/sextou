"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Sparkles, Check, Copy, RefreshCw, Mail, Share2, 
  MessageSquare, FileText, ChevronRight, Layout, Download, 
  AlertCircle, ShieldCheck, HelpCircle, Loader2 
} from "lucide-react"

interface ContentItem {
  id: string
  contentType: string
  channel: string
  title: string | null
  body: string
  framework: string | null
  pronomesOk: boolean
  readability: number | null
}

interface CampaignData {
  id: string
  dorPrincipal: string
  medo: string
  sonho: string
  promessa: string
  provaSocial: string
  escassez: string
  status: string
  project: {
    projectName: string
    targetAudience: string
    basicIdea: string
  }
}

interface EasySocialResultClientProps {
  campaign: CampaignData
  initialContents: ContentItem[]
}

export function EasySocialResultClient({ campaign, initialContents }: EasySocialResultClientProps) {
  const router = useRouter()
  const [contents, setContents] = useState<ContentItem[]>(initialContents)
  const [generating, setGenerating] = useState(initialContents.length === 0)
  const [activeTab, setActiveTab] = useState<"posts" | "headlines" | "emails">("posts")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [showCelebration, setShowCelebration] = useState(false)

  // Se não houver conteúdos salvos, dispara a geração automaticamente ao carregar
  useEffect(() => {
    if (initialContents.length === 0) {
      handleGenerate()
    }
  }, [initialContents])

  const handleGenerate = async () => {
    setGenerating(true)
    setError("")
    try {
      const response = await fetch(`/api/social-network-studio/campaigns/${campaign.id}/generate`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Erro na resposta da inteligência artificial. Tente novamente.")
      }

      // Recarrega a página para puxar os novos conteúdos do banco
      router.refresh()
      
      // Busca local rápida dos conteúdos novos
      const updatedResponse = await fetch(`/api/social-network-studio/campaigns/${campaign.id}/contents`)
      if (updatedResponse.ok) {
        const data = await updatedResponse.json()
        setContents(data)
      }
    } catch (err: any) {
      setError(err.message || "Erro de conexão.")
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExport = async (format: "md" | "csv" | "doc") => {
    try {
      const response = await fetch(`/api/social-network-studio/campaigns/${campaign.id}/export?format=${format}`)
      if (!response.ok) throw new Error("Erro na exportação")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `easysocial-pack-${campaign.id}.${format === "doc" ? "doc" : format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setShowCelebration(true)
    } catch (err) {
      alert("Erro ao realizar exportação do arquivo.")
    }
  }

  const posts = contents.filter(c => c.contentType === "post")
  const headlines = contents.filter(c => c.contentType === "headline")
  const emails = contents.filter(c => c.contentType === "email")

  if (generating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] rounded-full blur-xl opacity-30 animate-pulse" />
          <Loader2 className="h-16 w-16 text-[#FF8C00] animate-spin relative" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="font-toolkit text-2xl font-bold text-white">Engenharia de Atenção em Ação</h3>
          <p className="text-xs text-[#A09D97] leading-relaxed">
            Nossa inteligência artificial está orquestrando os 42 princípios de resposta direta, calibrando pronomes no singular e otimizando a legibilidade. Isso pode levar de 5 a 15 segundos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* TELA DE CELEBRAÇÃO V2 (STORY 8) */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-filter backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="celebrate w-full max-w-lg rounded-[28px] p-8 text-center shadow-2xl relative bg-gradient-to-br from-[#FF3D57] via-[#9B6DFF] to-[#4A9EFF]">
            <div className="celebrate-emoji text-6xl mb-4">🎉</div>
            <h2 className="celebrate-title text-3xl font-extrabold text-white mb-2">Sua Copy está Pronta!</h2>
            <p className="celebrate-sub text-sm text-white/90 mb-8 max-w-sm mx-auto leading-relaxed">
              Parabéns! Exportamos o seu pacote de criativos EasySocial estruturado com base nos 42 ensinamentos de Ícaro de Carvalho com sucesso.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowCelebration(false)}
                className="inline-flex h-[54px] w-full items-center justify-center rounded-2xl bg-white text-black font-bold text-sm shadow-md transition hover:bg-white/90"
              >
                Voltar à Campanha
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12 max-w-7xl mx-auto">
      {/* PAINEL LATERAL ESQUERDO: CANVAS 11 ESTRELAS */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Layout className="h-5 w-5 text-[#FF8C00]" />
            <h3 className="font-toolkit text-sm font-bold text-white uppercase tracking-wider">Canvas da Campanha</h3>
          </div>

          <div className="space-y-4 text-xs leading-relaxed">
            <div>
              <span className="font-semibold text-[#A09D97] block">Projeto</span>
              <span className="text-white text-sm font-bold">{campaign.project.projectName}</span>
            </div>
            <div>
              <span className="font-semibold text-[#A09D97] block">Público-Alvo</span>
              <span className="text-white">{campaign.project.targetAudience}</span>
            </div>
            <div>
              <span className="font-semibold text-[#A09D97] block">Dor Principal</span>
              <span className="text-white/90">{campaign.dorPrincipal}</span>
            </div>
            <div>
              <span className="font-semibold text-[#A09D97] block">Medo Profundo</span>
              <span className="text-white/90">{campaign.medo}</span>
            </div>
            <div>
              <span className="font-semibold text-[#A09D97] block">Promessa / Solução</span>
              <span className="text-white/90">{campaign.promessa}</span>
            </div>
            <div>
              <span className="font-semibold text-[#A09D97] block">Escassez Real</span>
              <span className="text-white/90">{campaign.escassez}</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
          >
            <RefreshCw className="h-4.5 w-4.5" /> Regenerar Pacote Completo
          </button>
        </div>

        {/* DOWNLOAD / EXPORT CARD */}
        <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Download className="h-5 w-5 text-[#FF3D57]" />
            <h3 className="font-toolkit text-sm font-bold text-white uppercase tracking-wider">Exportar Dossiê</h3>
          </div>
          <p className="text-xs text-[#A09D97] leading-relaxed">
            Baixe todas as suas headlines, posts e e-mails estruturados para arquivar ou usar em outras ferramentas.
          </p>

          <div className="grid gap-2">
            <button
              onClick={() => handleExport("md")}
              className="flex items-center justify-between px-4 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition cursor-pointer"
            >
              <span>Markdown (.md)</span> <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleExport("doc")}
              className="flex items-center justify-between px-4 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition cursor-pointer"
            >
              <span>Microsoft Word (.doc)</span> <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PAINEL CENTRAL DIREITO: DADOS GERADOS */}
      <div className="lg:col-span-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex gap-2 p-1 bg-[#171717] border border-white/5 rounded-2xl">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold transition ${
              activeTab === "posts"
                ? "bg-[#FF3D57] text-white shadow"
                : "text-[#A09D97] hover:text-white hover:bg-white/5"
            }`}
          >
            <Share2 className="h-4.5 w-4.5" /> Redes Sociais ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("headlines")}
            className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold transition ${
              activeTab === "headlines"
                ? "bg-[#FF3D57] text-white shadow"
                : "text-[#A09D97] hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="h-4.5 w-4.5" /> Headlines ({headlines.length})
          </button>
          <button
            onClick={() => setActiveTab("emails")}
            className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold transition ${
              activeTab === "emails"
                ? "bg-[#FF3D57] text-white shadow"
                : "text-[#A09D97] hover:text-white hover:bg-white/5"
            }`}
          >
            <Mail className="h-4.5 w-4.5" /> E-mails ({emails.length})
          </button>
        </div>

        {/* CONTEÚDO DA ABA SELECIONADA */}
        <div className="space-y-6">
          {activeTab === "posts" && posts.map((item, idx) => (
            <div key={item.id} className="rounded-3xl border border-white/10 bg-[#171717] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#5A5755] uppercase tracking-wider">Post {idx + 1} ({item.framework})</span>
                  <h4 className="font-toolkit font-bold text-white mt-0.5">{item.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`h-6 px-2.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                    item.pronomesOk 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {item.pronomesOk ? "Pronomes: Você OK" : "Alerta de Pronomes Plurais"}
                  </span>
                  <span className="h-6 px-2.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Legibilidade: {item.readability || 80}/100
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#F0EDE6]/90 whitespace-pre-line leading-relaxed font-sans p-4 rounded-2xl bg-[#1F1F1F]/60 border border-white/5">
                {item.body}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(item.id, item.body)}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar Texto
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {activeTab === "headlines" && (
            <div className="rounded-3xl border border-white/10 bg-[#171717] p-6 space-y-4 shadow-xl">
              <h4 className="font-toolkit font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#FF8C00]" /> Iscas de Atenção Rápida
              </h4>
              <div className="space-y-3">
                {headlines.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#1F1F1F]/60 border border-white/5 gap-4">
                    <p className="text-sm text-white font-medium">"{item.body}"</p>
                    <button
                      onClick={() => handleCopy(item.id, item.body)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 text-[#A09D97] hover:text-white transition cursor-pointer shrink-0"
                    >
                      {copiedId === item.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "emails" && emails.map((item, idx) => (
            <div key={item.id} className="rounded-3xl border border-white/10 bg-[#171717] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#5A5755] uppercase tracking-wider">E-mail {idx + 1}</span>
                  <h4 className="font-toolkit font-bold text-white mt-0.5">Assunto: {item.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`h-6 px-2.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                    item.pronomesOk 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {item.pronomesOk ? "Pronomes: Você OK" : "Alerta de Pronomes"}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#F0EDE6]/90 whitespace-pre-line leading-relaxed font-sans p-4 rounded-2xl bg-[#1F1F1F]/60 border border-white/5">
                {item.body}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(item.id, `Assunto: ${item.title}\n\n${item.body}`)}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar E-mail Completo
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}
