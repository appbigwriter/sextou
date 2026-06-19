import type { Metadata } from "next"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { StoryBrandInterviewWizard } from "./wizard-client"
import OpenAI from "openai"

export const metadata: Metadata = {
  title: "Entrevista StoryBrand SB7 | SextouTools Premium",
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateQuestionsFallback(project: { name: string; targetAudience: string; rawIdea: string }) {
  const systemPrompt = `Você é o planner_agent do mini-app Clareza (baseado no framework StoryBrand SB7 de Donald Miller).
Gere um roteiro de entrevista estruturado em 7 etapas com sugestões personalizadas para o negócio.
O roteiro de entrevista deve conter exatamente as seguintes 13 chaves no JSON correspondentes ao SB7:
 hero, problem_external, problem_internal, problem_philosophical, villain, empathy, authority, plan_process, plan_agreement, cta_direct, cta_transitional, stakes, success.
Sua resposta DEVE ser um objeto JSON válido contendo uma lista 'steps' com 'element', 'question', 'suggestion', 'input_type' e opcional 'options'.`

  const userPrompt = `Nome: ${project.name}
Público: ${project.targetAudience}
Descrição: ${project.rawIdea}`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  })

  const text = response.choices[0].message?.content
  if (!text) throw new Error("IA falhou")
  return JSON.parse(text).steps
}

export default async function StoryBrandInterviewPage({
  params
}: {
  params: { projectId: string }
}) {
  const projectId = params.projectId
  const access = await resolveSextouToolsPremiumUser()

  if (access.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/storybrand-strategy-generator")
  }

  if (access.kind === "forbidden" || access.kind === "db-unavailable") {
    redirect(`/sextou-tools-pro/acesso?next=/sextou-tools-pro/storybrand-strategy-generator/${projectId}/interview`)
  }

  const user = access.user

  const project = await prisma.sb7Project.findFirst({
    where: { id: projectId, userId: user.id }
  })

  if (!project) {
    redirect("/sextou-tools-pro/storybrand-strategy-generator")
  }

  let sessionRecord = await prisma.sb7InterviewSession.findFirst({
    where: { projectId }
  })

  // Se não existir sessão gerada, gera na hora para evitar tela em branco
  if (!sessionRecord || !sessionRecord.questions) {
    try {
      const steps = await generateQuestionsFallback(project)
      sessionRecord = await prisma.sb7InterviewSession.create({
        data: {
          projectId,
          userId: user.id,
          questions: steps,
          status: "open"
        }
      })
      await prisma.sb7Project.update({
        where: { id: projectId },
        data: { status: "interviewing" }
      })
    } catch (err) {
      console.error("[WIZARD_PREP] Failed to auto-generate questions:", err)
      redirect("/sextou-tools-pro/storybrand-strategy-generator?error=planner-failed")
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader showPublicNav={false} />
      
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <StoryBrandInterviewWizard
          projectId={projectId}
          questions={sessionRecord.questions as any[]}
          initialAnswers={(sessionRecord.answers || {}) as Record<string, string>}
        />
      </main>
    </div>
  )
}
