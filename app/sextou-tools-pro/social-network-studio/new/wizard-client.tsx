"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveSocialNetworkWizard } from "../actions"
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Lightbulb, ShieldAlert, Target, Eye, Zap } from "lucide-react"

interface WizardStep {
  id: number
  title: string
  subtitle: string
  fieldName?: string
  placeholder?: string
  coachTip: string
  example: string
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 0,
    title: "Alinhamento de Expectativas",
    subtitle: "A dura realidade do empreendedor digital",
    coachTip: "O primeiro dinheiro que você ganhar no online será o mais difícil de todos. Não procure criar planos mirabolantes agora. O importante é planejar menos e concretizar mais rápido.",
    example: "Clique em Avançar para começarmos a estruturar seu terreno."
  },
  {
    id: 1,
    title: "Mapeamento do Terreno",
    subtitle: "Qual o seu projeto, público e proposta?",
    coachTip: "Seja cirúrgico sobre quem você deseja atingir. Definir bem seu projeto e nicho ajuda a calibrar a Inteligência Artificial para gerar copies menos genéricas.",
    example: "Definiremos o nome do projeto, seu público-alvo exato e a ideia básica do produto."
  },
  {
    id: 2,
    title: "Qual a Dor Principal?",
    subtitle: "O que tira o sono do seu cliente?",
    fieldName: "dorPrincipal",
    placeholder: "Ex: Posto conteúdos todos os dias nas redes sociais mas não consigo agendar nenhuma chamada de vendas no WhatsApp.",
    coachTip: "A dor principal deve provocar uma reação física e emocional no seu cliente. Pense no problema prático que ele tenta esconder no dia a dia.",
    example: "Exemplo: Falta de clientes recorrentes, medo de falir a empresa local nos próximos 3 meses, etc."
  },
  {
    id: 3,
    title: "O Medo Profundo",
    subtitle: "O que acontece se ele não resolver isso?",
    fieldName: "medo",
    placeholder: "Ex: Medo de ter que fechar o negócio local e voltar a trabalhar como funcionário CLT ganhando um salário mínimo.",
    coachTip: "As pessoas compram para se afastar da dor e do medo. O medo é o motivador invisível de quase toda compra de alto valor.",
    example: "Exemplo: Medo de ser copiado pela concorrência, medo de perder o prestígio da família, etc."
  },
  {
    id: 4,
    title: "O Sonho de Consumo",
    subtitle: "Qual o resultado desejado ou transformação?",
    fieldName: "sonho",
    placeholder: "Ex: Ter uma agenda cheia de clientes qualificados toda semana de forma previsível e faturar R$ 15k por mês.",
    coachTip: "O sonho é o destino final. Venda o resultado da transformação, não o processo chato para chegar até lá.",
    example: "Exemplo: Tempo livre com a família, autonomia financeira, reconhecimento profissional."
  },
  {
    id: 5,
    title: "A Solução Comercial",
    subtitle: "Como o seu produto ou serviço age como antídoto?",
    fieldName: "solucao",
    placeholder: "Ex: Método de Atração Local Pro - uma mentoria individual de 4 semanas onde configuramos o funil de WhatsApp do seu negócio.",
    coachTip: "Apresente sua solução de maneira óbvia e simples. Use uma linguagem que até uma criança de 10 anos entenda.",
    example: "Exemplo: Nosso serviço de limpeza profunda em 3 etapas que elimina o mofo sem cheiro forte."
  },
  {
    id: 6,
    title: "A Promessa 11 Estrelas",
    subtitle: "Qual ganho crível você pode garantir no curto prazo?",
    fieldName: "promessa",
    placeholder: "Ex: Colocar sua primeira campanha no ar e atrair os primeiros 10 leads qualificados em até 14 dias ou devolvemos seu dinheiro.",
    coachTip: "Cuidado com promessas ridículas ou absurdas. Uma boa promessa deve ser forte o suficiente para atrair e realista para ser crível.",
    example: "Exemplo: Dobre a velocidade de atendimento do seu WhatsApp em 7 dias com nosso hub."
  },
  {
    id: 7,
    title: "A Prova Social de Conexão",
    subtitle: "Por que ele deveria confiar em você?",
    fieldName: "provaSocial",
    placeholder: "Ex: Mais de 142 empreendedores locais mentorados no último ano com 98% de satisfação e aumento médio de faturamento.",
    coachTip: "A melhor forma de quebrar qualquer objeção é com a prova social. Traga números reais, depoimentos curtos ou tempo de atuação.",
    example: "Exemplo: 'Graças ao método, consegui agendar 5 reuniões na primeira semana' - João Silva."
  },
  {
    id: 8,
    title: "A Escassez e FOMO",
    subtitle: "Por que ele deve agir agora e não depois?",
    fieldName: "escassez",
    placeholder: "Ex: Limitado a apenas 5 vagas por mês para garantir acompanhamento individual e entrega premium do serviço.",
    coachTip: "As pessoas procrastinam a decisão de compra. Mostre o que elas perdem hoje caso decidam adiar (bônus exclusivos, limite de vagas ou reajuste de preço).",
    example: "Exemplo: O lote promocional encerra nesta sexta-feira às 23:59pm."
  }
]

export function SocialNetworkWizardClient() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  // Dados do Mapeamento do Terreno (Passo 1)
  const [projectName, setProjectName] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [basicIdea, setBasicIdea] = useState("")

  // Dados do Canvas da Oferta 11 Estrelas (Passos 2 a 8)
  const [canvasData, setCanvasData] = useState<Record<string, string>>({
    dorPrincipal: "",
    medo: "",
    sonho: "",
    solucao: "",
    promessa: "",
    provaSocial: "",
    escassez: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const stepInfo = WIZARD_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === WIZARD_STEPS.length - 1

  const handleNext = () => {
    setError("")
    if (currentStep === 1) {
      if (!projectName.trim() || !targetAudience.trim() || !basicIdea.trim()) {
        setError("Todos os campos do mapeamento são obrigatórios para prosseguir.")
        return
      }
    } else if (currentStep > 1) {
      const field = stepInfo.fieldName
      if (field && !canvasData[field]?.trim()) {
        setError("Por favor, preencha este campo antes de avançar.")
        return
      }
    }
    
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setError("")
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFieldChange = (field: string, val: string) => {
    setError("")
    setCanvasData(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async () => {
    setError("")
    // Validação final de segurança
    const lastField = stepInfo.fieldName
    if (lastField && !canvasData[lastField]?.trim()) {
      setError("Por favor, preencha a escassez antes de concluir.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await saveSocialNetworkWizard({
        projectName,
        targetAudience,
        basicIdea,
        dorPrincipal: canvasData.dorPrincipal,
        medo: canvasData.medo,
        sonho: canvasData.sonho,
        promessa: canvasData.promessa,
        provaSocial: canvasData.provaSocial,
        escassez: canvasData.escassez
      })

      // Direciona para o gerador de copies/campanhas (Story 4)
      router.push(`/sextou-tools-pro/social-network-studio/${result.campaignId}/result`)
    } catch (err: any) {
      setError(err.message || "Erro ao salvar o formulário do Canvas.")
      setIsSubmitting(false)
    }
  }

  // Agrupamento visual das fases
  const getActivePhase = () => {
    if (currentStep === 0) return 0 // Alinhamento
    if (currentStep === 1) return 1 // Terreno
    if (currentStep <= 4) return 2  // Dores e Desejos
    return 3                        // Oferta Irresistível
  }

  const activePhase = getActivePhase()

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* HEADER DA PÁGINA */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="font-toolkit text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF8C00]" /> Canvas da Oferta 11 Estrelas
          </h1>
          <p className="text-xs text-[#A09D97] mt-0.5">Construa copies baseadas em psicologia de resposta direta</p>
        </div>
      </div>

      {/* INDICADOR DE FASES */}
      <div className="rounded-2xl bg-[#171717] p-5 border border-white/5">
        <div className="flex items-center justify-between w-full">
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 0 ? "text-[#FF8C00]" : "text-[#5A5755]"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${activePhase >= 0 ? "bg-[#FF8C00] text-white" : "bg-white/5 border border-white/10"}`}>1</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider">Aviso</div>
          </div>
          <div className="h-[1px] bg-white/10 flex-1 mx-2"></div>
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 1 ? "text-[#FF8C00]" : "text-[#5A5755]"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${activePhase >= 1 ? "bg-[#FF8C00] text-white" : "bg-white/5 border border-white/10"}`}>2</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider">Terreno</div>
          </div>
          <div className="h-[1px] bg-white/10 flex-1 mx-2"></div>
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 2 ? "text-[#FF8C00]" : "text-[#5A5755]"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${activePhase >= 2 ? "bg-[#FF8C00] text-white" : "bg-white/5 border border-white/10"}`}>3</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider">Dores</div>
          </div>
          <div className="h-[1px] bg-white/10 flex-1 mx-2"></div>
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 3 ? "text-[#FF8C00]" : "text-[#5A5755]"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${activePhase >= 3 ? "bg-[#FF8C00] text-white" : "bg-white/5 border border-white/10"}`}>4</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider">Oferta</div>
          </div>
        </div>
      </div>

      {/* CARD DE CONTEÚDO DO PASSO */}
      <div className="rounded-3xl border border-white/10 bg-[#171717] p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF3D57]/5 to-[#FF8C00]/5 rounded-full blur-xl pointer-events-none" />
        
        <div>
          <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-wider">
            Etapa {currentStep + 1} de {WIZARD_STEPS.length} · {stepInfo.subtitle}
          </span>
          <h3 className="font-toolkit text-3xl font-extrabold text-white mt-1">
            {stepInfo.title}
          </h3>
        </div>

        {/* RENDERIZAÇÃO DINÂMICA DO FORMULÁRIO */}
        {currentStep === 0 && (
          <div className="rounded-2xl border border-white/5 bg-[#1F1F1F] p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Instrução de Vendas</h4>
            <p className="text-sm text-[#A09D97] leading-relaxed">
              De acordo com os ensinamentos práticos de Ícaro de Carvalho, planejar não pode ser mais prazeroso do que concretizar. Não gaste semanas desenhando estratégias antes de ter um produto testável no mercado.
            </p>
            <p className="text-sm text-[#A09D97] leading-relaxed">
              O objetivo deste Wizard é estruturar uma campanha rápida baseada na **psicologia do cliente**. Sem frescuras, focado puramente em gerar copies de conversão direta.
            </p>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="field space-y-1">
              <label className="text-xs text-[#A09D97] uppercase tracking-wider font-semibold block">Nome do Projeto / Negócio</label>
              <input
                type="text"
                placeholder="Ex: Mentoria Digital Pro"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-12 rounded-xl bg-[#1F1F1F] text-white border border-white/10 px-4 focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
            <div className="field space-y-1">
              <label className="text-xs text-[#A09D97] uppercase tracking-wider font-semibold block">Público-Alvo / Persona</label>
              <input
                type="text"
                placeholder="Ex: Empreendedores de serviços locais com dificuldade em atrair leads"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full h-12 rounded-xl bg-[#1F1F1F] text-white border border-white/10 px-4 focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
            <div className="field space-y-1">
              <label className="text-xs text-[#A09D97] uppercase tracking-wider font-semibold block">Ideia Básica do Produto</label>
              <textarea
                rows={3}
                placeholder="Ex: Uma mentoria online de 30 dias que estrutura a atração de leads locais usando anúncios simples no Instagram."
                value={basicIdea}
                onChange={(e) => setBasicIdea(e.target.value)}
                className="w-full rounded-xl bg-[#1F1F1F] text-white border border-white/10 p-3 focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
          </div>
        )}

        {currentStep > 1 && stepInfo.fieldName && (
          <div className="field space-y-2">
            <label className="text-xs text-[#A09D97] uppercase tracking-wider font-semibold block">
              Sua Resposta:
            </label>
            <textarea
              rows={4}
              placeholder={stepInfo.placeholder}
              value={canvasData[stepInfo.fieldName] || ""}
              onChange={(e) => handleFieldChange(stepInfo.fieldName!, e.target.value)}
              className="w-full rounded-xl bg-[#1F1F1F] text-white border border-white/10 p-4 focus:outline-none focus:border-[#FF8C00] text-sm leading-relaxed"
            />
          </div>
        )}

        {/* DIRETRIZ DIDÁTICA DO COACH (LUCIDE LIGHTBULB) */}
        <div className="flex gap-3 items-start bg-orange-500/5 p-4 rounded-2xl border border-orange-500/15">
          <Lightbulb className="h-5 w-5 text-[#FF8C00] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-white font-bold">Instrução do Copywriter</p>
            <p className="text-xs text-[#A09D97] leading-relaxed">{stepInfo.coachTip}</p>
          </div>
        </div>

        {/* EXEMPLO PRÁTICO */}
        <div className="flex gap-2.5 items-start bg-white/5 p-4 rounded-2xl border border-white/5 text-xs text-[#A09D97]">
          <Eye className="h-4.5 w-4.5 text-[#5A5755] shrink-0" />
          <p className="leading-relaxed"><strong>Dica / Exemplo:</strong> {stepInfo.example}</p>
        </div>

        {/* MENSAGEM DE ERRO */}
        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* BOTÕES DE CONTROLE */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
          className="h-12 px-5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Voltar
        </button>

        {!isLastStep ? (
          <button
            onClick={handleNext}
            className="inline-flex h-12 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-bold text-white shadow-lg transition hover:opacity-95 cursor-pointer"
          >
            Avançar <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-55 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Gerar Minhas Copies PRO <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
