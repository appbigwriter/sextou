import { NextResponse } from "next/server"
import { requireSextouToolsPremiumApiUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proUser = await requireSextouToolsPremiumApiUser()
    if (proUser === null) {
      return new NextResponse("Não autorizado", { status: 401 })
    }
    if (proUser === false) {
      return new NextResponse("Acesso restrito ao Pacote Premium (anúncio ativo + assinatura)", { status: 403 })
    }
    const user = proUser

    const projectId = params.id

    // Verifica se o projeto pertence ao usuário
    const project = await prisma.sb7Project.findFirst({
      where: { id: projectId, userId: user.id }
    })

    if (!project) {
      return new NextResponse("Projeto não encontrado", { status: 404 })
    }

    // Chama o planner_agent via OpenAI
    const systemPrompt = `Você é o planner_agent do mini-app Clareza (baseado no framework StoryBrand SB7 de Donald Miller).
Sua tarefa é analisar os 3 campos iniciais de um negócio e gerar um roteiro de entrevista estruturado em 7 etapas com sugestões personalizadas para o negócio.
O roteiro de entrevista deve conter exatamente as seguintes 7 etapas (com os subníveis indicados):
1. hero: Pergunta sobre o desejo do Herói (Cliente). Forneça opções fixas na chave 'options' (ex: ganhar tempo, ganhar dinheiro, status, segurança, pertencimento, saúde, simplicidade) e uma sugestão personalizada de texto na chave 'suggestion'.
2. problem_external: O problema físico ou barreira real enfrentada pelo cliente.
3. problem_internal: Como o cliente se sente em relação a essa barreira.
4. problem_philosophical: Por que isso é injusto / por que não deveria ser assim.
5. villain: A personificação do problema (opcional).
6. empathy: A mensagem de empatia do Guia (marca).
7. authority: O que confere autoridade ao Guia (provas, depoimentos, dados).
8. plan_process: Os 3 passos simples que o cliente deve dar.
9. plan_agreement: O acordo ou promessas que removem risco (ex:Presets de garantia).
10. cta_direct: A chamada de ação principal e direta (Ex: Comprar agora, etc.).
11. cta_transitional: Isca digital ou gerador de lead gratuito.
12. stakes: O que o cliente perde se não agir (aversão ao fracasso).
13. success: O resultado positivo (concreto e transformação de identidade).

Sua resposta DEVE ser um objeto JSON válido, contendo uma lista de etapas chamada 'steps'. Cada etapa deve conter as chaves:
- 'element': O nome do elemento (ex: "hero", "problem_external", "problem_internal", "problem_philosophical", "villain", "empathy", "authority", "plan_process", "plan_agreement", "cta_direct", "cta_transitional", "stakes", "success")
- 'question': A pergunta que será feita ao usuário.
- 'suggestion': A sugestão inteligente de resposta que você elaborou baseando-se no negócio.
- 'input_type': O tipo do campo ("text", "select" ou "multiselect").
- 'options': Um array de strings (opções/presets), obrigatório para tipos 'select' ou 'multiselect', opcional para 'text'.

Gere sugestões extremamente persuasivas, profissionais e focadas no mercado brasileiro nos EUA. Não cite informações confidenciais.`

    const userPrompt = `Nome do negócio: ${project.name}
Público-alvo: ${project.targetAudience}
Descrição do negócio/ideia: ${project.rawIdea}`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // modelo rápido e de excelente estrutura JSON
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })

    const responseText = response.choices[0].message?.content
    if (!responseText) {
      throw new Error("Resposta da IA vazia")
    }

    const resultJson = JSON.parse(responseText)

    // Cria ou atualiza a sessão de entrevista
    const sessionRecord = await prisma.sb7InterviewSession.upsert({
      where: { id: (await prisma.sb7InterviewSession.findFirst({ where: { projectId } }))?.id || "00000000-0000-0000-0000-000000000000" },
      update: {
        questions: resultJson.steps,
        status: "open"
      },
      create: {
        projectId,
        userId: user.id,
        questions: resultJson.steps,
        status: "open"
      }
    })

    // Atualiza o status do projeto para interviewing
    await prisma.sb7Project.update({
      where: { id: projectId },
      data: { status: "interviewing" }
    })

    return NextResponse.json({ sessionId: sessionRecord.id, steps: resultJson.steps })
  } catch (err: any) {
    console.error("[PLANNER_AGENT] Error:", err)
    return new NextResponse(err.message || "Erro no servidor", { status: 500 })
  }
}
