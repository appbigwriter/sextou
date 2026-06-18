import { NextResponse } from "next/server"
import { requireSextouToolsPremiumApiUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    const bodyData = await req.json()
    const { itemId, prompt } = bodyData

    if (!itemId) {
      return new NextResponse("itemId é obrigatório", { status: 400 })
    }

    const item = await prisma.youtubeContentItem.findFirst({
      where: { id: itemId, plan: { userId: user.id } },
      include: { plan: { include: { channel: true } } }
    })

    if (!item) {
      return new NextResponse("Item de conteúdo não encontrado", { status: 404 })
    }

    // Criar um novo run premium
    const premiumRun = await prisma.premiumAppRun.create({
      data: {
        userId: user.id,
        appId: "youtube-growth-studio",
        artifactType: "youtube_content_refinement",
        artifactStatus: "pending"
      }
    })

    const start = Date.now()

    // Prompt de refinamento localizado com base nos dados anteriores
    const refineSystemPrompt = `Você é o editor e refinador de conteúdo premium do YouTube Growth Studio AI.
Sua função é refinar apenas a seção indicada do vídeo de acordo com o feedback do usuário.

Informações do Canal:
- Nome: ${item.plan.channel.channelName}
- Nicho: ${item.plan.channel.niche}
- Cidade: ${item.plan.channel.city || "Estados Unidos"}
- Oferta Principal: ${item.plan.channel.primaryOffer}
- Público-alvo: ${JSON.stringify(item.plan.channel.targetAudience)}
- Tom de Voz: ${item.plan.channel.tone || "Autoridade amigável"}

Dados Atuais do Item:
- Título: ${item.title}
- Gancho Atual: ${item.hook}
- Roteiro Atual: ${JSON.stringify(item.scriptJson)}
- SEO Pack Atual: ${JSON.stringify(item.seoPack)}
- Social Pack Atual: ${JSON.stringify(item.socialPack)}

Feedback de Ajuste do Usuário:
"${prompt || "Melhore a fluidez e adicione ganchos mais atraentes"}"

Responda estritamente em formato JSON com o mesmo esquema do item de conteúdo contendo apenas as alterações aplicadas:
{
  "title": "Título definitivo ajustado",
  "hook": "Novo gancho de abertura",
  "script_json": {
    "intro": "Nova introdução",
    "sections": [
      {
        "title": "Subtítulo da Seção Ajustada",
        "talking_points": ["Ponto ajustado 1", "Ponto ajustado 2"],
        "duration_sec": 60
      }
    ],
    "cta": "Chamada para ação ajustada",
    "closing": "Fechamento ajustado",
    "broll_suggestions": ["Sugestões visuais ajustadas"],
    "total_duration_sec": 480
  },
  "seo_pack": {
    "titles": [
      { "variant": "curiosidade", "text": "Título focado em curiosidade ajustado" },
      { "variant": "autoridade", "text": "Título focado em autoridade ajustado" },
      { "variant": "seo", "text": "Título com palavras-chave foco ajustado" }
    ],
    "description": {
      "summary": "Resumo ajustado",
      "timestamps": ["0:00 - Introdução"],
      "links": [],
      "keywords": []
    },
    "hashtags": {
      "primary": [],
      "local": [],
      "niche": []
    }
  },
  "social_pack": {
    "instagram": { "caption": "Legenda ajustada", "carousel_slides": [] },
    "facebook": { "post": "Post ajustado" },
    "linkedin": { "post": "Post ajustado" },
    "whatsapp": { "message": "Mensagem ajustada" },
    "youtube_community": { "post": "Post ajustado" }
  },
  "captions_json": {
    "short": "Legenda rápida ajustada",
    "medium": "Legenda descritiva ajustada",
    "long": "Legenda longa ajustada"
  },
  "thumbnail_brief": {
    "background_description": "Cenário de fundo ajustado",
    "text_on_screen": "Frase ajustada",
    "expression_and_actor": "Expressão ajustada",
    "color_palette_suggestion": "Cores ajustadas"
  }
}`

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: refineSystemPrompt },
        { role: "user", content: `Refine este item com base no feedback: "${prompt}"` }
      ]
    })

    const data = JSON.parse(res.choices[0].message?.content || "{}")
    const latency = Date.now() - start
    const tokens = res.usage
    const inTokens = tokens?.prompt_tokens || 0
    const outTokens = tokens?.completion_tokens || 0
    const cost = (inTokens * 0.00000015) + (outTokens * 0.00000060)

    // Registrar chamada Premium LLM no ledger
    await prisma.premiumLlmCall.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        appId: "youtube-growth-studio",
        phase: `refine_item_${item.itemType}`,
        providerSlug: "openai",
        modelId: "gpt-4o-mini",
        inputTokens: inTokens,
        outputTokens: outTokens,
        actualCost: cost,
        latencyMs: latency,
        status: "SUCCESS"
      }
    })

    // Salva a nova versão refinada do item
    const updatedItem = await prisma.youtubeContentItem.update({
      where: { id: item.id },
      data: {
        title: data.title || item.title,
        hook: data.hook || item.hook,
        scriptJson: data.script_json || item.scriptJson,
        seoPack: data.seo_pack || item.seoPack,
        socialPack: data.social_pack || item.socialPack,
        captionsJson: data.captions_json || item.captionsJson,
        thumbnailBrief: data.thumbnail_brief || item.thumbnailBrief
      }
    })

    // Atualiza o run premium
    await prisma.premiumAppRun.update({
      where: { id: premiumRun.id },
      data: {
        artifactStatus: "completed",
        totalActualCost: cost,
        totalLatencyMs: latency,
        totalLlmCalls: 1
      }
    })

    return NextResponse.json({ success: true, item: updatedItem })
  } catch (err: any) {
    console.error("[REFINEMENT] Error:", err)
    return new NextResponse(err.message || "Erro interno", { status: 500 })
  }
}
