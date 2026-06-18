"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createChannel, deleteChannel } from "./actions"
import { Plus, Trash2, ExternalLink, Sparkles, Loader2, Video } from "lucide-react"

interface ChannelWithPlans {
  id: string
  channelName: string
  niche: string
  city: string | null
  primaryOffer: string | null
  updatedAt: Date
  contentPlans: { id: string; status: string }[]
}

const NICHES = [
  "Contabilidade",
  "Imobiliário",
  "Educação",
  "Restaurante",
  "Serviços gerais",
  "Saúde/Estética",
  "Direito imigratório",
  "Coaching",
  "E-commerce",
  "Igreja/ministério",
  "Outros"
]

export function YoutubeGrowthDashboardClient({
  initialChannels
}: {
  initialChannels: ChannelWithPlans[]
}) {
  const router = useRouter()
  const [channels, setChannels] = useState<ChannelWithPlans[]>(initialChannels)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  // Form states
  const [channelName, setChannelName] = useState("")
  const [niche, setNiche] = useState(NICHES[0])
  const [city, setCity] = useState("")
  const [primaryOffer, setPrimaryOffer] = useState("")
  const [error, setError] = useState("")

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await createChannel({ channelName, niche, city, primaryOffer })
      router.push(`/sextou-tools-pro/youtube-growth-studio/${result.id}/setup`)
    } catch (err: any) {
      setError(err.message || "Erro ao criar canal")
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este canal e todos os seus planos gerados? Esta ação é irreversível.")) return
    setActionLoadingId(id)
    try {
      await deleteChannel(id)
      setChannels(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert("Erro ao excluir o canal")
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FF3D57]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FF3D57]">
            <Sparkles className="h-3.5 w-3.5" /> Suite Premium
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-[#F0EDE6] md:text-5xl flex items-center gap-3">
            <Video className="h-10 w-10 text-[#FF3D57]" /> YouTube Growth Studio
          </h1>
          <p className="mt-2 text-sm text-[#A09D97] max-w-2xl leading-relaxed">
            Transforme seu canal do YouTube em um ativo de negócio. Planeje calendários editoriais, roteiros de vídeos, copys de SEO e redes sociais focados em construir autoridade e vendas nos EUA.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-grad inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-bold text-white shadow-lg transition hover:opacity-95 h-[54px] min-w-[180px]"
        >
          <Plus className="h-5 w-5" /> Adicionar Canal
        </button>
      </div>

      {/* COACH TIP */}
      <div className="coach flex gap-4 items-start rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.06),rgba(255,140,0,0.06))] p-5">
        <span className="text-xl">💡</span>
        <p className="text-sm text-[#F0EDE6]/90 leading-relaxed">
          <b>Vídeo inteligente vende mais:</b> Empreendedores brasileiros nos EUA crescem no YouTube ao focar em responder às dúvidas reais do público local. Em vez de posts soltos, organize seu canal com calendários de 30 dias com vídeos, Shorts, legendas e briefings de thumbnail.
        </p>
      </div>

      {/* CONTEÚDO */}
      {channels.length === 0 ? (
        <div className="empty rounded-2xl border-2 border-dashed border-white/10 bg-[#171717]/30 p-12 text-center max-w-2xl mx-auto mt-8">
          <div className="empty-emoji text-5xl mb-4">🎬</div>
          <h3 className="font-display text-lg font-bold text-[#F0EDE6] mb-2">Nenhum canal cadastrado</h3>
          <p className="empty-text text-sm text-[#A09D97] max-w-md mx-auto mb-6 leading-relaxed">
            Cadastre o seu canal de negócios para começarmos a criar roteiros e planejamentos mensais de vídeo otimizados por IA.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-grad inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
          >
            Adicionar Meu Primeiro Canal
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="rounded-2xl border border-white/10 bg-[#171717] p-6 flex flex-col justify-between hover:border-white/20 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="ct-badge px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF3D57]/10 text-[#FF3D57]">
                    {channel.niche}
                  </span>
                  <span className="font-mono text-xs text-[#5A5755]">
                    {channel.contentPlans.length} plano(s)
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#F0EDE6] group-hover:text-white transition">
                  {channel.channelName}
                </h3>
                <p className="mt-2 text-xs text-[#5A5755] uppercase tracking-wider font-semibold">Oferta Principal:</p>
                <p className="text-sm text-[#A09D97] line-clamp-2 mt-0.5">
                  {channel.primaryOffer}
                </p>
                {channel.city && (
                  <p className="text-xs text-[#A09D97] mt-2 font-mono">
                    Local: {channel.city}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => router.push(`/sextou-tools-pro/youtube-growth-studio/${channel.id}/setup`)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 text-xs font-bold text-[#F0EDE6] transition"
                >
                  Planejar Canal <ExternalLink className="h-3.5 w-3.5" />
                </button>

                <button
                  disabled={actionLoadingId !== null}
                  onClick={() => handleDelete(channel.id)}
                  title="Excluir canal"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-red/10 text-[#A09D97] hover:text-red-500 transition disabled:opacity-55"
                >
                  {actionLoadingId === channel.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-filter backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#171717] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="font-display text-2xl font-bold text-[#F0EDE6] mb-1">
              Adicionar Canal
            </h2>
            <p className="text-xs text-[#A09D97] mb-6">
              Insira as informações de posicionamento do canal do seu negócio.
            </p>

            <form onSubmit={handleCreateChannel} className="space-y-5">
              <div className="field">
                <label>Nome do Canal / Negócio</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Diário de Orlando, Padaria USA"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl p-3 text-sm outline-none focus:border-[#FF3D57] transition"
                />
              </div>

              <div className="field">
                <label>Nicho do Canal</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl p-3 text-sm outline-none focus:border-[#FF3D57] transition cursor-pointer"
                >
                  {NICHES.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Cidade / Localidade nos EUA (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Orlando, Boston, Newark"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl p-3 text-sm outline-none focus:border-[#FF3D57] transition"
                />
              </div>

              <div className="field">
                <label>Oferta Principal do seu Negócio</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Contabilidade para Imigrantes, Venda de Imóveis"
                  value={primaryOffer}
                  onChange={(e) => setPrimaryOffer(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl p-3 text-sm outline-none focus:border-[#FF3D57] transition"
                />
              </div>

              {error && (
                <div className="friendly-error bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-500">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="btn-ghost px-4 h-12 rounded-xl text-sm font-semibold transition hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-grad inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 h-12 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-55"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Adicionando...
                    </>
                  ) : (
                    "Prosseguir →"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
