import { prisma } from "@/lib/prisma"
import { getSextouToolsProDefinition, SextouToolsProAppId } from "@/lib/sextou-tools-pro/schemas"

const defaultModel = process.env.OPENAI_MODEL || "gpt-4o-mini"

function stringifyInput(input: Record<string, unknown>) {
  return Object.entries(input)
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : String(value ?? "")}`)
    .join("\n")
}

function buildSystemPrompt(appId: SextouToolsProAppId) {
  if (appId === "business-diagnosis") {
    return "Voce cria diagnosticos curtos para pequenos empreendedores. Gere um resumo pratico, exatamente 3 pontos fortes, 3 pontos fracos, 3 oportunidades rapidas, 3 riscos, um plano de 7 dias e o proximo mini-app recomendado com justificativa curta. Nao faca analise financeira profunda, nao invente benchmark de concorrentes e retorne apenas JSON valido."
  }

  if (appId === "respostas-prontas-whatsapp") {
    return "Voce gera respostas comerciais curtas e objetivas para WhatsApp. Evite agressividade, juridiquês e promessas exageradas. Retorne apenas JSON valido."
  }

  if (appId === "follow-up-5-messages") {
    return "Voce cria sequencias eticas de follow-up comercial com 5 mensagens, intervalos sugeridos e CTA suave por etapa. Nao seja abusivo, nao pressione o lead e retorne apenas JSON valido."
  }

  if (appId === "local-ads") {
    return "Voce cria anuncios locais curtos com headline, descricao, CTA, versao para WhatsApp, versao para panfleto e 3 variacoes de abordagem. Nao configure campanha paga, nao crie criativo visual e retorne apenas JSON valido."
  }

  if (appId === "launch-plan-48h") {
    return "Voce cria um plano de lancamento estritamente limitado a 48 horas para pequenos empreendedores. Gere checklist objetivo, cronograma em 4 etapas, 3 mensagens principais, post de anuncio, mensagem de WhatsApp, urgencia etica e metricas simples. Nao abra escopo para projeto completo, automacao ou planejamento mensal. Retorne apenas JSON valido."
  }

  if (appId === "service-pricing") {
    return "Voce recebe um calculo deterministico de precificacao pronto e deve apenas explicar o valor comercial, sugerir como apresentar o preco ao cliente e apontar alertas quando a faixa estiver baixa demais. Nao altere numeros, nao de conselho financeiro formal, nao fale de imposto por jurisdicao e retorne apenas JSON valido."
  }

  if (appId === "local-partnerships") {
    return "Voce cria 10 ideias de parcerias locais por categoria de parceiro, nunca por empresa real. Para cada ideia gere motivo da parceria, proposta de abordagem, mensagem inicial, campanha conjunta e proximo passo recomendado. Nao transforme isso em CRM, nao busque negocios reais e retorne apenas JSON valido."
  }

  if (appId === "creative-brief") {
    return "Voce organiza briefing criativo para pequenos empreendedores. Gere um resumo editorial curto, objetivo do projeto, publico-alvo, mensagem principal, 4 pontos de direcao visual, 5 itens de conteudo obrigatorio, 4 perguntas pendentes e 5 itens de checklist para envio. Nao crie logo, nao gere imagem, nao entregue wireframe completo e retorne apenas JSON valido."
  }

  if (appId === "gerador-oferta-irresistivel") {
    return "Voce transforma servicos e produtos em ofertas claras para pequenos empreendedores. Use urgencia etica, linguagem simples e sem promessas enganosas. Retorne apenas JSON valido."
  }

  if (appId === "calendario-conteudo-7-dias") {
    return "Voce cria um calendario enxuto de conteudo de 7 dias para pequenos empreendedores. Seja pratico, nao repita ideias e mantenha captions curtas. Retorne apenas JSON valido."
  }

  if (appId === "proposta-comercial-one-page") {
    return "Voce escreve propostas comerciais curtas e profissionais em uma pagina textual, sem clausulas juridicas complexas. Retorne apenas JSON valido."
  }

  if (appId === "pitch-30-seconds") {
    return "Voce cria pitches comerciais curtos, claros e memoraveis para networking, WhatsApp e bio curta. Evite blocos longos e retorne apenas JSON valido."
  }

  if (appId === "professional-bio") {
    return "Voce cria bios e descricoes profissionais por canal, com clareza, autoridade e CTA simples. Gere headline curta, CTA de perfil dedicado e variacoes distintas para Instagram, LinkedIn e Google Business Profile. Respeite limites de canal, evite excesso de emoji e retorne apenas JSON valido."
  }

  if (appId === "faq-objections") {
    return "Voce cria FAQ e respostas para objecoes com linguagem curta, comercial e confiavel. Nao invente politicas ou promessas nao informadas. Retorne apenas JSON valido."
  }

  return "Voce cria roteiros curtos para videos verticais com gancho, estrutura simples e CTA claro. Respeite a duracao pedida. Retorne apenas JSON valido."
}

export async function resolveSextouToolsProPrompt(appId: string) {
  const definition = getSextouToolsProDefinition(appId)

  if (!definition) {
    return null
  }

  const activeTemplate = await prisma.sextouToolsProPromptTemplate.findFirst({
    where: {
      appId,
      isActive: true,
      version: definition.promptVersion,
    },
  }).catch(() => null)

  return {
    appId,
    version: activeTemplate?.version || definition.promptVersion,
    model: activeTemplate?.model || defaultModel,
    schemaName: activeTemplate?.schemaName || definition.schemaName,
    schema: (activeTemplate?.schemaJson as Record<string, unknown> | null) || definition.jsonSchema,
    systemPrompt: activeTemplate?.systemPrompt || buildSystemPrompt(appId as SextouToolsProAppId),
  }
}

export function buildSextouToolsProUserPrompt({
  appId,
  input,
  profile,
}: {
  appId: string
  input: Record<string, unknown>
  profile: {
    fullName: string
    businessName: string
    city?: string
    state?: string
  }
}) {
  return [
    `App: ${appId}`,
    `Negocio: ${profile.businessName}`,
    `Responsavel: ${profile.fullName}`,
    profile.city && profile.state ? `Local: ${profile.city}, ${profile.state}` : null,
    "Use o contexto abaixo para montar a resposta estruturada:",
    stringifyInput(input),
  ]
    .filter(Boolean)
    .join("\n")
}
