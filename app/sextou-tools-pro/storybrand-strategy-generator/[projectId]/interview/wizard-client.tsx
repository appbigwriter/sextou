"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveInterviewAnswers } from "../../actions"
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Lightbulb } from "lucide-react"

interface QuestionStep {
  element: string
  question: string
  suggestion: string
  input_type: "text" | "select" | "multiselect"
  options?: string[]
}

const COACH_TIPS: Record<string, string> = {
  hero: "O cliente ideal é o verdadeiro herói. Identifique o desejo essencial dele relacionado ao seu produto/serviço.",
  problem_external: "O problema externo é a barreira física ou tangível. O que quebrou ou precisa ser resolvido no dia a dia?",
  problem_internal: "Como o seu herói se sente devido ao problema? (frustrado, sobrecarregado, com medo, inseguro, com vergonha).",
  problem_philosophical: "Por que é injusto que ele passe por isso? O que não deveria ser aceitável de forma alguma?",
  villain: "Quem ou o que personifica todos estes problemas? Dar nome a um 'vilão' ajuda a dar foco e energia à mensagem.",
  empathy: "Demonstre empatia verdadeira. Uma frase acolhedora mostrando que você entende o sentimento do cliente.",
  authority: "Mostre que você é competente para guiar o herói. Insira depoimentos, anos de experiência, prêmios ou números.",
  plan_process: "Escreva 3 passos simples que o cliente deve tomar para comprar/usar seu produto (Ex: 1. Escolha o plano, 2. Faça o alinhamento, 3. Aproveite).",
  plan_agreement: "Quais garantias ou acordos você oferece para demover objeções e medos? (Ex: Sem multas, satisfação garantida).",
  cta_direct: "Faça o pedido de compra sem timidez. Exemplos: Agende uma consulta, Compre agora, Contrate hoje.",
  cta_transitional: "Ofereça uma isca de baixo risco para construir relacionamento (Ex: Baixe nosso checklist, Receba um diagnóstico).",
  stakes: "O que o cliente perde se não agir? O custo real da inação (Ex: continuar perdendo dinheiro, estresse acumulado).",
  success: "Como a vida dele se transforma? Qual é o final feliz concreto e quem ele se torna (nova identidade)."
}

export function StoryBrandInterviewWizard({
  projectId,
  questions,
  initialAnswers
}: {
  projectId: string
  questions: QuestionStep[]
  initialAnswers: Record<string, string>
}) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const defaultAnswers: Record<string, string> = {}
    questions.forEach(q => {
      defaultAnswers[q.element] = initialAnswers[q.element] || q.suggestion || ""
    })
    return defaultAnswers
  })

  // Configurações finais
  const [tone, setTone] = useState("direto")
  const [language, setLanguage] = useState("pt-BR")
  const [channels, setChannels] = useState<string[]>(["site", "WhatsApp"])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const stepsCount = questions.length // 13 passos do SB7
  const isLastQuestionStep = currentStep === stepsCount - 1
  const isReviewStep = currentStep === stepsCount

  const handleNext = () => {
    if (currentStep < stepsCount) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleInputChange = (element: string, val: string) => {
    setAnswers(prev => ({ ...prev, [element]: val }))
  }

  const handleChannelToggle = (ch: string) => {
    setChannels(prev =>
      prev.includes(ch) ? prev.filter(item => item !== ch) : [...prev, ch]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await saveInterviewAnswers(projectId, answers, { tone, language, channels })
      // Redireciona para o orquestrador de geração (Story 5)
      router.push(`/sextou-tools-pro/storybrand-strategy-generator/${projectId}/generate`)
    } catch (err) {
      alert("Erro ao salvar as respostas da entrevista.")
      setIsSubmitting(false)
    }
  }

  // Mapeamento lógico do Stepper v2 em 4 fases
  const getActivePhase = () => {
    if (currentStep < 5) return 0 // Passo 0 a 4 (Herói, Problemas, Vilão) -> Personagem e Dores
    if (currentStep < 7) return 1 // Passo 5 a 6 (Empatia, Autoridade) -> Posicionamento
    if (currentStep < 11) return 2 // Passo 7 a 10 (Processo, Acordo, CTAs) -> Plano e Ação
    return 3 // Passo 11 a 13 (Apostas, Sucesso, Configs) -> Resultados
  }

  const activePhase = getActivePhase()

  return (
    <div className="space-y-8">
      {/* STEPPER V2 AGRUPADO PARA NÃO SUBAR A TELA MOBILE */}
      <div className="stepper rounded-2xl bg-[#171717] p-5 border border-white/5">
        <div className="flex items-center justify-between w-full">
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 0 ? "on" : ""} ${activePhase > 0 ? "done" : ""}`}>
            <div className="step-dot">{activePhase > 0 ? "✓" : "1"}</div>
            <div className="step-label text-[10px] sm:text-xs">Dores</div>
          </div>
          <div className="step-line flex-shrink-0"></div>
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 1 ? "on" : ""} ${activePhase > 1 ? "done" : ""}`}>
            <div className="step-dot">{activePhase > 1 ? "✓" : "2"}</div>
            <div className="step-label text-[10px] sm:text-xs">Guia</div>
          </div>
          <div className="step-line flex-shrink-0"></div>
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 2 ? "on" : ""} ${activePhase > 2 ? "done" : ""}`}>
            <div className="step-dot">{activePhase > 2 ? "✓" : "3"}</div>
            <div className="step-label text-[10px] sm:text-xs">Plano</div>
          </div>
          <div className="step-line flex-shrink-0"></div>
          <div className={`step flex flex-col items-center gap-1.5 flex-1 ${activePhase >= 3 ? "on" : ""} ${activePhase > 3 ? "done" : ""}`}>
            <div className="step-dot">{activePhase > 3 ? "✓" : "4"}</div>
            <div className="step-label text-[10px] sm:text-xs">Entrega</div>
          </div>
        </div>
      </div>

      {/* TELA DE PERGUNTAS */}
      {!isReviewStep ? (
        <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-6">
          <div>
            <span className="font-mono text-xs text-[#5A5755] uppercase tracking-wider">
              Etapa {currentStep + 1} de {stepsCount} · Elemento: {questions[currentStep].element}
            </span>
            <h2 className="font-display text-2xl font-bold text-[#F0EDE6] mt-1">
              {questions[currentStep].question}
            </h2>
          </div>

          <div className="field">
            <label className="text-xs text-[#A09D97] font-semibold mb-2 block">
              Sua Resposta (A sugestão da IA já vem pré-preenchida):
            </label>
            
            {questions[currentStep].input_type === "select" && questions[currentStep].options ? (
              <div className="space-y-3">
                <select
                  value={answers[questions[currentStep].element]}
                  onChange={(e) => handleInputChange(questions[currentStep].element, e.target.value)}
                  className="w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 h-12 rounded-xl px-4 outline-none focus:border-[#FF3D57]"
                >
                  {questions[currentStep].options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="text-xs text-[#5A5755]">
                  Sugestão inicial: {questions[currentStep].suggestion}
                </div>
              </div>
            ) : (
              <textarea
                rows={4}
                className="font-sans text-sm w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl p-3 outline-none focus:border-[#FF3D57] transition"
                value={answers[questions[currentStep].element]}
                onChange={(e) => handleInputChange(questions[currentStep].element, e.target.value)}
                placeholder="Insira sua resposta..."
              ></textarea>
            )}
          </div>

          {/* COACH TIP DIDÁTICO */}
          <div className="coach flex gap-3 items-start bg-[linear-gradient(135deg,rgba(255,140,0,0.08),rgba(255,61,87,0.08))] p-4 rounded-xl border border-white/5">
            <Lightbulb className="h-5 w-5 text-[#FF8C00] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#A09D97] leading-relaxed">
              {COACH_TIPS[questions[currentStep].element] || "Complete este passo para alimentar os materiais derivados."}
            </p>
          </div>
        </div>
      ) : (
        /* TELA DE REVISÃO E VOZ/TONS FINAL */
        <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-6">
          <div>
            <span className="font-mono text-xs text-[#5A5755] uppercase tracking-wider">
              Revisão Final & Customização
            </span>
            <h2 className="font-display text-2xl font-bold text-[#F0EDE6] mt-1">
              Configure o Tom de Voz e Exportação
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="field">
              <label>Tom de Voz da Marca</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 h-12 rounded-xl px-4 outline-none focus:border-[#FF3D57]"
              >
                <option value="próximo">Próximo / Acolhedor</option>
                <option value="premium">Premium / Exclusivo</option>
                <option value="divertido">Divertido / Descontraído</option>
                <option value="técnico">Técnico / Especialista</option>
                <option value="inspirador">Inspirador / Motivador</option>
                <option value="direto">Direto / Sem enrolação</option>
              </select>
            </div>

            <div className="field">
              <label>Idioma da Estratégia</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 h-12 rounded-xl px-4 outline-none focus:border-[#FF3D57]"
              >
                <option value="pt-BR">Português (pt-BR)</option>
                <option value="en-US">Inglês (en-US)</option>
                <option value="es">Espanhol (es)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-[#A09D97] uppercase tracking-wider font-bold block">
              Canais Prioritários de Marketing
            </label>
            <div className="flex flex-wrap gap-2">
              {["site", "Instagram", "e-mail", "WhatsApp", "anúncios", "LinkedIn"].map(ch => {
                const selected = channels.includes(ch)
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleChannelToggle(ch)}
                    className={`h-10 px-4 rounded-xl text-xs font-semibold border transition ${
                      selected
                        ? "bg-[#FF3D57] border-transparent text-white"
                        : "bg-white/5 border-white/10 text-[#A09D97] hover:bg-white/10"
                    }`}
                  >
                    {ch}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h4 className="text-sm font-bold text-[#F0EDE6] mb-1">Qualidade de Processamento</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              O processamento utilizará orquestração multiagentes e roteamento de modelos de alta qualidade para garantir que sua copy siga os rigorosos padrões do livro de Donald Miller.
            </p>
          </div>
        </div>
      )}

      {/* BOTÕES DE CONTROLE */}
      <div className="flex justify-between items-center gap-4">
        <button
          disabled={currentStep === 0 || isSubmitting}
          onClick={handleBack}
          className="btn-ghost inline-flex items-center gap-2 h-12 px-5 rounded-xl text-sm font-semibold transition disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        {!isReviewStep ? (
          <button
            onClick={handleNext}
            className="btn-cta inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-sm font-bold text-white transition hover:opacity-95"
          >
            Avançar <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-grad inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 h-[54px] text-sm font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-55"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Gerar Minha Estratégia Pro
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
