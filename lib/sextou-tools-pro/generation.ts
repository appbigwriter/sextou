import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { buildSextouToolsProUserPrompt, resolveSextouToolsProPrompt } from "@/lib/sextou-tools-pro/prompts"
import {
  createSextouToolsProGeneration,
  getSextouToolsProGenerationById,
} from "@/lib/sextou-tools-pro/history"
import {
  assertSextouToolsProUsageAllowed,
  recordSextouToolsProUsageEvent,
} from "@/lib/sextou-tools-pro/usage"
import { getSextouToolsProDefinition } from "@/lib/sextou-tools-pro/schemas"

function pickTitle(output: Record<string, unknown>, fallback: string) {
  const maybeTitle = output.title
  return typeof maybeTitle === "string" && maybeTitle.trim() ? maybeTitle.trim() : fallback
}

function buildOutputText(output: Record<string, unknown>) {
  return Object.values(output)
    .map((value) => {
      if (typeof value === "string") {
        return value
      }

      return JSON.stringify(value)
    })
    .join("\n\n")
}

function extractResponseText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text
  }

  const messageText = payload?.output?.find?.((item: any) => item.type === "message")?.content?.find?.(
    (contentItem: any) => contentItem.type === "output_text"
  )?.text

  return typeof messageText === "string" ? messageText : ""
}

async function callOpenAiStructuredOutput(options: {
  model: string
  systemPrompt: string
  userPrompt: string
  schemaName: string
  schema: Record<string, unknown>
}) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("openai-key-missing")
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      input: options.userPrompt,
      instructions: options.systemPrompt,
      max_output_tokens: 1200,
      text: {
        format: {
          type: "json_schema",
          name: options.schemaName,
          schema: options.schema,
          strict: true,
        },
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`openai-response-error:${response.status}:${errorText}`)
  }

  const payload = await response.json()
  const responseText = extractResponseText(payload)

  if (!responseText) {
    throw new Error("openai-empty-structured-output")
  }

  return {
    parsedOutput: JSON.parse(responseText) as Record<string, unknown>,
    model: payload.model || options.model,
    raw: payload,
  }
}

function buildMockOutput(appId: string, input: Record<string, unknown>) {
  const primary = Object.values(input)[0]
  const primaryText = typeof primary === "string" && primary.trim() ? primary.trim() : "Seu negocio"

  if (appId === "respostas-prontas-whatsapp") {
    return {
      title: `Resposta para ${primaryText}`,
      shortReply: `Oi! Recebi sua mensagem sobre ${primaryText} e posso te responder com mais detalhes ainda hoje.`,
      fullReply: `Oi! Obrigado pela mensagem sobre ${primaryText}. Posso te explicar as opcoes, prazos e proximo passo de um jeito bem direto para facilitar sua decisao.`,
      warmerReply: `Oi! Que bom receber sua mensagem. Sobre ${primaryText}, consigo te orientar com calma e te mandar a melhor opcao para o seu caso.`,
      firmerReply: `Oi! Para avancarmos com ${primaryText}, preciso confirmar os detalhes principais e te envio a orientacao objetiva ainda hoje.`,
      ctaReply: `Oi! Me confirma os detalhes de ${primaryText} e eu ja te mando a melhor opcao por aqui.`,
      nextActions: ["Salvar como template", "Criar follow-up", "Criar FAQ do negocio"],
    }
  }

  if (appId === "gerador-oferta-irresistivel") {
    return {
      title: `Oferta para ${primaryText}`,
      offerName: `Oferta ${primaryText}`,
      headline: `Uma forma mais clara de vender ${primaryText}`,
      promise: `Ajude seu cliente a entender o valor de ${primaryText} sem enrolacao.`,
      structure: ["Oferta principal", "Bonus claro", "Prazo ou disponibilidade", "CTA objetivo"],
      suggestedBonuses: ["Atendimento prioritario", "Checklist inicial", "Revisao rapida"],
      suggestedGuarantee: "Garantia de alinhamento inicial com o cliente antes da execucao.",
      ethicalUrgency: "Vagas limitadas nesta semana para manter qualidade no atendimento.",
      whatsappCta: `Me chama no WhatsApp e eu te explico como funciona ${primaryText}.`,
      shortPostVersion: `Oferta pronta para ${primaryText} com beneficio claro, bonus e CTA direto.`,
      nextActions: ["Criar anuncio local", "Criar roteiro de Reels", "Criar proposta comercial"],
    }
  }

  if (appId === "calendario-conteudo-7-dias") {
    return {
      title: `Calendario semanal para ${primaryText}`,
      weekLabel: "Semana atual",
      posts: Array.from({ length: 7 }, (_, index) => ({
        day: `Dia ${index + 1}`,
        theme: `Tema ${index + 1} de ${primaryText}`,
        format: "Post curto",
        caption: `Legenda curta ${index + 1} para ${primaryText}.`,
        cta: "Me chama para saber mais.",
        visualIdea: "Foto simples ou bastidor do servico.",
        hashtags: ["#brasileirosnoseua", "#negociolocal"],
      })),
      nextActions: ["Gerar roteiro de Reels", "Criar anuncio local", "Criar resposta para comentarios"],
    }
  }

  if (appId === "proposta-comercial-one-page") {
    return {
      title: `Proposta para ${primaryText}`,
      clientContext: `Contexto resumido do cliente para ${primaryText}.`,
      proposedSolution: `Solucao proposta de forma clara para ${primaryText}.`,
      scopeBullets: ["Escopo item 1", "Escopo item 2", "Escopo item 3"],
      timeline: "Prazo inicial de execucao conforme alinhamento.",
      investment: "Investimento sob consulta ou conforme escopo definido.",
      nextSteps: ["Confirmar interesse", "Ajustar detalhes finais", "Agendar inicio"],
      deliveryMessage: `Oi! Segue uma proposta objetiva para ${primaryText}. Se fizer sentido, avancamos para o proximo passo.`,
      nextActions: ["Criar follow-up da proposta", "Criar oferta irresistivel", "Criar briefing visual"],
    }
  }

  return {
    title: `Roteiro para ${primaryText}`,
    openingHook: `Voce ainda nao percebeu isso sobre ${primaryText}?`,
    spokenScript: ["Gancho rapido", "Explicacao central", "Fechamento com CTA"],
    sceneSuggestions: ["Cena 1", "Cena 2", "Cena 3"],
    onScreenText: ["Texto curto 1", "Texto curto 2"],
    finalCta: "Me chama no WhatsApp para eu te mostrar como funciona.",
    publishDescription: `Descricao curta para publicar sobre ${primaryText}.`,
    nextActions: ["Criar legenda do post", "Criar oferta associada", "Criar follow-up"],
  }
}

async function ensurePromptTemplateRecord(options: {
  appId: string
  version: string
  model: string
  schemaName: string
  systemPrompt: string
  schema: Record<string, unknown>
}) {
  await prisma.sextouToolsProPromptTemplate.upsert({
    where: {
      appId_version: {
        appId: options.appId,
        version: options.version,
      },
    },
    update: {
      model: options.model,
      schemaName: options.schemaName,
      systemPrompt: options.systemPrompt,
      schemaJson: options.schema as Prisma.InputJsonValue,
      isActive: true,
    },
    create: {
      appId: options.appId,
      version: options.version,
      model: options.model,
      schemaName: options.schemaName,
      systemPrompt: options.systemPrompt,
      schemaJson: options.schema as Prisma.InputJsonValue,
      isActive: true,
    },
  }).catch(() => null)
}

export async function generateSextouToolsProResult(options: {
  user: {
    id: string
    fullName: string
    businessName: string
    city?: string
    state?: string
  }
  appId: string
  input: Record<string, unknown>
  language?: string
  sourceGenerationId?: string
  sourceAction?: "GENERATE" | "REGENERATE" | "DUPLICATE"
}) {
  const definition = getSextouToolsProDefinition(options.appId)

  if (!definition) {
    throw new Error("unsupported-app")
  }

  const parsedInput = definition.inputSchema.parse(options.input)
  const sourceAction = options.sourceAction || "GENERATE"

  await assertSextouToolsProUsageAllowed(options.user.id, options.sourceGenerationId, sourceAction)

  if (options.sourceGenerationId) {
    const sourceGeneration = await getSextouToolsProGenerationById(options.user.id, options.sourceGenerationId)

    if (!sourceGeneration) {
      throw new Error("generation-not-found")
    }
  }

  const prompt = await resolveSextouToolsProPrompt(options.appId)

  if (!prompt) {
    throw new Error("unsupported-app")
  }

  await ensurePromptTemplateRecord({
    appId: options.appId,
    version: prompt.version,
    model: prompt.model,
    schemaName: prompt.schemaName,
    systemPrompt: prompt.systemPrompt,
    schema: prompt.schema,
  })

  const userPrompt = buildSextouToolsProUserPrompt({
    appId: options.appId,
    input: parsedInput,
    profile: options.user,
  })

  let model = prompt.model
  let parsedOutput: Record<string, unknown>
  let provider = "openai"

  try {
    const providerResponse = await callOpenAiStructuredOutput({
      model: prompt.model,
      systemPrompt: prompt.systemPrompt,
      userPrompt,
      schemaName: prompt.schemaName,
      schema: prompt.schema,
    })

    model = providerResponse.model
    parsedOutput = providerResponse.parsedOutput
  } catch (error) {
    if (error instanceof Error && error.message === "openai-key-missing") {
      provider = "mock"
      parsedOutput = buildMockOutput(options.appId, parsedInput)
    } else {
      throw error
    }
  }

  const validatedOutput = definition.outputSchema.parse(parsedOutput)
  const generation = await createSextouToolsProGeneration({
    userId: options.user.id,
    appId: options.appId,
    title: pickTitle(validatedOutput, `Resultado ${options.appId}`),
    inputData: parsedInput as Prisma.InputJsonValue,
    outputData: validatedOutput as Prisma.InputJsonValue,
    outputText: buildOutputText(validatedOutput),
    metadataJson: {
      provider,
      nextActions:
        Array.isArray((validatedOutput as { nextActions?: unknown }).nextActions)
          ? (validatedOutput as { nextActions: string[] }).nextActions
          : [],
    } as Prisma.InputJsonValue,
    language: options.language || "pt-BR",
    model,
    promptVersion: prompt.version,
    sourceAction,
    sourceGenerationId: options.sourceGenerationId,
  })

  if (sourceAction !== "DUPLICATE") {
    await recordSextouToolsProUsageEvent(options.user.id, options.appId, sourceAction, options.sourceGenerationId || generation.id)
  }

  return generation
}
