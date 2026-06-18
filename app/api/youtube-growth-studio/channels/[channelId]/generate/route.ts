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
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })

      responseText = res.choices[0].message?.content || "{}"
      inputTokens = res.usage?.prompt_tokens || 0
      outputTokens = res.usage?.completion_tokens || 0
      cost = (inputTokens * 0.000003) + (outputTokens * 0.000015)
    } else {
      throw new Error("Provedor Anthropic não disponível no momento")
    }
  } catch (error: any) {
    console.warn("[FALLBACK] Erro ao chamar Anthropic, caindo para OpenAI:", error.message)
    providerUsed = "openai"
    modelUsed = "gpt-4o-mini"

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
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

    const bodyData = await req.json()
    const { planId, itemId } = bodyData

    if (!planId) {
      return new NextResponse("planId é obrigatório", { status: 400 })
    }

    const plan = await prisma.youtubeContentPlan.findFirst({
      where: { id: planId, userId: user.id },
      include: { channel: true }
    })

    if (!plan) {
      return new NextResponse("Plano não encontrado", { status: 404 })
    }

    // Criar um novo run premium
    const premiumRun = await prisma.premiumAppRun.create({
      data: {
        userId: user.id,
        appId: "youtube-growth-studio",
        artifactType: "youtube_content_generation",
        artifactStatus: "pending"
      }
    })

    // Se um itemId específico foi fornecido, geramos apenas ele. Senão, geramos todos os itens pendentes do plano.
    const items = await prisma.youtubeContentItem.findMany({
      where: {
        planId: plan.id,
        ...(itemId ? { id: itemId } : {})
      }
    })

    if (items.length === 0) {
      return NextResponse.json({ success: true, message: "Nenhum item pendente para gerar." })
    }

    let totalCost = 0
    let totalLatency = 0

    for (const item of items) {
      // Prompt para o scriptwriter_agent, seo_agent, social_adapter_agent e visual_brief_agent em uma única chamada otimizada para o item.
      const orquestradorSystemPrompt = `Você é o orquestrador de conteúdo premium do YouTube Growth Studio AI.
Sua função é gerar todos os artefatos textuais e visuais (roteiro, SEO pack, redes sociais, briefing de thumbnail) para um conteúdo específico do canal do YouTube.

Informações do Canal:
- Nome: ${plan.channel.channelName}
- Nicho: ${plan.channel.niche}
- Cidade: ${plan.channel.city || "Estados Unidos"}
- Oferta Principal: ${plan.channel.primaryOffer}
- Público-alvo: ${JSON.stringify(plan.channel.targetAudience)}
- Tom de Voz: ${plan.channel.tone || "Autoridade amigável"}
- Restrições de Conteúdo: ${JSON.stringify(plan.channel.contentRestrictions)}

Informações do Item:
- Tipo: ${item.itemType} (video, short, live, community_post)
- Título Provisório: ${item.title}
- Gancho Sugerido: ${item.hook}

Gere uma resposta estritamente em formato JSON contendo as chaves a seguir dependendo do tipo de item:

Para itemType = "video" ou "live":
{
  "title": "Título definitivo otimizado para clique e SEO",
  "hook": "Gancho de abertura de alto impacto para os primeiros 5 segundos",
  "script_json": {
    "intro": "Introdução cativante para prender a atenção",
    "sections": [
      {
        "title": "Subtítulo da Seção 1",
        "talking_points": ["Tópico a falar 1", "Tópico a falar 2"],
        "duration_sec": 60
      }
    ],
    "cta": "Chamada para ação clara relacionada com a Oferta Principal",
    "closing": "Fechamento profissional direcionando para curtir/inscrever e assistir outro vídeo",
    "broll_suggestions": ["Sugestão de cena/corte visual 1", "Sugestão 2"],
    "total_duration_sec": 480
  },
  "seo_pack": {
    "titles": [
      { "variant": "curiosidade", "text": "Título focado em curiosidade" },
      { "variant": "autoridade", "text": "Título focado em autoridade" },
      { "variant": "seo", "text": "Título com palavras-chave foco" }
    ],
    "description": {
      "summary": "Resumo detalhado com parágrafos persuasivos otimizados para busca.",
      "timestamps": ["0:00 - Introdução", "1:30 - Subtítulo da Seção 1"],
      "links": ["Link para site / WhatsApp"],
      "keywords": ["palavra-chave 1", "palavra-chave 2"]
    },
    "hashtags": {
      "primary": ["hashtag1", "hashtag2"],
      "local": ["hashtagCidade"],
      "niche": ["hashtagNicho"]
    }
  },
  "social_pack": {
    "instagram": {
      "caption": "Legenda persuasiva do Instagram baseada no tema do vídeo.",
      "carousel_slides": ["Slide 1: Título", "Slide 2: Conteúdo", "Slide 3: CTA"]
    },
    "facebook": { "post": "Post persuasivo para grupos de Facebook locais nos EUA." },
    "linkedin": { "post": "Post com viés de liderança intelectual e autoridade comercial." },
    "whatsapp": { "message": "Texto curto para lista de transmissão ou grupos." },
    "youtube_community": { "post": "Post enquete ou teaser para a aba Comunidade do YouTube." }
  },
  "captions_json": {
    "short": "Legenda rápida de 1 linha.",
    "medium": "Legenda descritiva com bullet points.",
    "long": "Legenda longa no estilo microblog."
  },
  "thumbnail_brief": {
    "background_description": "Descrição do cenário de fundo ideal",
    "text_on_screen": "Frase de impacto curta (máximo 4 palavras)",
    "expression_and_actor": "Posição e expressão recomendada da pessoa na foto",
    "color_palette_suggestion": "Esquema de cores sugerido"
  }
}

Para itemType = "short":
Gere uma versão condensada apropriada para vídeos de até 60 segundos, mantendo a mesma estrutura de JSON porém simplificando o script_json para conter apenas "intro", "sections" rápidas de 15 segundos cada e "cta" direto.

Para itemType = "community_post":
Gere um JSON contendo principalmente "title", "seo_pack" e "social_pack", com foco no engajamento direto por texto.

Certifique-se de escrever o conteúdo no idioma '${plan.channel.language || "pt-BR"}'. Respeite estritamente as restrições: ${JSON.stringify(plan.channel.contentRestrictions)}.`

      // Roteamento inteligente: Usa Anthropic (Claude) por padrão para roteiros
      const llmResult = await callLlmWithFallback({
        systemPrompt: orquestradorSystemPrompt,
        userPrompt: `Gerar conteúdo detalhado para o título: ${item.title}`,
        preferredProvider: "anthropic"
      })

      const data = JSON.parse(llmResult.responseText)
      totalCost += llmResult.cost
      totalLatency += llmResult.latencyMs

      // Registrar chamada Premium LLM individual
      await prisma.premiumLlmCall.create({
        data: {
          premiumRunId: premiumRun.id,
          userId: user.id,
          appId: "youtube-growth-studio",
          phase: `generate_item_${item.itemType}`,
          providerSlug: llmResult.providerUsed,
          modelId: llmResult.modelUsed,
          inputTokens: llmResult.inputTokens,
          outputTokens: llmResult.outputTokens,
          actualCost: llmResult.cost,
          latencyMs: llmResult.latencyMs,
          status: "SUCCESS"
        }
      })

      // Salva os dados gerados de volta no item de conteúdo
      await prisma.youtubeContentItem.update({
        where: { id: item.id },
        data: {
          title: data.title || item.title,
          hook: data.hook || item.hook,
          scriptJson: data.script_json || null,
          seoPack: data.seo_pack || null,
          socialPack: data.social_pack || null,
          captionsJson: data.captions_json || null,
          thumbnailBrief: data.thumbnail_brief || null
        }
      })
    }

    // Atualiza o run premium
    await prisma.premiumAppRun.update({
      where: { id: premiumRun.id },
      data: {
        artifactStatus: "completed",
        totalActualCost: totalCost,
        totalLatencyMs: totalLatency,
        totalLlmCalls: items.length
      }
    })

    return NextResponse.json({ success: true, generatedCount: items.length })
  } catch (err: any) {
    console.error("[ORQUESTRADOR] Error:", err)
    return new NextResponse(err.message || "Erro interno", { status: 500 })
  }
}
