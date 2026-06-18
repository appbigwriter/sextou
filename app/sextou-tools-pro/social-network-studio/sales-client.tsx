"use client"

import { useState } from "react"
import { Sparkles, ArrowRight, Zap, Target, BookOpen, ShieldAlert } from "lucide-react"
import { PagamentoStripe } from "@/components/sextou-tools-pro/pagamento-stripe"

export function SalesPageClient() {
  const [currentStep, setCurrentStep] = useState(0)

  const stepsData = [
    {
      title: "Novo projeto",
      sub: "Três campos. A IA faz o resto.",
      fields: [
        { label: "Nome do projeto", value: "Mentoria Copy 2026" },
        { label: "Público-alvo", value: "Empreendedores que vendem serviços online" },
        { label: "Ideia básica", value: "Uma mentoria em grupo para ensinar copywriting de resposta direta..." }
      ],
      tip: "Pense na dor que seu produto ou mentoria realmente resolve de forma rápida."
    },
    {
      title: "Qual a dor principal?",
      sub: "O que tira o sono do seu cliente?",
      fields: [
        { label: "Sugestões da IA", value: "• Posto muito e não vendo\n• Não sei o que escrever\n• Concorrente copia e vende mais" }
      ],
      tip: "Pense no problema que ele tenta esconder. É ele que gera a compra por impulso."
    },
    {
      title: "Sua oferta 11 estrelas",
      sub: "Validação de credibilidade em tempo real",
      fields: [
        { label: "Promessa", value: "Fature R$10k/mês com copy em 90 dias" }
      ],
      tip: "Cuidado: Promessa de faturamento exige prova social robusta. Considere adicionar depoimentos."
    },
    {
      title: "Campanha estruturada!",
      sub: "Dossiê completo gerado",
      fields: [
        { label: "Conteúdo", value: "14 dias • 23 copies • 7 e-mails • 12 headlines prontos para rodar" }
      ],
      tip: "Copies otimizadas prontas para exportar em MD, Word ou CSV."
    }
  ]

  const activeStepData = stepsData[currentStep]

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF8C00]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#FF8C00]">
          <Sparkles className="h-4 w-4" /> SextouTools Premium
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-[#F0EDE6] md:text-6xl leading-tight">
          Pare de postar. <br />
          <span className="bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] -webkit-background-clip: text; background-clip: text; color: transparent;">
            Comece a ofertar.
          </span>
        </h1>
        <p className="text-base text-[#A09D97] max-w-2xl mx-auto leading-relaxed">
          O <strong>Oferta11</strong> é o primeiro app de gestão de redes sociais calibrado pelos <strong>42 princípios de Copywriting de Resposta Direta</strong>. Crie campanhas e ofertas irresistíveis de alta conversão estruturadas por IA.
        </p>
      </div>

      {/* DEMO INTERACTIVE MOCKUP */}
      <div className="grid gap-10 lg:grid-cols-2 items-center max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="flex gap-2">
            {stepsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  idx <= currentStep
                    ? "bg-gradient-to-r from-[#FF3D57] to-[#FF8C00]"
                    : "bg-white/5"
                }`}
              />
            ))}
          </div>

          <div className="bg-[#171717] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div>
              <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-wider">
                Passo {currentStep + 1} de {stepsData.length}
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">
                {activeStepData.title}
              </h3>
              <p className="text-xs text-[#A09D97] mt-1">
                {activeStepData.sub}
              </p>
            </div>

            <div className="space-y-4">
              {activeStepData.fields.map((f, idx) => (
                <div key={idx} className="bg-[#1F1F1F] border border-white/5 rounded-xl p-4">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#A09D97] mb-1">
                    {f.label}
                  </span>
                  <p className="text-sm text-white whitespace-pre-line leading-relaxed">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#FF8C00]/5 border-l-2 border-[#FF8C00] rounded-r-xl p-4 text-xs text-[#F0EDE6]/90 leading-relaxed">
              <strong>💡 Dica:</strong> {activeStepData.tip}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(prev => (prev > 0 ? prev - 1 : stepsData.length - 1))}
                className="text-xs font-semibold text-[#A09D97] hover:text-white transition"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setCurrentStep(prev => (prev < stepsData.length - 1 ? prev + 1 : 0))}
                className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-xs font-bold text-white px-4 py-2.5 rounded-xl border border-white/10 transition"
              >
                Avançar <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PAYWALL / UPGRADE BLOCK */}
        <div className="bg-[#171717] rounded-3xl border border-white/10 p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF3D57]/10 to-[#FF8C00]/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] flex items-center justify-center text-white shadow-lg shadow-[#FF3D57]/20">
            <Zap className="h-6 w-6 fill-current" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold text-white">
              Desbloqueie o Social Network Studio
            </h3>
            <p className="text-sm text-[#A09D97] leading-relaxed">
              O acesso a esta ferramenta e suas inteligências de copywriter exige a ativação do <strong>Pacote Premium</strong>.
            </p>
          </div>

          <ul className="space-y-3 pt-2">
            <li className="flex items-center gap-2.5 text-sm text-[#F0EDE6]/90">
              <span className="w-2 h-2 rounded-full bg-[#FF8C00]" />
              Motor de Headlines e Simplicidade
            </li>
            <li className="flex items-center gap-2.5 text-sm text-[#F0EDE6]/90">
              <span className="w-2 h-2 rounded-full bg-[#FF8C00]" />
              Canvas da Oferta 11 Estrelas
            </li>
            <li className="flex items-center gap-2.5 text-sm text-[#F0EDE6]/90">
              <span className="w-2 h-2 rounded-full bg-[#FF8C00]" />
              Cofre de Provas Sociais e DMs Humanizadas
            </li>
          </ul>

          <div className="pt-4">
            <PagamentoStripe
              planSlug="pro"
              label="Assinar Pacote Premium via Stripe"
              className="w-full btn-grad inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-bold text-white shadow-lg shadow-[#FF3D57]/10 transition hover:opacity-95"
            />
          </div>
        </div>
      </div>

      {/* CORE PILARS BENEFITS */}
      <div className="pt-10 border-t border-white/5">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">
          Calibrado por 4 Grandes Pilares de Vendas
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[#171717] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF3D57]/10 text-[#FF3D57] flex items-center justify-center font-bold">A</div>
            <h4 className="font-display font-bold text-white">A Forma</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              Headlines que agem como iscas de atenção e linguagem simplificada.
            </p>
          </div>

          <div className="bg-[#171717] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center font-bold">Q</div>
            <h4 className="font-display font-bold text-white">O Quem</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              Identificação exata de dores e medos singulares do seu cliente.
            </p>
          </div>

          <div className="bg-[#171717] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold">R</div>
            <h4 className="font-display font-bold text-white">O Resultado</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              Garantias, provas sociais e escassez estruturadas de forma crível.
            </p>
          </div>

          <div className="bg-[#171717] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">N</div>
            <h4 className="font-display font-bold text-white">O Negócio</h4>
            <p className="text-xs text-[#A09D97] leading-relaxed">
              Atendimento DMs humanizado e integração com e-mail marketing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
