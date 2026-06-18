"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Sparkles, Loader2, Play } from "lucide-react"

interface ChannelData {
  id: string
  channelName: string
  niche: string
  city: string | null
  primaryOffer: string | null
  targetAudience: string[]
  tone: string | null
  goal: string | null
  language: string
  weeklyFrequency: number
  includeShorts: boolean
  includeLives: boolean
  focusKeywords: string[]
  contentRestrictions: string[]
}

const TONES = [
  "Autoridade amigável",
  "Educativo leve",
  "Energético/viral",
  "Sofisticado",
  "Humor leve"
]

const GOALS = [
  "Vender serviço",
  "Gerar leads",
  "Construir autoridade",
  "Educar clientes",
  "Recrutar",
  "Misto"
]

const AUDIENCES = [
  "Brasileiros recém-chegados",
  "Brasileiros estabelecidos",
  "Mistos BR+gringos",
  "Turistas",
  "Empresários BR"
]

const RESTRICTIONS = [
  "Sem política",
  "Sem saúde sensível",
  "Sem claims financeiros",
  "Sem marcas concorrentes"
]

export function SetupWizardClient({ channel }: { channel: ChannelData }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form States
  const [targetAudience, setTargetAudience] = useState<string[]>(channel.targetAudience || [AUDIENCES[0]])
  const [tone, setTone] = useState(channel.tone || TONES[0])
  const [goal, setGoal] = useState(channel.goal || GOALS[0])
  const [language, setLanguage] = useState(channel.language || "pt-BR")
  const [weeklyFrequency, setWeeklyFrequency] = useState(channel.weeklyFrequency || 2)
  const [includeShorts, setIncludeShorts] = useState(channel.includeShorts ?? true)
  const [includeLives, setIncludeLives] = useState(channel.includeLives ?? false)
  const [focusKeywords, setFocusKeywords] = useState<string[]>(channel.focusKeywords || [])
  const [keywordInput, setKeywordInput] = useState("")
  const [contentRestrictions, setContentRestrictions] = useState<string[]>(channel.contentRestrictions || [])

  const handleAudienceToggle = (aud: string) => {
    setTargetAudience(prev =>
      prev.includes(aud) ? prev.filter(x => x !== aud) : [...prev, aud]
    )
  }

  const handleRestrictionToggle = (rest: string) => {
    setContentRestrictions(prev =>
      prev.includes(rest) ? prev.filter(x => x !== rest) : [...prev, rest]
    )
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !focusKeywords.includes(keywordInput.trim())) {
      setFocusKeywords(prev => [...prev, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const removeKeyword = (kw: string) => {
    setFocusKeywords(prev => prev.filter(x => x !== kw))
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/youtube-growth-studio/channels/${channel.id}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAudience,
          tone,
          goal,
          language,
          weeklyFrequency,
          includeShorts,
          includeLives,
          focusKeywords,
          contentRestrictions
        })
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || "Erro ao gerar plano editorial")
      }

      const data = await res.json()
      router.push(`/sextou-tools-pro/youtube-growth-studio/${channel.id}/result?planId=${data.planId}`)
    } catch (err: any) {
      setError(err.message || "Erro de conexão ao servidor.")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* STEPPER HEADER */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF3D57]">
            Configuração do Canal
          </span>
          <h2 className="font-display text-2xl font-extrabold text-white mt-1">
            {channel.channelName}
          </h2>
        </div>
        <div className="font-mono text-sm text-[#A09D97]">
          Etapa <span className="text-white font-bold">{step}</span> de 5
        </div>
      </div>

      {/* STEPPER BAR */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i <= step
                ? "bg-gradient-to-r from-[#FF3D57] to-[#FF8C00]"
                : "bg-white/5"
            }`}
          />
        ))}
      </div>

      {/* COACH TIP */}
      <div className="coach flex gap-3 items-start rounded-2xl border border-[#FF3D57]/20 bg-[#FF3D57]/5 p-4 text-sm leading-relaxed text-[#F0EDE6]/90">
        <span className="text-lg">💡</span>
        <div>
          {step === 1 && "Definir o público-alvo correto garante que o YouTube recomende seus vídeos exatamente para quem tem maior chance de virar cliente."}
          {step === 2 && "O tom de voz e o objetivo do canal devem estar alinhados. Para vender serviços de alto valor, um tom de Autoridade amigável é ideal."}
          {step === 3 && "Empreendedores bem-sucedidos mesclam conteúdos longos (para reter e vender) com Shorts (para alcance e novos inscritos)."}
          {step === 4 && "Palavras-chave de cauda longa ajudam brasileiros nos EUA a encontrarem seu negócio local quando pesquisam no Google ou YouTube."}
          {step === 5 && "Nossa IA revisará se o plano final respeita as restrições para evitar que seu canal sofra penalizações ou claims de conformidade."}
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="min-h-[280px] bg-[#171717] rounded-2xl border border-white/10 p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-[#F0EDE6]">
              Quem é o público-alvo principal do seu conteúdo?
            </h3>
            <p className="text-xs text-[#A09D97]">
              Selecione todos que se aplicam. Isso molda o vocabulário e referências do roteiro.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {AUDIENCES.map(aud => {
                const selected = targetAudience.includes(aud)
                return (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => handleAudienceToggle(aud)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition text-left h-14 ${
                      selected
                        ? "border-[#FF3D57] bg-[#FF3D57]/10 text-white"
                        : "border-white/10 bg-white/5 text-[#A09D97] hover:border-white/20"
                    }`}
                  >
                    <span>{aud}</span>
                    {selected && <span className="text-xs text-[#FF3D57]">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-[#F0EDE6] mb-3">
                Tom de Voz da IA
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {TONES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`p-4 rounded-xl border text-sm font-semibold transition text-left h-14 ${
                      tone === t
                        ? "border-[#FF3D57] bg-[#FF3D57]/10 text-white"
                        : "border-white/10 bg-white/5 text-[#A09D97] hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="font-display text-lg font-bold text-[#F0EDE6] mb-3">
                Qual o Objetivo do Canal?
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {GOALS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`p-4 rounded-xl border text-sm font-semibold transition text-left h-14 ${
                      goal === g
                        ? "border-[#FF3D57] bg-[#FF3D57]/10 text-white"
                        : "border-white/10 bg-white/5 text-[#A09D97] hover:border-white/20"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-[#F0EDE6]">
              Frequência & Formatos de Vídeo
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A09D97] uppercase tracking-wider mb-2">
                  Frequência Semanal de Vídeos Longos
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setWeeklyFrequency(num)}
                      className={`flex-1 p-3 rounded-xl border text-sm font-bold transition ${
                        weeklyFrequency === num
                          ? "border-[#FF3D57] bg-[#FF3D57]/10 text-white"
                          : "border-white/10 bg-white/5 text-[#A09D97] hover:border-white/20"
                      }`}
                    >
                      {num}x por semana
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 pt-4 border-t border-white/5 sm:grid-cols-2">
                <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition">
                  <div>
                    <span className="block text-sm font-bold text-white">Incluir YouTube Shorts?</span>
                    <span className="block text-xs text-[#A09D97] mt-0.5">Micro-vídeos dinâmicos para atração</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeShorts}
                    onChange={(e) => setIncludeShorts(e.target.checked)}
                    className="accent-[#FF3D57] h-5 w-5 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition">
                  <div>
                    <span className="block text-sm font-bold text-white">Incluir Lives Semanais?</span>
                    <span className="block text-xs text-[#A09D97] mt-0.5">Lives estratégicas de perguntas e respostas</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeLives}
                    onChange={(e) => setIncludeLives(e.target.checked)}
                    className="accent-[#FF3D57] h-5 w-5 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="block text-xs font-semibold text-[#A09D97] uppercase tracking-wider mb-2">
                  Idioma Padrão do Script
                </label>
                <div className="flex gap-3">
                  {[
                    { key: "pt-BR", label: "Português (PT-BR)" },
                    { key: "en-US", label: "Inglês (EN-US)" },
                    { key: "bilingual", label: "Bilíngue (Português + Inglês)" }
                  ].map(lang => (
                    <button
                      key={lang.key}
                      type="button"
                      onClick={() => setLanguage(lang.key)}
                      className={`flex-1 p-3 rounded-xl border text-xs font-bold transition ${
                        language === lang.key
                          ? "border-[#FF3D57] bg-[#FF3D57]/10 text-white"
                          : "border-white/10 bg-white/5 text-[#A09D97] hover:border-white/20"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-[#F0EDE6]">
              Palavras-chave de Foco (SEO)
            </h3>
            <p className="text-xs text-[#A09D97]">
              Adicione os termos e dúvidas mais comuns que seus clientes buscam.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: abrir empresa nos EUA, imposto na Flórida"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                className="flex-1 bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF3D57]"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-bold transition text-white border border-white/10"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {focusKeywords.length === 0 ? (
                <span className="text-xs text-[#5A5755] italic">Nenhuma palavra-chave cadastrada ainda.</span>
              ) : (
                focusKeywords.map(kw => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF3D57]/10 border border-[#FF3D57]/20 text-xs font-semibold text-[#FF3D57]"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="hover:text-white transition font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-[#F0EDE6]">
              Restrições de Conteúdo & Compliance
            </h3>
            <p className="text-xs text-[#A09D97]">
              Marque as restrições éticas ou legais que a IA deve obedecer nos roteiros.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {RESTRICTIONS.map(rest => {
                const selected = contentRestrictions.includes(rest)
                return (
                  <button
                    key={rest}
                    type="button"
                    onClick={() => handleRestrictionToggle(rest)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition text-left h-14 ${
                      selected
                        ? "border-[#FF3D57] bg-[#FF3D57]/10 text-white"
                        : "border-white/10 bg-white/5 text-[#A09D97] hover:border-white/20"
                    }`}
                  >
                    <span>{rest}</span>
                    {selected && <span className="text-xs text-[#FF3D57]">✓</span>}
                  </button>
                )
              })}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-500">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* STEP NAVIGATION */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          disabled={step === 1 || isLoading}
          onClick={() => setStep(prev => prev - 1)}
          className="inline-flex items-center gap-1.5 h-12 px-5 rounded-xl text-sm font-bold text-[#A09D97] border border-white/10 bg-white/5 hover:bg-white/10 transition disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep(prev => prev + 1)}
            className="inline-flex items-center gap-1.5 h-12 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] transition hover:opacity-95 shadow-lg shadow-[#FF3D57]/10"
          >
            Próximo <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] transition hover:opacity-95 shadow-lg shadow-[#FF3D57]/10 disabled:opacity-55"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Gerando Plano...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" /> Começar Geração Premium
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
