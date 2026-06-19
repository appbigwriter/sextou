import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { Sparkles, Plus, Folder, Trash2, Calendar, ArrowRight, BookOpen } from "lucide-react"
import { deleteSocialProject } from "./actions"

export const metadata: Metadata = {
  title: "Dashboard - EasySocial - Network Studio",
  description: "Crie campanhas e copies persuasivas baseadas na psicologia de resposta direta e na metodologia de copy.",
}

export default async function SocialNetworkPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login?next=/sextou-tools-pro/social-network-studio")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, hasActiveAds: true, isPremium: true, fullName: true, businessName: true }
  })

  if (!user) {
    redirect("/login")
  }

  // Se o usuário não tem anúncios ativos ou não é premium, redireciona para a página de vendas central
  if (!user.hasActiveAds || !user.isPremium) {
    redirect("/sextou-tools-pro/acesso?next=/sextou-tools-pro/social-network-studio")
  }

  // Busca projetos e campanhas do usuário
  const projects = await prisma.socialNetworkProject.findMany({
    where: { userId: user.id },
    include: {
      campaigns: {
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  const totalCampaigns = projects.reduce((acc, p) => acc + p.campaigns.length, 0)

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader userName={user.fullName} businessName={user.businessName} showPublicNav={false} />
      
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        
        {/* HERO E AÇÕES RÁPIDAS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="font-toolkit text-4xl font-extrabold tracking-[-0.02em] text-white">
              EasySocial - Network Studio
            </h1>
            <p className="text-sm text-[#A09D97] mt-1.5 max-w-2xl">
              Crie engenharia de atenção, copie de alta conversão e campanhas orientadas a resultados baseado nos 42 ensinamentos de resposta direta.
            </p>
          </div>

          <Link
            href="/sextou-tools-pro/social-network-studio/new"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 text-sm font-bold text-white shadow-lg shadow-[#FF3D57]/10 transition hover:opacity-95 shrink-0"
          >
            <Plus className="h-5 w-5" /> Criar Nova Campanha
          </Link>
        </div>

        {/* METRICS GRID */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-[#171717] p-5 space-y-2">
            <span className="text-xs font-mono text-[#5A5755] uppercase tracking-wider">Total de Projetos</span>
            <p className="text-3xl font-extrabold text-white">{projects.length}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#171717] p-5 space-y-2">
            <span className="text-xs font-mono text-[#5A5755] uppercase tracking-wider">Campanhas Estruturadas</span>
            <p className="text-3xl font-extrabold text-white">{totalCampaigns}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#171717] p-5 space-y-2">
            <span className="text-xs font-mono text-[#5A5755] uppercase tracking-wider">Foco Metodológico</span>
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 pt-1.5">
              <Sparkles className="h-4 w-4" /> 42 Ensinamentos de Copy
            </p>
          </div>
        </div>

        {/* LISTAGEM DE PROJETOS E ESTADO VAZIO */}
        {projects.length > 0 ? (
          <div className="space-y-6">
            <h3 className="font-toolkit text-xl font-bold text-white">Seus Projetos Ativos</h3>
            
            <div className="grid gap-6">
              {projects.map((project) => (
                <div key={project.id} className="rounded-3xl border border-white/10 bg-[#171717] p-6 hover:border-white/20 transition space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="font-toolkit text-lg font-bold text-white flex items-center gap-2">
                        <Folder className="h-5 w-5 text-[#FF8C00]" /> {project.projectName}
                      </h4>
                      <p className="text-xs text-[#A09D97]"><strong>Público:</strong> {project.targetAudience}</p>
                      <p className="text-xs text-[#5A5755] mt-1">{project.basicIdea}</p>
                    </div>

                    <form action={async () => {
                      "use server"
                      await deleteSocialProject(project.id)
                    }}>
                      <button
                        type="submit"
                        className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-[#5A5755] hover:text-[#FF3D57] hover:bg-white/10 transition cursor-pointer"
                        title="Excluir Projeto"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </form>
                  </div>

                  {/* CAMPANHAS DENTRO DESTE PROJETO */}
                  {project.campaigns.length > 0 ? (
                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <p className="text-[10px] font-mono text-[#5A5755] uppercase tracking-wider">Campanhas</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {project.campaigns.map((camp) => (
                          <Link
                            key={camp.id}
                            href={`/sextou-tools-pro/social-network-studio/${camp.id}/result`}
                            className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition group"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-[#FF3D57] shrink-0" />
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-white">Campanha de Mês {camp.month}/{camp.year}</p>
                                <p className="text-[10px] text-[#A09D97] line-clamp-1">{camp.promessa}</p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#5A5755] group-hover:translate-x-1 group-hover:text-white transition shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-white/5 pt-4 text-center py-4 text-xs text-[#5A5755]">
                      Nenhuma campanha gerada para este projeto.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#FF3D57]/10 to-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center mx-auto shadow-inner">
              <BookOpen className="h-8 w-8" />
            </div>
            
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-toolkit text-xl font-bold text-white">Nenhum projeto ou Canvas criado</h3>
              <p className="text-xs text-[#A09D97] leading-relaxed">
                Você possui anúncios ativos! Comece a estruturar sua primeira campanha usando o Wizard e o Canvas da Oferta 11 Estrelas calibrada com os 42 segredos da persuasão.
              </p>
            </div>

            <Link
              href="/sextou-tools-pro/social-network-studio/new"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-bold text-white shadow-lg transition hover:opacity-95"
            >
              Iniciar Onboarding / Canvas
            </Link>
          </div>
        )}

      </main>
    </div>
  )
}
