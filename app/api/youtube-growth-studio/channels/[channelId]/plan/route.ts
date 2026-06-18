import { NextResponse } from "next/server"
import { requireSextouToolsPremiumApiUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Simulação de chamada Anthropic utilizando OpenRouter como fallback ou chamadas mock/direct caso falhe
async function callLlmWithFallback({
  systemPrompt,
  userPrompt,
  preferredProvider = "anthropic"
}: {
  systemPrompt: string
  userPrompt: string
  preferredProvider?: "anthropic" | "openai"
}) {
  const start = Date.now()
  let providerUsed = preferredProvider
  let modelUsed = preferredProvider === "anthropic" ? "claude-3-5-sonnet" : "gpt-4o-mini"
  let responseText = ""
  let inputTokens = 0
  let outputTokens = 0
  let cost = 0

  try {
    if (preferredProvider === "anthropic" && process.env.OPENROUTER_API_KEY) {
      // Usar OpenRouter para simular chamada Claude da Anthropic
      const orClient = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      })

      const res = await orClient.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })

      responseText = res.choices[0].message?.content || "{}"
      inputTokens = res.usage?.prompt_tokens || 0
      outputTokens = res.usage?.completion_tokens || 0
      // Claude-3.5-Sonnet pricing
      cost = (inputTokens * 0.000003) + (outputTokens * 0.000015)
    } else {
      // Fallback imediato para OpenAI
      throw new Error("Provedor Anthropic não disponível no momento")
    }
  } catch (error: any) {
    console.warn("[FALLBACK] Erro ao chamar Anthropic, caindo para OpenAI:", error.message)
    providerUsed = "openai"
    modelUsed = "gpt-4o-mini"

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })

    responseText = res.choices[0].message?.content || "{}"
    inputTokens = res.usage?.prompt_tokens || 0
    outputTokens = res.usage?.completion_tokens || 0
    cost = (inputTokens * 0.00000015) + (outputTokens * 0.00000060)
  }

  return {
    responseText,
    providerUsed,
    modelUsed,
    inputTokens,
    outputTokens,
    cost,
    latencyMs: Date.now() - start
  }
}

export async function POST(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const proUser = await requireSextouToolsPremiumApiUser()
    if (proUser === null) {
      return new NextResponse("Não autorizado", { status: 401 })
    }
    if (proUser === false) {
      return new NextResponse("Acesso restrito ao Pacote PRO Premium", { status: 403 })
    }
    const user = proUser

    // Validação de limite diário simplificado da suite
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const runsCount = await prisma.premiumAppRun.count({
      where: {
        userId: user.id,
        appId: "youtube-growth-studio",
        createdAt: { gte: startOfDay }
      }
    })

    if (runsCount >= 20) {
      return new NextResponse("Limite diário de geração premium atingido (máx. 20 planos/dia)", { status: 429 })
    }

    const channelId = params.channelId

    const channel = await prisma.youtubeChannel.findFirst({
      where: { id: channelId, userId: user.id }
    })

    if (!channel) {
      return new NextResponse("Canal não encontrado", { status: 404 })
    }

    const bodyData = await req.json()
    const {
      targetAudience = channel.targetAudience,
      tone = channel.tone || "Autoridade amigável",
      goal = channel.goal || "Vender serviço",
      language = channel.language || "pt-BR",
      weeklyFrequency = channel.weeklyFrequency || 2,
      includeShorts = channel.includeShorts,
      includeLives = channel.includeLives,
      focusKeywords = channel.focusKeywords,
      contentRestrictions = channel.contentRestrictions
    } = bodyData

    // Atualiza as preferências no canal se fornecidas
    await prisma.youtubeChannel.update({
      where: { id: channelId },
      data: {
        targetAudience,
        tone,
        goal,
        language,
        weeklyFrequency,
        includeShorts,
        includeLives,
        focusKeywords,
        contentRestrictions
      }
    })

    // 1. Simulação ou busca de tendências regionais (Trend Agent)
    const now = new Date()
    let trends = await prisma.youtubeTrendsCache.findFirst({
      where: {
        niche: channel.niche,
        city: channel.city || "",
        expiresAt: { gte: now }
      }
    })

    let trendTopics = []
    if (trends) {
      trendTopics = (trends.trendData as any).topics || []
    } else {
      const trendPrompt = `Você é o trend_agent. Pesquise e retorne os 5 tópicos em alta e dúvidas mais comuns sobre o nicho '${channel.niche}' na localidade '${channel.city || "Estados Unidos"}' para o público brasileiro residente nos EUA.
Retorne um JSON contendo a chave 'topics' com um array de strings.`

      const trendRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: trendPrompt }]
      })

      const trendJson = JSON.parse(trendRes.choices[0].message?.content || "{}")
      trendTopics = trendJson.topics || []

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      await prisma.youtubeTrendsCache.upsert({
        where: {
          niche_city: {
            niche: channel.niche,
            city: channel.city || ""
          }
        },
        update: {
          trendData: { topics: trendTopics },
          expiresAt
        },
        create: {
          niche: channel.niche,
          city: channel.city || "",
          trendData: { topics: trendTopics },
          expiresAt
        }
      })
    }

    // Inicializa tracking premium
    const premiumRun = await prisma.premiumAppRun.create({
      data: {
        userId: user.id,
        appId: "youtube-growth-studio",
        artifactType: "youtube_content_plan",
        artifactStatus: "pending"
      }
    })

    // 2. Chamar o planner_agent para gerar a estratégia e calendário de 30 dias (usando fallback lógico)
    const plannerSystemPrompt = `Você é o planner_agent do mini-app Premium YouTube Growth Studio AI.
Sua função é gerar o planejamento estratégico mensal de um canal comercial no YouTube para empreendedores brasileiros nos EUA.
O plano deve conter:
- Um resumo da estratégia do canal.
- O tema central do mês.
- 3 pilares principais de conteúdo.
- Um cronograma/calendário editorial de 30 dias de acordo com a frequência semanal solicitada: ${weeklyFrequency} vídeo(s) por semana.
- Se o usuário ativou includeShorts (${includeShorts}), inclua Shorts intercalados nas datas.
- Se o usuário ativou includeLives (${includeLives}), inclua Lives estrategicamente.

Idioma de saída: ${language}.
Tom do canal: ${tone}.

Responda estritamente em formato JSON com o seguinte schema:
{
  "strategy_summary": "Visão geral estratégica.",
  "monthly_theme": "Tema central do mês.",
  "content_pillars": ["Pilar 1", "Pilar 2", "Pilar 3"],
  "calendar": [
    {
      "day_number": 1,
      "item_type": "video|short|live|community_post",
      "working_title": "Título sugerido em tom chamativo.",
      "pillar": "Qual pilar pertence.",
      "goal": "lead|authority|sale",
      "hook_suggestion": "Gancho ou sugestão de abertura rápida."
    }
  ]
}`

    const plannerUserPrompt = `Nome do Canal: ${channel.channelName}
Nicho: ${channel.niche}
Cidade: ${channel.city || "Estados Unidos"}
Oferta Principal: ${channel.primaryOffer}
Público-alvo: ${JSON.stringify(targetAudience)}
Objetivo: ${goal}
Palavras-chave foco: ${JSON.stringify(focusKeywords)}
Restrições de conteúdo: ${JSON.stringify(contentRestrictions)}
Tendências locais detectadas: ${JSON.stringify(trendTopics)}`

    // Roteamento inteligente: Usa Anthropic (Claude) por padrão para planejamento
    const llmResult = await callLlmWithFallback({
      systemPrompt: plannerSystemPrompt,
      userPrompt: plannerUserPrompt,
      preferredProvider: "anthropic"
    })

    await prisma.premiumLlmCall.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        appId: "youtube-growth-studio",
        phase: "plan_generation",
        providerSlug: llmResult.providerUsed,
        modelId: llmResult.modelUsed,
        inputTokens: llmResult.inputTokens,
        outputTokens: llmResult.outputTokens,
        actualCost: llmResult.cost,
        latencyMs: llmResult.latencyMs,
        status: "SUCCESS"
      }
    })

    const result = JSON.parse(llmResult.responseText)

    // Salva o plano no banco de dados
    const plan = await prisma.youtubeContentPlan.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        channelId: channelId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        totalVideos: result.calendar.filter((c: any) => c.item_type === "video").length,
        totalShorts: result.calendar.filter((c: any) => c.item_type === "short").length,
        totalPosts: result.calendar.filter((c: any) => c.item_type === "community_post").length,
        strategySummary: result.strategy_summary,
        calendarJson: result,
        status: "draft"
      }
    })

    // Cria os placeholders de itens de conteúdo no calendário
    for (const item of result.calendar) {
      const scheduledDate = new Date()
      scheduledDate.setDate(now.getDate() + (item.day_number - 1))

      await prisma.youtubeContentItem.create({
        data: {
          planId: plan.id,
          itemType: item.item_type,
          scheduledDate,
          title: item.working_title,
          hook: item.hook_suggestion,
          cta: channel.primaryOffer
        }
      })
    }

    // Atualiza execução premium
    await prisma.premiumAppRun.update({
      where: { id: premiumRun.id },
      data: {
        artifactStatus: "completed",
        totalActualCost: llmResult.cost,
        totalLatencyMs: llmResult.latencyMs,
        totalLlmCalls: 1
      }
    })

    // Registra auditoria
    await prisma.toolExecution.create({
      data: {
        userId: user.id,
        toolSlug: "youtube-growth-studio",
        inputJson: { channelId, goal, weeklyFrequency },
        outputJson: { planId: plan.id }
      }
    })

    return NextResponse.json({ success: true, planId: plan.id })
  } catch (err: any) {
    console.error("[PLANNER_AGENT] Error:", err)
    return new NextResponse(err.message || "Erro interno", { status: 500 })
  }
}
