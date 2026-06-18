import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function calculateFleschPortuguese(text: string): number {
  const cleanText = text.trim()
  if (!cleanText) return 100
  // Sentences: split by sentence delimiters
  const sentences = cleanText.split(/[.!?\n]+/).filter(s => s.trim().length > 0).length || 1
  // Words: split by whitespace
  const words = cleanText.split(/\s+/).filter(w => w.trim().length > 0).length || 1
  // Syllables: count vowel groups in Portuguese roughly
  const syllables = (cleanText.match(/[aeiouyáéíóúâêôãõüàíóúy]+/gi) || []).length || 1

  // Flesch formula for Portuguese: 248.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const score = 248.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10))
}

function checkPronomesOk(text: string): boolean {
  // Scans for plural pronomes/verbs like "nós", "vocês", "nossos", "temos", "fomos", "estamos", "fazemos"
  const pluralPattern = /\b(vocês|nós|nossos|nossas|fomos|estamos|temos|fazemos|queremos|somos|oferecemos|ajudamos|escrevemos|postamos)\b/i
  return !pluralPattern.test(text)
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, hasActiveAds: true, isPremium: true }
    })

    if (!user || !user.hasActiveAds || !user.isPremium) {
      return new NextResponse("Acesso restrito para usuários Premium com anúncios ativos", { status: 403 })
    }

    const campaignId = params.id

    // Busca a campanha e o projeto
    const campaign = await prisma.socialNetworkCampaign.findFirst({
      where: { id: campaignId },
      include: {
        project: true
      }
    })

    if (!campaign) {
      return new NextResponse("Campanha não encontrada", { status: 404 })
    }

    const project = campaign.project
    if (project.userId !== user.id) {
      return new NextResponse("Não autorizado a acessar este projeto", { status: 403 })
    }

    // Inicializa a auditoria de tokens/custo
    const premiumRun = await prisma.premiumAppRun.create({
      data: {
        userId: user.id,
        appId: "social-network-studio",
        artifactType: "social_copy_pack",
        artifactStatus: "pending"
      }
    })

    let accumulatedCost = 0
    let accumulatedLatency = 0

    // Prompt de engenharia de copywriting baseado nos ensinamentos do livro (A Forma, O Quem, O Resultado, O Negócio)
    const copyGenerationPrompt = `Você é o copywriting_agent do EasySocial - Network Studio.
Sua função é gerar um pacote de criativos comerciais persuasivos com base no "Canvas da Oferta 11 Estrelas" do usuário.

Regras Metodológicas Absolutas (Ícaro de Carvalho):
1. ATENÇÃO E SINGULARIDADE: Foque a copy no "Você" no singular. Fale diretamente com o leitor como se fosse uma conversa individual no WhatsApp. Evite falar "nós", "nossos" ou "vocês".
2. LINGUAGEM DIRETA: Evite palavras difíceis, termos em inglês corporativos exagerados ou juridiquês. Use frases curtas e impacto imediato.
3. VENDER O QUE ELES QUEREM COMPRAR: A copy deve focar em afastar o cliente da dor/medo e aproximá-lo do sonho, usando sua Solução como ponte direta.

Dados do Projeto:
- Nome do Negócio/Projeto: ${project.projectName}
- Público-Alvo: ${project.targetAudience}
- Ideia Básica: ${project.basicIdea}

Canvas da Oferta 11 Estrelas:
- Dor Principal: ${campaign.dorPrincipal}
- Medo Profundo: ${campaign.medo}
- Sonho de Consumo: ${campaign.sonho}
- Solução: ${campaign.promessa}
- Prova Social: ${campaign.provaSocial}
- Escassez: ${campaign.escassez}

Gere o seguinte pacote de criativos:
1. posts: 3 postagens persuasivas para redes sociais. Cada uma deve ter:
   - title: Título/Gancho forte para prender a atenção.
   - body: Legenda explicativa que conte uma história ou apresente a solução, terminando com CTA para WhatsApp/DM.
   - channel: Canal ideal (instagram, facebook ou linkedin).
   - framework: Framework de copy utilizado (AIDA ou PAS).
2. headlines: 3 ganchos ou chamadas de atenção ultra-curtos e provocativos para usar em stories ou anúncios.
3. emails: 2 e-mails persuasivos completos:
   - title: Assunto do e-mail provocativo e de alta abertura.
   - body: Corpo do e-mail focado na dor, agitação e solução, com CTA direto para a oferta.

Responda estritamente em formato JSON com o seguinte schema:
{
  "posts": [
    {
      "title": "...",
      "body": "...",
      "channel": "instagram",
      "framework": "PAS"
    }
  ],
  "headlines": [
    "Headline 1",
    "Headline 2",
    "Headline 3"
  ],
  "emails": [
    {
      "title": "Assunto do e-mail 1",
      "body": "Corpo do e-mail 1"
    }
  ]
}`

    const startTime = Date.now()
    const llmResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: copyGenerationPrompt },
        { role: "user", content: "Gere o pacote de copy estruturado com base nos dados fornecidos do Canvas 11 Estrelas." }
      ]
    })
    const latency = Date.now() - startTime
    const usage = llmResponse.usage
    const inTokens = usage?.prompt_tokens || 0
    const outTokens = usage?.completion_tokens || 0
    const cost = (inTokens * 0.00000015) + (outTokens * 0.00000060) // gpt-4o-mini pricing

    accumulatedCost += cost
    accumulatedLatency += latency

    // Registra chamada do LLM para auditoria
    await prisma.premiumLlmCall.create({
      data: {
        premiumRunId: premiumRun.id,
        userId: user.id,
        appId: "social-network-studio",
        phase: "copy_generation",
        providerSlug: "openai",
        modelId: "gpt-4o-mini",
        inputTokens: inTokens,
        outputTokens: outTokens,
        actualCost: cost,
        latencyMs: latency,
        status: "SUCCESS"
      }
    })

    const parsedResult = JSON.parse(llmResponse.choices[0].message?.content || "{}")

    // Remove cópias antigas da campanha se houver
    await prisma.socialNetworkContent.deleteMany({
      where: { campaignId }
    })

    // Processa e salva as postagens
    if (Array.isArray(parsedResult.posts)) {
      for (const post of parsedResult.posts) {
        const pOk = checkPronomesOk(post.body || "")
        const flf = calculateFleschPortuguese(post.body || "")
        await prisma.socialNetworkContent.create({
          data: {
            campaignId,
            contentType: "post",
            channel: post.channel || "instagram",
            title: post.title || "Post de Redes Sociais",
            body: post.body || "",
            framework: post.framework || "PAS",
            pronomesOk: pOk,
            readability: flf
          }
        })
      }
    }

    // Processa e salva as headlines
    if (Array.isArray(parsedResult.headlines)) {
      for (const headline of parsedResult.headlines) {
        await prisma.socialNetworkContent.create({
          data: {
            campaignId,
            contentType: "headline",
            channel: "instagram",
            title: "Gancho Curto",
            body: headline || "",
            framework: "Headline",
            pronomesOk: true,
            readability: 100
          }
        })
      }
    }

    // Processa e salva os e-mails
    if (Array.isArray(parsedResult.emails)) {
      for (const email of parsedResult.emails) {
        const pOk = checkPronomesOk(email.body || "")
        const flf = calculateFleschPortuguese(email.body || "")
        await prisma.socialNetworkContent.create({
          data: {
            campaignId,
            contentType: "email",
            channel: "email",
            title: email.title || "Assunto do E-mail",
            body: email.body || "",
            framework: "AIDA",
            pronomesOk: pOk,
            readability: flf
          }
        })
      }
    }

    // Atualiza status da campanha
    await prisma.socialNetworkCampaign.update({
      where: { id: campaignId },
      data: { status: "approved" }
    })

    // Finaliza a auditoria da execução
    await prisma.premiumAppRun.update({
      where: { id: premiumRun.id },
      data: {
        artifactStatus: "completed",
        totalActualCost: accumulatedCost,
        totalLatencyMs: accumulatedLatency,
        totalLlmCalls: 1
      }
    })

    // Registra auditoria de execução geral
    await prisma.toolExecution.create({
      data: {
        userId: user.id,
        toolSlug: "social-network-studio",
        inputJson: { campaignId },
        outputJson: parsedResult
      }
    })

    return NextResponse.json({ success: true, campaignId })
  } catch (err: any) {
    console.error("[EASYSOCIAL_GENERATION] Error:", err)
    return new NextResponse(err.message || "Erro interno de processamento", { status: 500 })
  }
}
