"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject, duplicateProject, archiveProject } from "./actions"
import { Plus, Copy, Archive, ExternalLink, Sparkles, Loader2 } from "lucide-react"

interface ProjectWithVersion {
  id: string
  name: string
  targetAudience: string
  rawIdea: string
  status: string
  updatedAt: Date
  brandScripts: { version: number }[]
}

export function StoryBrandDashboardClient({
  initialProjects
}: {
  initialProjects: ProjectWithVersion[]
}) {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectWithVersion[]>(initialProjects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  
  // State do formulário de criação
  const [name, setName] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [rawIdea, setRawIdea] = useState("")
  const [error, setError] = useState("")

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await createProject({ name, targetAudience, rawIdea })
      router.push(`/sextou-tools-pro/storybrand-strategy-generator/${result.id}/interview`)
    } catch (err: any) {
      setError(err.message || "Erro ao criar projeto")
      setIsLoading(false)
    }
  }

  const handleDuplicate = async (id: string) => {
    setActionLoadingId(id)
    try {
      const result = await duplicateProject(id)
      router.refresh()
      // O Next.js revalida no servidor, podemos recarregar para atualizar a lista
      window.location.reload()
    } catch (err) {
      alert("Erro ao duplicar o projeto")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleArchive = async (id: string) => {
    if (!confirm("Tem certeza que deseja arquivar este projeto?")) return
    setActionLoadingId(id)
    try {
      await archiveProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert("Erro ao arquivar o projeto")
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-10">
      {/* HEADER SEÇÃO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FF3D57]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FF3D57]">
            <Sparkles className="h-3.5 w-3.5" /> Suite Premium
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-[#F0EDE6] md:text-5xl">
            Clareza
          </h1>
          <p className="mt-2 text-sm text-[#A09D97] max-w-2xl leading-relaxed">
            O cliente é o herói, sua marca é o guia. Desenvolva estratégias de comunicação claras e persuasivas baseadas no framework StoryBrand SB7 de Donald Miller.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-grad inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-bold text-white shadow-lg transition hover:opacity-95 h-[54px] min-w-[180px]"
        >
          <Plus className="h-5 w-5" /> Novo Projeto
        </button>
      </div>

      {/* COACH TIP DO SISTEMA */}
      <div className="coach flex gap-4 items-start rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.06),rgba(255,140,0,0.06))] p-5">
        <span className="text-xl">💡</span>
        <p className="text-sm text-[#F0EDE6]/90 leading-relaxed">
          <b>Dica metodológica:</b> Na estratégia de marketing, <b>a sua marca nunca é o herói</b> da história. O herói é o seu cliente. O papel da sua marca é o de ser o Guia (como Yoda para Luke Skywalker ou Gandalf para Frodo) que oferece empatia, autoridade e um plano simples para vencer o vilão e o problema.
        </p>
      </div>

      {/* CONTEÚDO / LISTAGEM */}
      {projects.length === 0 ? (
        <div className="empty rounded-2xl border-2 border-dashed border-white/10 bg-[#171717]/30 p-12 text-center max-w-2xl mx-auto mt-8">
          <div className="empty-emoji text-5xl mb-4">🎯</div>
          <h3 className="font-display text-lg font-bold text-[#F0EDE6] mb-2">Nenhum projeto de estratégia ainda</h3>
          <p className="empty-text text-sm text-[#A09D97] max-w-md mx-auto mb-6 leading-relaxed">
            Crie seu primeiro projeto para transformar suas ideias confusas em um roteiro de posicionamento StoryBrand SB7 completo com copy de site e e-mails.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-grad inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
          >
            Criar Meu Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-white/10 bg-[#171717] p-6 flex flex-col justify-between hover:border-white/20 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`ct-badge px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    project.status === "generated"
                      ? "bg-[#1FBA7A]/10 text-[#1FBA7A]"
                      : project.status === "interviewing"
                      ? "bg-[#FFD600]/10 text-[#FFD600]"
                      : "bg-[#4A9EFF]/10 text-[#4A9EFF]"
                  }`}>
                    {project.status === "generated"
                      ? "Gerada"
                      : project.status === "interviewing"
                      ? "Entrevistando"
                      : "Rascunho"}
                  </span>
                  <span className="font-mono text-xs text-[#5A5755]">
                    v{project.brandScripts[0]?.version || 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#F0EDE6] group-hover:text-white transition">
                  {project.name}
                </h3>
                <p className="mt-2 text-xs text-[#5A5755] uppercase tracking-wider font-semibold">Público-alvo:</p>
                <p className="text-sm text-[#A09D97] line-clamp-2 mt-0.5">
                  {project.targetAudience}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => router.push(
                    project.status === "generated"
                      ? `/sextou-tools-pro/storybrand-strategy-generator/${project.id}/result`
                      : `/sextou-tools-pro/storybrand-strategy-generator/${project.id}/interview`
                  )}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 text-xs font-bold text-[#F0EDE6] transition"
                >
                  {project.status === "generated" ? "Ver Estratégia" : "Continuar"} <ExternalLink className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    disabled={actionLoadingId !== null}
                    onClick={() => handleDuplicate(project.id)}
                    title="Duplicar projeto"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#A09D97] hover:text-white transition disabled:opacity-55"
                  >
                    {actionLoadingId === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    disabled={actionLoadingId !== null}
                    onClick={() => handleArchive(project.id)}
                    title="Arquivar projeto"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#A09D97] hover:text-red transition disabled:opacity-55"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO (3 CAMPOS) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-filter backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#171717] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="font-display text-2xl font-bold text-[#F0EDE6] mb-1">
              Criar Novo Projeto
            </h2>
            <p className="text-xs text-[#A09D97] mb-6">
              Insira as informações básicas para nossa Inteligência Artificial preparar seu roteiro de entrevista.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-5">
              <div className="field">
                <label>Nome do Projeto / Marca</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consultoria Silva, App Fitness, Padaria Central"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="field">
                <label>Quem é o seu Público-Alvo?</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pequenos empresários locais, mães ocupadas, etc."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="field">
                <label>Descreva sua empresa ou serviço</label>
                <textarea
                  required
                  rows={4}
                  className="font-sans text-sm w-full bg-[#1F1F1F] text-[#F0EDE6] border border-white/15 rounded-xl p-3 outline-none focus:border-[#FF3D57] transition"
                  placeholder="Descreva de forma simples o que você vende, qual problema resolve e como ajuda seu cliente..."
                  value={rawIdea}
                  onChange={(e) => setRawIdea(e.target.value)}
                  disabled={isLoading}
                ></textarea>
              </div>

              {error && (
                <div className="friendly-error bg-red/10 border border-red/20 rounded-xl p-3 text-xs text-red">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="btn-ghost px-4 h-12 rounded-xl text-sm font-semibold transition"
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
                      <Loader2 className="h-4 w-4 animate-spin" /> Preparando...
                    </>
                  ) : (
                    "Continuar →"
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
