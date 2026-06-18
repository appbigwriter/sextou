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

    const project = await prisma.sb7Project.findFirst({
      where: { id: projectId, userId: user.id }
    })

    if (!project) {
      return new NextResponse("Projeto não encontrado", { status: 404 })
    }

    const interviewSession = await prisma.sb7InterviewSession.findFirst({
      where: { projectId, userId: user.id }
    })

    if (!interviewSession || !interviewSession.answers) {
      return new NextResponse("Entrevista pendente ou não encontrada", { status: 400 })
    }

    const answers = interviewSession.answers as Record<string, string>
    const tone = project.brandVoice || "direto"
    const language = project.language || "pt-BR"

    // Inicializa o tracking de execução Premium
    const premiumRun = await prisma.premiumAppRun.create({
      data: {
        userId: user.id,
        appId: "storybrand-strategy-generator",
        artifactType: "sb7_brand_strategy",
        artifactStatus: "pending"
      }
    })

    let accumulatedCost = 0
    let accumulatedLatency = 0

    // FASE 1: brandscript_agent (Creator) -> Gera BrandScript + One-liner
    const brandScriptPrompt = `Você é o brandscript_agent do mini-app Clareza.
Sua função é ler as respostas da entrevista SB7 fornecidas pelo usuário e consolidar o BrandScript oficial estruturado e o One-Liner da marca.
Regra metodológica absoluta: O cliente é o Herói da história e a marca do usuário é o Guia. Não inverta os papéis!
O tom deve ser: ${tone}.
O idioma de saída deve ser: ${language}.

Responda estritamente em formato JSON com o seguinte schema:
{
  "one_liner": "Frase de impacto no formato clássico StoryBrand: Problema -> Solução -> Sucesso/Transformação.",
  "hero_want": "O desejo único e específico do cliente.",
  "problem_external": "O problema prático tangível.",
  "problem_internal": "Como o cliente se sente.",
  "problem_philosophical": "Por que isso é injusto.",
  "villain": "O vilão que personifica o problema.",
  "empathy": "Mensagem empática do guia.",
  "authority": [{"type": "Depoimentos / Certificações / Números", "value": "Texto da autoridade"}],
  "plan_process": ["Passo 1 do plano", "Passo 2 do plano", "Passo 3 do plano"],
  "plan_agreement": ["Promessa ou acordo 1", "Promessa ou acordo 2"],
  "cta_direct": "Chamada principal para ação direta.",
  "cta_transitional": "Oferta gratuita de baixo risco.",
  "stakes": ["O que ele perde 1", "O que ele perde 2"],
  "success": {
    "concrete": "O final feliz material e prático.",
    "identity": "Como o herói se sente transformado em sua identidade."
  }
}`

    const start1 = Date.now()
    const brandScriptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: brandScriptPrompt },
        { role: "user", content: `Respostas da Entrevista: ${JSON.stringify(answers)}` }
      ]
    })
    const lat1 = Date.now() - start1
    const tokens1 = brandScriptResponse.usage
    const inTokens1 = tokens1?.prompt_tokens || 0
    const outTokens1 = tokens1?.completion_tokens || 0
    const cost1 = (inTokens1 * 0.00000015) + (outTokens1 * 0.00000060) // gpt-4o-mini rates

    accumulatedCost += cost1
    accumulatedLatency += lat1

    await prisma.premiumLlmCall.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        appId: "storybrand-strategy-generator",
        phase: "brandscript_generation",
        providerSlug: "openai",
        modelId: "gpt-4o-mini",
        inputTokens: inTokens1,
        outputTokens: outTokens1,
        actualCost: cost1,
        latencyMs: lat1,
        status: "SUCCESS"
      }
    })

    const bsResult = JSON.parse(brandScriptResponse.choices[0].message?.content || "{}")

    // FASE 2: collateral_agent (Creator) -> Gera copy da Homepage, Isca digital e E-mails
    const collateralPrompt = `Você é o collateral_agent do mini-app Clareza.
Sua tarefa é ler o BrandScript estruturado e produzir os criativos de copy para o funil.
Tom de escrita: ${tone}.
Idioma: ${language}.

Gere:
1. homepage_wireframe: Copy seção a seção do site na ordem canônica StoryBrand (Header, As Apostas, Proposta de Valor, O Guia, O Plano, CTA, Isca digital, Junk drawer/Rodapé). Devolva em lista com 'section' e 'copy'.
2. lead_generator: Título da isca digital, formato e 4 tópicos do outline.
3. nurture_emails: 4 e-mails de nutrição agregando valor (Assunto e Corpo).
4. sales_emails: 3 e-mails de vendas diretas chamando para o CTA (Assunto e Corpo).

Responda estritamente em formato JSON com o seguinte schema:
{
  "homepage_wireframe": [{"section": "Header", "copy": "..."}],
  "lead_generator": {"title": "", "format": "PDF / Ebook / Checklist", "outline": ["Tópico 1", "Tópico 2", "Tópico 3", "Tópico 4"]},
  "nurture_emails": [{"subject": "...", "body": "..."}],
  "sales_emails": [{"subject": "...", "body": "..."}]
}`

    const start2 = Date.now()
    const collateralResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: collateralPrompt },
        { role: "user", content: `BrandScript de Referência: ${JSON.stringify(bsResult)}` }
      ]
    })
    const lat2 = Date.now() - start2
    const tokens2 = collateralResponse.usage
    const inTokens2 = tokens2?.prompt_tokens || 0
    const outTokens2 = tokens2?.completion_tokens || 0
    const cost2 = (inTokens2 * 0.00000015) + (outTokens2 * 0.00000060)

    accumulatedCost += cost2
    accumulatedLatency += lat2

    await prisma.premiumLlmCall.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        appId: "storybrand-strategy-generator",
        phase: "collateral_generation",
        providerSlug: "openai",
        modelId: "gpt-4o-mini",
        inputTokens: inTokens2,
        outputTokens: outTokens2,
        actualCost: cost2,
        latencyMs: lat2,
        status: "SUCCESS"
      }
    })

    const collateralResult = JSON.parse(collateralResponse.choices[0].message?.content || "{}")

    // FASE 3 & 4: compliance_agent e quality_agent (Reviewers)
    const reviewerPrompt = `Você é o quality_and_compliance_agent do mini-app Clareza.
Sua tarefa é ler toda a estratégia gerada (BrandScript e materiais) e:
1. Validar se a marca nunca é o herói e se o SB7 foi preenchido corretamente.
2. Identificar promessas excessivas ou claims proibidos e inserir alertas/warnings.
3. Montar um checklist de qualidade final.

Responda estritamente em formato JSON:
{
  "approved": true,
  "warnings": ["Alerta de claim ou aviso regulatório caso o nicho envolva saúde, finanças ou imigração"],
  "quality_checklist": ["Item 1 do checklist validado", "Item 2..."]
}`

    const start3 = Date.now()
    const reviewerResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: reviewerPrompt },
        { role: "user", content: `BrandScript: ${JSON.stringify(bsResult)}\n\nMateriais: ${JSON.stringify(collateralResult)}` }
      ]
    })
    const lat3 = Date.now() - start3
    const tokens3 = reviewerResponse.usage
    const inTokens3 = tokens3?.prompt_tokens || 0
    const outTokens3 = tokens3?.completion_tokens || 0
    const cost3 = (inTokens3 * 0.00000015) + (outTokens3 * 0.00000060)

    accumulatedCost += cost3
    accumulatedLatency += lat3

    await prisma.premiumLlmCall.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        appId: "storybrand-strategy-generator",
        phase: "review",
        providerSlug: "openai",
        modelId: "gpt-4o-mini",
        inputTokens: inTokens3,
        outputTokens: outTokens3,
        actualCost: cost3,
        latencyMs: lat3,
        status: "SUCCESS"
      }
    })

    const reviewResult = JSON.parse(reviewerResponse.choices[0].message?.content || "{}")

    // PERSISTÊNCIA NO BANCO DE DADOS
    const lastBrandScript = await prisma.sb7BrandScript.findFirst({
      where: { projectId },
      orderBy: { version: "desc" }
    })

    const nextVersion = lastBrandScript ? lastBrandScript.version + 1 : 1

    await prisma.sb7BrandScript.updateMany({
      where: { projectId },
      data: { isCurrent: false }
    })

    const brandScriptRecord = await prisma.sb7BrandScript.create({
      data: {
        projectId,
        userId: user.id,
        version: nextVersion,
        heroWant: bsResult.hero_want || answers.hero,
        problemExternal: bsResult.problem_external || answers.problem_external,
        problemInternal: bsResult.problem_internal || answers.problem_internal,
        problemPhilosophical: bsResult.problem_philosophical || answers.problem_philosophical,
        villain: bsResult.villain || answers.villain,
        empathy: bsResult.empathy || answers.empathy,
        authority: bsResult.authority || [],
        planProcess: bsResult.plan_process || [],
        planAgreement: bsResult.plan_agreement || [],
        ctaDirect: bsResult.cta_direct || answers.cta_direct,
        ctaTransitional: bsResult.cta_transitional || answers.cta_transitional,
        stakes: bsResult.stakes || [],
        success: bsResult.success || {},
        oneLiner: bsResult.one_liner || "",
        isCurrent: true
      }
    })

    await prisma.sb7Collateral.create({
      data: {
        brandScriptId: brandScriptRecord.id,
        userId: user.id,
        wireframe: collateralResult.homepage_wireframe || [],
        leadGenerator: collateralResult.lead_generator || {},
        nurtureEmails: collateralResult.nurture_emails || [],
        salesEmails: collateralResult.sales_emails || []
      }
    })

    await prisma.sb7Project.update({
      where: { id: projectId },
      data: { status: "generated" }
    })

    // Atualiza a execução Premium com valores consolidados
    await prisma.premiumAppRun.update({
      where: { id: premiumRun.id },
      data: {
        artifactStatus: "completed",
        totalActualCost: accumulatedCost,
        totalLatencyMs: accumulatedLatency,
        totalLlmCalls: 3
      }
    })

    // Registra evento no histórico geral de execuções
    await prisma.toolExecution.create({
      data: {
        userId: user.id,
        toolSlug: "storybrand-strategy-generator",
        inputJson: answers,
        outputJson: { bsResult, collateralResult, reviewResult }
      }
    })

    return NextResponse.json({ success: true, projectId })
  } catch (err: any) {
    console.error("[GENERATION_ORCHESTRATOR] Error:", err)
    return new NextResponse(err.message || "Erro no processamento da IA", { status: 500 })
  }
}
