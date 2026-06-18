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
    const { sectionKey, instruction } = await req.json()

    if (!sectionKey || !instruction) {
      return new NextResponse("Faltando parâmetros de seção ou instrução", { status: 400 })
    }

    const project = await prisma.sb7Project.findFirst({
      where: { id: projectId, userId: user.id }
    })

    if (!project) {
      return new NextResponse("Projeto não encontrado", { status: 404 })
    }

    const currentBrandScript = await prisma.sb7BrandScript.findFirst({
      where: { projectId, isCurrent: true },
      include: { collaterals: true }
    })

    if (!currentBrandScript || !currentBrandScript.collaterals[0]) {
      return new NextResponse("Estratégia não gerada ainda", { status: 400 })
    }

    const collateral = currentBrandScript.collaterals[0]

    // Prepara prompts específicos por seção
    let systemPrompt = ""
    let userPrompt = ""
    let jsonSchema: any = null

    if (sectionKey === "oneLiner") {
      systemPrompt = `Você é o brandscript_agent. Sua tarefa é reescrever o One-liner do negócio de acordo com a instrução do usuário.
Retorne um JSON contendo a chave 'one_liner'.
Idioma: ${project.language}.`
      userPrompt = `Instrução: ${instruction}\n\nBrandScript Base: ${JSON.stringify(currentBrandScript)}`
      jsonSchema = {
        type: "object",
        properties: { one_liner: { type: "string" } },
        required: ["one_liner"],
        additionalProperties: false
      }
    } else if (sectionKey === "nurtureEmails") {
      systemPrompt = `Você é o collateral_agent. Sua tarefa é reescrever a sequência de 4 e-mails de nutrição com base na instrução de refinamento do usuário.
Retorne um JSON contendo a chave 'nurture_emails' com uma lista de objetos com 'subject' e 'body'.
Idioma: ${project.language}.`
      userPrompt = `Instrução: ${instruction}\n\nE-mails antigos: ${JSON.stringify(collateral.nurtureEmails)}`
      jsonSchema = {
        type: "object",
        properties: {
          nurture_emails: {
            type: "array",
            items: {
              type: "object",
              properties: { subject: { type: "string" }, body: { type: "string" } },
              required: ["subject", "body"]
            }
          }
        },
        required: ["nurture_emails"],
        additionalProperties: false
      }
    } else if (sectionKey === "salesEmails") {
      systemPrompt = `Você é o collateral_agent. Sua tarefa é reescrever a sequência de 3 e-mails de vendas com base na instrução do usuário.
Retorne um JSON contendo a chave 'sales_emails' com assunto e corpo.
Idioma: ${project.language}.`
      userPrompt = `Instrução: ${instruction}\n\nE-mails antigos: ${JSON.stringify(collateral.salesEmails)}`
      jsonSchema = {
        type: "object",
        properties: {
          sales_emails: {
            type: "array",
            items: {
              type: "object",
              properties: { subject: { type: "string" }, body: { type: "string" } },
              required: ["subject", "body"]
            }
          }
        },
        required: ["sales_emails"],
        additionalProperties: false
      }
    } else if (sectionKey === "wireframe") {
      systemPrompt = `Você é o collateral_agent. Sua tarefa é reescrever o wireframe do site de acordo com a instrução do usuário.
Retorne um JSON contendo 'homepage_wireframe' contendo a lista com 'section' e 'copy'.
Idioma: ${project.language}.`
      userPrompt = `Instrução: ${instruction}\n\nWireframe antigo: ${JSON.stringify(collateral.wireframe)}`
      jsonSchema = {
        type: "object",
        properties: {
          homepage_wireframe: {
            type: "array",
            items: {
              type: "object",
              properties: { section: { type: "string" }, copy: { type: "string" } },
              required: ["section", "copy"]
            }
          }
        },
        required: ["homepage_wireframe"],
        additionalProperties: false
      }
    } else if (sectionKey === "leadGenerator") {
      systemPrompt = `Você é o collateral_agent. Sua tarefa é reescrever a isca digital (título, formato, outline) de acordo com a instrução do usuário.
Retorne um JSON com a chave 'lead_generator'.`
      userPrompt = `Instrução: ${instruction}\n\nIsca antiga: ${JSON.stringify(collateral.leadGenerator)}`
      jsonSchema = {
        type: "object",
        properties: {
          lead_generator: {
            type: "object",
            properties: {
              title: { type: "string" },
              format: { type: "string" },
              outline: { type: "array", items: { type: "string" } }
            },
            required: ["title", "format", "outline"]
          }
        },
        required: ["lead_generator"],
        additionalProperties: false
      }
    } else {
      return new NextResponse("Seção não suportada", { status: 400 })
    }

    // Inicializa o tracking de execução Premium
    const premiumRun = await prisma.premiumAppRun.create({
      data: {
        userId: user.id,
        appId: "storybrand-strategy-generator",
        artifactType: "sb7_partial_regeneration",
        artifactStatus: "pending"
      }
    })

    // Chama IA para refinar a seção
    const start1 = Date.now()
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
    const lat1 = Date.now() - start1
    const tokens1 = response.usage
    const inTokens1 = tokens1?.prompt_tokens || 0
    const outTokens1 = tokens1?.completion_tokens || 0
    const cost1 = (inTokens1 * 0.00000015) + (outTokens1 * 0.00000060)

    await prisma.premiumLlmCall.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        appId: "storybrand-strategy-generator",
        phase: `regenerate_${sectionKey}`,
        providerSlug: "openai",
        modelId: "gpt-4o-mini",
        inputTokens: inTokens1,
        outputTokens: outTokens1,
        actualCost: cost1,
        latencyMs: lat1,
        status: "SUCCESS"
      }
    })

    const result = JSON.parse(response.choices[0].message?.content || "{}")

    const nextVersion = currentBrandScript.version + 1

    await prisma.sb7BrandScript.updateMany({
      where: { projectId },
      data: { isCurrent: false }
    })

    const updatedOneLiner = sectionKey === "oneLiner" ? result.one_liner : currentBrandScript.oneLiner

    const newBrandScript = await prisma.sb7BrandScript.create({
      data: {
        projectId,
        userId: user.id,
        version: nextVersion,
        heroWant: currentBrandScript.heroWant,
        problemExternal: currentBrandScript.problemExternal,
        problemInternal: currentBrandScript.problemInternal,
        problemPhilosophical: currentBrandScript.problemPhilosophical,
        villain: currentBrandScript.villain,
        empathy: currentBrandScript.empathy,
        authority: currentBrandScript.authority ?? [],
        planProcess: currentBrandScript.planProcess ?? [],
        planAgreement: currentBrandScript.planAgreement ?? [],
        ctaDirect: currentBrandScript.ctaDirect,
        ctaTransitional: currentBrandScript.ctaTransitional,
        stakes: currentBrandScript.stakes ?? [],
        success: currentBrandScript.success ?? {},
        oneLiner: updatedOneLiner,
        isCurrent: true
      }
    })

    const updatedWireframe = sectionKey === "wireframe" ? result.homepage_wireframe : (collateral.wireframe ?? [])
    const updatedLeadGen = sectionKey === "leadGenerator" ? result.lead_generator : (collateral.leadGenerator ?? {})
    const updatedNurtureEmails = sectionKey === "nurtureEmails" ? result.nurture_emails : (collateral.nurtureEmails ?? [])
    const updatedSalesEmails = sectionKey === "salesEmails" ? result.sales_emails : (collateral.salesEmails ?? [])

    await prisma.sb7Collateral.create({
      data: {
        brandScriptId: newBrandScript.id,
        userId: user.id,
        wireframe: updatedWireframe,
        leadGenerator: updatedLeadGen,
        nurtureEmails: updatedNurtureEmails,
        salesEmails: updatedSalesEmails
      }
    })

    // Atualiza a execução Premium com valores consolidados
    await prisma.premiumAppRun.update({
      where: { id: premiumRun.id },
      data: {
        artifactStatus: "completed",
        totalActualCost: cost1,
        totalLatencyMs: lat1,
        totalLlmCalls: 1
      }
    })

    // Registra evento no histórico geral de execuções
    await prisma.toolExecution.create({
      data: {
        userId: user.id,
        toolSlug: "storybrand-strategy-generator",
        inputJson: { sectionKey, instruction },
        outputJson: { result }
      }
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[REGENERATE_SECTION] Error:", err)
    return new NextResponse(err.message || "Erro no processamento da IA", { status: 500 })
  }
}
