"use client"

import { useState } from "react"
import { 
  Zap, Sparkles, Search, Check, AlertCircle, ArrowRight, Shield, 
  MessageSquare, DollarSign, PenTool, Layout, Share2, 
  Target, Award, BookOpen, Mail, FileText, HelpCircle, Video
} from "lucide-react"
import { PagamentoStripe } from "@/components/sextou-tools-pro/pagamento-stripe"
import Link from "next/link"

interface AcessoPremiumClientProps {
  user: {
    fullName: string
    businessName: string
    hasActiveAds: boolean
    isPremium: boolean
  }
}

const PREMIUM_APPS = [
  {
    slug: "storybrand-strategy-generator",
    title: "Estratégia StoryBrand (SB7)",
    description: "Crie BrandScripts, One-liners e wireframes de conversão baseados no método de Donald Miller.",
    category: "strategy",
    icon: Layout,
    color: "from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30",
    iconColor: "text-blue-500",
  },
  {
    slug: "youtube-growth-studio",
    title: "YouTube Growth Studio AI",
    description: "Planeje canais, gere roteiros de alta retenção, títulos e SEO para dominar seu nicho.",
    category: "content",
    icon: YoutubeIcon,
    color: "from-red-500/10 to-pink-500/10 hover:border-red-500/30",
    iconColor: "text-red-500",
  },
  {
    slug: "social-network-studio",
    title: "EasySocial - Network Studio",
    description: "Crie campanhas e copys baseadas nos 42 ensinamentos de copy de resposta direta.",
    category: "sales",
    icon: Sparkles,
    color: "from-orange-500/10 to-amber-500/10 hover:border-orange-500/30",
    iconColor: "text-orange-500",
  },
  {
    slug: "zapleads",
    title: "ZapLeads CRM & Extrator",
    description: "Extraia contatos de grupos e crie um funil Kanban integrado ao WhatsApp.",
    category: "sales",
    icon: Share2,
    color: "from-emerald-500/10 to-green-500/10 hover:border-emerald-500/30",
    iconColor: "text-emerald-500",
  },
  {
    slug: "business-diagnosis",
    title: "Diagnóstico Express",
    description: "Identifique gargalos do seu negócio e obtenha um plano de ação prioritário de 7 dias.",
    category: "strategy",
    icon: Target,
    color: "from-cyan-500/10 to-teal-500/10 hover:border-cyan-500/30",
    iconColor: "text-cyan-500",
  },
  {
    slug: "local-ads",
    title: "Gerador de Anúncios Locais",
    description: "Gere copys de alta conversão para Meta Ads, Google Ads e até panfletos físicos.",
    category: "sales",
    icon: MegaphoneIcon,
    color: "from-rose-500/10 to-pink-500/10 hover:border-rose-500/30",
    iconColor: "text-rose-500",
  },
  {
    slug: "service-pricing",
    title: "Precificador de Serviços",
    description: "Calcule faixas de preço seguras de serviços baseados em custos, margens e valor comercial.",
    category: "strategy",
    icon: DollarSign,
    color: "from-yellow-500/10 to-amber-500/10 hover:border-yellow-500/30",
    iconColor: "text-yellow-500",
  },
  {
    slug: "proposta-comercial-one-page",
    title: "Proposta Comercial One-Page",
    description: "Crie propostas rápidas, objetivas e prontas para fechar negócios pelo WhatsApp.",
    category: "sales",
    icon: FileText,
    color: "from-purple-500/10 to-violet-500/10 hover:border-purple-500/30",
    iconColor: "text-purple-500",
  },
  {
    slug: "roteiro-reels-shorts-30s",
    title: "Roteiros de Reels & Shorts",
    description: "Ganchos e roteiros reativos de 30 segundos estruturados para gravação mobile rápida.",
    category: "content",
    icon: Video,
    color: "from-fuchsia-500/10 to-pink-500/10 hover:border-fuchsia-500/30",
    iconColor: "text-fuchsia-500",
  },
  {
    slug: "respostas-prontas-whatsapp",
    title: "Respostas Rápidas WhatsApp",
    description: "Templates rápidos para contorno de objeções, envio de preços e fechamentos práticos.",
    category: "communication",
    icon: MessageSquare,
    color: "from-green-500/10 to-emerald-500/10 hover:border-green-500/30",
    iconColor: "text-green-500",
  },
  {
    slug: "follow-up-5-messages",
    title: "Follow-up Comercial 5 Etapas",
    description: "Retome conversas comerciais frias sem ser chato ou soar insistente.",
    category: "communication",
    icon: ArrowRight,
    color: "from-indigo-500/10 to-blue-500/10 hover:border-indigo-500/30",
    iconColor: "text-indigo-500",
  },
  {
    slug: "local-partnerships",
    title: "Parcerias Locais",
    description: "Ideias e abordagens práticas de parcerias com outros negócios da sua região.",
    category: "strategy",
    icon: Award,
    color: "from-orange-500/10 to-red-500/10 hover:border-orange-500/30",
    iconColor: "text-orange-500",
  },
  {
    slug: "creative-brief",
    title: "Briefing Criativo Express",
    description: "Briefing direto e estruturado para designers, agências ou criadores de conteúdo.",
    category: "communication",
    icon: PenTool,
    color: "from-sky-500/10 to-blue-500/10 hover:border-sky-500/30",
    iconColor: "text-sky-500",
  },
  {
    slug: "gerador-oferta-irresistivel",
    title: "Gerador de Ofertas",
    description: "Empacote seus serviços de forma irresistível com bônus e escassez estruturada.",
    category: "sales",
    icon: Zap,
    color: "from-amber-500/10 to-orange-500/10 hover:border-amber-500/30",
    iconColor: "text-amber-500",
  },
  {
    slug: "calendario-conteudo-7-dias",
    title: "Calendário de 7 Dias",
    description: "Ideias e posts completos com imagem recomendada e legenda persuasiva para a semana.",
    category: "content",
    icon: Layout,
    color: "from-pink-500/10 to-rose-500/10 hover:border-pink-500/30",
    iconColor: "text-pink-500",
  },
  {
    slug: "pitch-30-seconds",
    title: "Pitch Comercial de 30s",
    description: "Gere um discurso rápido e inesquecível para reuniões de negócios ou networking.",
    category: "communication",
    icon: Target,
    color: "from-teal-500/10 to-emerald-500/10 hover:border-teal-500/30",
    iconColor: "text-teal-500",
  },
  {
    slug: "professional-bio",
    title: "Bio Otimizada Pro",
    description: "Gere bios de alto impacto para Instagram, TikTok e LinkedIn focadas em agendamento.",
    category: "communication",
    icon: FileText,
    color: "from-violet-500/10 to-purple-500/10 hover:border-violet-500/30",
    iconColor: "text-violet-500",
  },
  {
    slug: "faq-objections",
    title: "Matriz de Perguntas & Objeções",
    description: "Crie uma lista de dúvidas frequentes com quebras lógicas e persuasivas de objeção.",
    category: "communication",
    icon: HelpCircle,
    color: "from-blue-500/10 to-cyan-500/10 hover:border-blue-500/30",
    iconColor: "text-blue-500",
  },
  {
    slug: "ebook-creator",
    title: "Gerador de E-books",
    description: "Crie sumários, capítulos e roteiros estruturados de e-books de posicionamento.",
    category: "content",
    icon: BookOpen,
    color: "from-violet-500/10 to-fuchsia-500/10 hover:border-violet-500/30",
    iconColor: "text-violet-500",
  },
  {
    slug: "email-marketing-generator",
    title: "Campanhas de E-mail & Newsletters",
    description: "Gere sequências de vendas e boletins informativos prontos para alta conversão.",
    category: "content",
    icon: Mail,
    color: "from-rose-500/10 to-orange-500/10 hover:border-rose-500/30",
    iconColor: "text-rose-500",
  }
]

// Custom Lucide wrapper for Megaphone which is not exported under standard names sometimes
function MegaphoneIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 11 18-5v12L3 13v-2Z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  )
}

function YoutubeIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

const CATEGORIES = [
  { id: "all", label: "Todos os Apps" },
  { id: "sales", label: "Vendas & Ofertas" },
  { id: "content", label: "Conteúdo & Redes" },
  { id: "strategy", label: "Estratégia & Diagnóstico" },
  { id: "communication", label: "Comunicação & DMs" },
]

export function AcessoPremiumClient({ user }: AcessoPremiumClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredApps = PREMIUM_APPS.filter((app) => {
    const matchesSearch = 
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || app.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const alreadyHasAccess = user.hasActiveAds || user.isPremium

  return (
    <div className="space-y-16">
      {/* HEADER HERO */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-[#FF3D57]/10 to-[#FF8C00]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF8C00]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#FF8C00]">
          <Sparkles className="h-4 w-4" /> SextouTools Premium
        </div>
        
        <h1 className="font-toolkit text-5xl font-extrabold tracking-[-0.03em] text-[#F0EDE6] md:text-7xl leading-tight">
          A Suite Completa para o seu <br />
          <span className="bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] bg-clip-text text-transparent">
            Negócio Faturar Mais
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-[#A09D97] max-w-3xl mx-auto leading-relaxed">
          Libere acesso imediato a **20 ferramentas premium** calibradas com Inteligência Artificial avançada. Crie ofertas, roteiros, estratégias completas e feche mais negócios.
        </p>

        {alreadyHasAccess && (
          <div className="max-w-md mx-auto p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400 flex items-center justify-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>Você já tem acesso premium! <strong><Link href="/sextou-tools-pro/dashboard" className="underline hover:text-emerald-300">Ir para o Dashboard</Link></strong></span>
          </div>
        )}
      </div>

      {/* PRICING AND VALUE PROP GRID */}
      <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto items-stretch">
        {/* CHECKOUT CARD */}
        <div className="lg:col-span-5 bg-[#171717] rounded-[28px] border border-white/10 p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF3D57]/10 to-[#FF8C00]/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] flex items-center justify-center text-white shadow-lg shadow-[#FF3D57]/20">
              <Zap className="h-6 w-6 fill-current" />
            </div>

            <div className="space-y-2">
              <h3 className="font-toolkit text-3xl font-extrabold text-white">
                Pacote PRO Premium
              </h3>
              <p className="text-sm text-[#A09D97] leading-relaxed">
                Desbloqueie o potencial completo de crescimento com todas as 20 ferramentas habilitadas sem limites de uso.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-[#F0EDE6]/90">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                <span>Acesso ilimitado a todos os 20 mini-apps</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#F0EDE6]/90">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                <span>Motor de IA avançado (Claude 3.5 & GPT-4o)</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#F0EDE6]/90">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                <span>Exportação em múltiplos formatos (MD, CSV, Word)</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#F0EDE6]/90">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                <span>Atualizações semanais inclusas</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-[#A09D97] uppercase">Upgrade Premium</span>
                <span className="text-4xl font-extrabold text-white">U$ 19</span>
                <span className="text-sm text-[#A09D97]">/mês</span>
              </div>
              <p className="text-[11px] text-[#A09D97]">
                Disponível para anunciantes ativos na Vitrine (U$ 30 pelo anúncio + U$ 19 pelos apps premium).
              </p>
            </div>
            
            <PagamentoStripe
              planSlug="pro"
              label="Destravar Suite Premium Agora"
              className="w-full inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-bold text-white shadow-lg shadow-[#FF3D57]/20 transition hover:opacity-95 cursor-pointer"
            />
            
            <p className="text-[11px] text-[#5A5755] text-center flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3" /> Pagamento seguro e criptografado via Stripe
            </p>
          </div>
        </div>

        {/* COORDENATED VALUES */}
        <div className="lg:col-span-7 bg-[#171717] rounded-[28px] border border-white/10 p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-toolkit text-2xl font-bold text-white">
              Por que assinar o Premium?
            </h3>
            <p className="text-sm text-[#A09D97]">
              Se você contratasse profissionais independentes ou assinasse softwares isolados para cada uma dessas funções, seu custo mensal superaria milhares de reais.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">1</div>
              <h4 className="text-sm font-semibold text-white">Foco em Resultado</h4>
              <p className="text-xs text-[#A09D97] leading-relaxed">
                Chega de gerar textos longos e genéricos. Nossos prompts e modelos foram criados para vender serviços locais e produtos.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">2</div>
              <h4 className="text-sm font-semibold text-white">Exportação Prática</h4>
              <p className="text-xs text-[#A09D97] leading-relaxed">
                Baixe seus cronogramas, copies e diagnósticos com um clique. Integre com seu Notion, Trello ou envie direto no WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">3</div>
              <h4 className="text-sm font-semibold text-white">Interface Unificada</h4>
              <p className="text-xs text-[#A09D97] leading-relaxed">
                Toda a sua operação de marketing, copywriting e vendas estruturada na mesma interface limpa, rápida e sem complicação.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">4</div>
              <h4 className="text-sm font-semibold text-white">Inteligência Gated RLS</h4>
              <p className="text-xs text-[#A09D97] leading-relaxed">
                Seus dados, campanhas e diagnósticos são estritamente privados e protegidos por políticas de segurança.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span><strong>Regra de Acesso:</strong> Usuários comuns acessam o pacote gratuito. Anunciantes da vitrine (U$ 30/mês) liberam a suite PRO. Assinantes Premium (U$ 30 do anúncio + U$ 19 dos apps premium) ganham acesso total a todas as ferramentas com IA avançada.</span>
          </div>
        </div>
      </div>

      {/* THE 20 APPS CATALOG LISTING */}
      <div className="space-y-8 pt-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-toolkit text-3xl font-extrabold text-white">
              Conheça as 20 ferramentas inclusas
            </h2>
            <p className="text-sm text-[#A09D97]">
              Explore a suite completa de ferramentas e encontre exatamente o que precisa para a sua rotina comercial.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A5755]" />
            <input
              type="text"
              placeholder="Buscar ferramenta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm text-[#F0EDE6] placeholder-[#5A5755] focus:outline-none focus:border-[#FF3D57]/50"
            />
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 border-b border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-white"
                  : "border border-white/10 bg-white/5 text-[#A09D97] hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* TOOLS GRID */}
        {filteredApps.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredApps.map((app) => {
              const IconComp = app.icon
              return (
                <div 
                  key={app.slug} 
                  className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${app.color} p-6 space-y-4 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center ${app.iconColor}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-toolkit font-bold text-white group-hover:text-[#FF8C00] transition">
                        {app.title}
                      </h4>
                      <p className="text-xs text-[#A09D97] mt-1.5 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-[#5A5755]">
                    <span className="uppercase tracking-wider">
                      {CATEGORIES.find(c => c.id === app.category)?.label || app.category}
                    </span>
                    <span className="text-[#FF3D57] group-hover:translate-x-1 transition flex items-center gap-1">
                      PRO <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl text-[#5A5755] space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p className="text-sm font-semibold">Nenhuma ferramenta encontrada para a busca.</p>
          </div>
        )}
      </div>

      {/* FAQ SECTION */}
      <div className="pt-16 border-t border-white/5 space-y-8 max-w-4xl mx-auto">
        <h3 className="font-toolkit text-3xl font-extrabold text-white text-center">
          Dúvidas Frequentes
        </h3>
        
        <div className="grid gap-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#171717]/50 space-y-2">
            <h4 className="font-bold text-white text-sm">Como funciona a ativação automática via anúncios?</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              Ao publicar e manter um anúncio aprovado e ativo em nossa plataforma comercial de anúncios locais, a sua conta recebe uma tag que abre todo o pacote SextouTools PRO sem cobranças mensais enquanto o anúncio seguir ativo.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-[#171717]/50 space-y-2">
            <h4 className="font-bold text-white text-sm">Qual o limite de uso diário/mensal?</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              No plano PRO Premium, você tem uso livre dos modelos de inteligência artificial contratados (incluindo o motor avançado Claude e GPT) para criar roteiros, copys e estratégias. Monitoramos abusos sistemáticos por APIs para garantir estabilidade, mas não há limite para a rotina diária comercial.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-[#171717]/50 space-y-2">
            <h4 className="font-bold text-white text-sm">Posso cancelar a assinatura quando quiser?</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              Sim! O faturamento é processado diretamente pelo Stripe de forma recorrente e você pode cancelar com um clique na área de perfil/faturamento da sua conta a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
