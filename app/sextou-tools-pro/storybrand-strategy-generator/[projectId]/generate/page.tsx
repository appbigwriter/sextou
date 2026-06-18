"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { Loader2, RefreshCw } from "lucide-react"

export default function StoryBrandGeneratePage({
  params
}: {
  params: { projectId: string }
}) {
  const router = useRouter()
  const [progress, setProgress] = useState(10)
  const [statusText, setStatusText] = useState("Iniciando orquestração dos agentes... 🚀")
  const [error, setError] = useState<string | null>(null)

  const triggerGeneration = async () => {
    setError(null)
    setProgress(15)
    setStatusText("Planejando a estrutura da marca com planner_agent... 📋")

    try {
      // Atualiza o progresso simulando as etapas da IA
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 35) {
            setStatusText("brandscript_agent está redigindo seu BrandScript e One-liner... ✍️")
            return prev + 2
          }
          if (prev < 70) {
            setStatusText("collateral_agent está montando seu wireframe de site e e-mails... ✉️")
            return prev + 1
          }
          if (prev < 92) {
            setStatusText("compliance_agent e quality_agent estão auditando o resultado... ⚖️")
            return prev + 1
          }
          return prev
        })
      }, 350)

      const response = await fetch(`/api/storybrand-strategy-generator/projects/${params.projectId}/generate`, {
        method: "POST"
      })

      clearInterval(interval)

      if (!response.ok) {
        throw new Error("Falha no processamento da inteligência artificial.")
      }

      setProgress(100)
      setStatusText("Estratégia aprovada com sucesso! Redirecionando... 🎉")
      
      setTimeout(() => {
        router.push(`/sextou-tools-pro/storybrand-strategy-generator/${params.projectId}/result`)
      }, 800)

    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao gerar estratégia.")
    }
  }

  useEffect(() => {
    triggerGeneration()
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader showPublicNav={false} />

      <main className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-2xl border border-white/10 bg-[#171717] p-8 space-y-8 text-center shadow-2xl">
          {!error ? (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 text-[#FF3D57] animate-spin" />
              </div>

              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold">Gerando sua Estratégia Premium</h2>
                <p className="text-sm text-[#A09D97]">{statusText}</p>
              </div>

              {/* PROGRESS BAR DO DESIGN SYSTEM V2 */}
              <div className="prog-friendly text-left space-y-2.5">
                <div className="pf-top flex justify-between text-xs font-mono text-[#5A5755]">
                  <span>Progresso do Funil</span>
                  <span>{progress}%</span>
                </div>
                <div className="pf-track h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="pf-fill h-full bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            /* ERRO AMIGÁVEL DO DESIGN SYSTEM V2 */
            <div className="space-y-6">
              <div className="friendly-error bg-red/10 border border-red/20 rounded-2xl p-6 flex gap-4 text-left items-start">
                <span className="text-3xl">😅</span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-red">Alta Demanda no Servidor</h3>
                  <p className="text-xs text-[#A09D97] leading-relaxed">
                    Nossos agentes de IA de alto raciocínio estão sobrecarregados no momento. Você não foi cobrado por esta tentativa. Clique no botão abaixo para tentar processar novamente.
                  </p>
                </div>
              </div>

              <button
                onClick={triggerGeneration}
                className="btn-grad inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
              >
                <RefreshCw className="h-4 w-4" /> Tentar de Novo
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
