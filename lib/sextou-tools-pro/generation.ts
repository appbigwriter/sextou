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

type ServicePricingInput = {
  serviceName: string
  estimatedHours: number
  directCost: number
  indirectCost: number
  desiredMargin: number
  experienceLevel: "iniciante" | "pleno" | "experiente" | "especialista"
  serviceComplexity: "baixa" | "media" | "alta"
  minimumAcceptableValue?: number
}

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

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

function buildRange(center: number, variance: number) {
  return {
    min: roundCurrency(center * (1 - variance)),
    max: roundCurrency(center * (1 + variance)),
  }
}

function calculateServicePricing(input: ServicePricingInput) {
  const experienceHourlyRate = {
    iniciante: 35,
    pleno: 55,
    experiente: 80,
    especialista: 115,
  }[input.experienceLevel]

  const complexityMultiplier = {
    baixa: 1,
    media: 1.15,
    alta: 1.35,
  }[input.serviceComplexity]

  const effortValue = input.estimatedHours * experienceHourlyRate * complexityMultiplier
  const baseCalculation = roundCurrency(input.directCost + input.indirectCost + effortValue)
  const minimumFloor = roundCurrency(
    Math.max(input.minimumAcceptableValue || 0, baseCalculation * Math.max(1.05, 1 + (input.desiredMargin - 12) / 100))
  )
  const recommendedCenter = roundCurrency(Math.max(minimumFloor, baseCalculation * (1 + input.desiredMargin / 100)))
  const premiumCenter = roundCurrency(
    recommendedCenter * (input.serviceComplexity === "alta" ? 1.22 : input.serviceComplexity === "media" ? 1.16 : 1.12)
  )

  const lowPriceAlerts: string[] = []

  if (input.minimumAcceptableValue && input.minimumAcceptableValue > recommendedCenter) {
    lowPriceAlerts.push("Seu valor minimo aceitavel ja esta acima da faixa recomendada atual; revise margem, horas ou escopo.")
  }

  if (input.desiredMargin < 15) {
    lowPriceAlerts.push("A margem desejada esta baixa para servico personalizado; confira se sobra espaco para retrabalho e atendimento.")
  }

  if (recommendedCenter < baseCalculation * 1.1) {
    lowPriceAlerts.push("A faixa recomendada ficou muito proxima do custo base; isso pode enfraquecer sua defesa comercial.")
  }

  if (lowPriceAlerts.length === 0) {
    lowPriceAlerts.push("Nenhum alerta critico de preco baixo apareceu neste cenario, mas vale revisar escopo e tempo real antes de enviar.")
  }

  return {
    baseCalculation,
    minimumSuggestedRange: buildRange(minimumFloor, 0.05),
    recommendedRange: buildRange(recommendedCenter, 0.07),
    premiumRange: buildRange(premiumCenter, 0.08),
    lowPriceAlerts,
  }
}

function buildMockOutput(appId: string, input: Record<string, unknown>) {
  const primary = Object.values(input)[0]
  const primaryText = typeof primary === "string" && primary.trim() ? primary.trim() : "Seu negocio"

  if (appId === "business-diagnosis") {
    return {
      title: `Diagnostico de ${primaryText}`,
      diagnosisSummary:
        `${primaryText} tem espaco para vender com mais clareza, principalmente se organizar melhor a oferta, o canal principal e o proximo passo comercial.`,
      strengths: [
        "Ja existe uma entrega principal clara para o cliente entender o que compra.",
        "O negocio tem contexto suficiente para se posicionar de forma mais objetiva.",
        "Ha margem para melhorar a comunicacao sem depender de estrutura complexa.",
      ],
      weaknesses: [
        "A oferta ainda pode estar generica demais para o cliente decidir rapido.",
        "O canal principal de venda talvez concentre esforco sem follow-up consistente.",
        "A dor principal do cliente pode nao estar sendo traduzida em mensagem simples.",
      ],
      quickOpportunities: [
        "Clarificar a promessa principal em uma frase vendavel.",
        "Reaproveitar o canal atual com CTA mais direto e menos dispersao.",
        "Criar um proximo passo comercial padrao para reduzir atraso na decisao.",
      ],
      risks: [
        "Continuar comunicando beneficio de forma vaga e perder urgencia comercial.",
        "Depender de improviso no atendimento e manter respostas inconsistentes.",
        "Atrair interesse, mas nao converter por falta de oferta e sequencia claras.",
      ],
      sevenDayPlan: [
        { day: "Dia 1", action: "Reescreva a promessa principal do negocio em uma frase curta." },
        { day: "Dia 2", action: "Liste as 3 dores mais recorrentes do cliente ideal." },
        { day: "Dia 3", action: "Ajuste seu CTA principal no canal de venda atual." },
        { day: "Dia 4", action: "Monte uma oferta inicial mais facil de explicar." },
        { day: "Dia 5", action: "Publique uma mensagem de autoridade ou prova simples." },
        { day: "Dia 6", action: "Padronize o proximo passo para novos interessados." },
        { day: "Dia 7", action: "Revise o que gerou resposta e mantenha o que ficou mais claro." },
      ],
      recommendedNextApp: {
        slug: "gerador-oferta-irresistivel",
        label: "Gerador de Oferta Irresistivel",
        reason: "A prioridade mais evidente e tornar a oferta mais clara para melhorar conversao.",
      },
      nextActions: ["Criar oferta", "Criar calendario", "Criar plano de lancamento"],
    }
  }

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

  if (appId === "follow-up-5-messages") {
    return {
      title: `Follow-up para ${primaryText}`,
      sequenceLabel: "Sequencia comercial de 5 mensagens",
      messages: Array.from({ length: 5 }, (_, index) => ({
        stepLabel: `Mensagem ${index + 1}`,
        suggestedDelay:
          index === 0
            ? "Enviar hoje"
            : index === 1
              ? "Aguardar 2 dias"
              : index === 2
                ? "Aguardar 3 dias"
                : index === 3
                  ? "Aguardar 4 dias"
                  : "Aguardar 5 dias",
        message:
          index === 0
            ? `Oi! Passando para retomar ${primaryText} e ver se ainda faz sentido para voce.`
            : index === 1
              ? `Quis te escrever de novo porque ${primaryText} pode te ajudar a destravar essa decisao com mais clareza.`
              : index === 2
                ? `Se a duvida for timing ou prioridade, posso te resumir ${primaryText} em uma mensagem bem objetiva.`
                : index === 3
                  ? `Antes de encerrar meu acompanhamento, deixo aberto este retorno sobre ${primaryText} caso voce queira retomar.`
                  : `Vou encerrar esta sequencia por aqui para nao insistir. Se quiser retomar ${primaryText}, fico a disposicao.`,
        cta:
          index === 4
            ? "Se quiser retomar, me chama quando fizer sentido."
            : "Se fizer sentido, me responde por aqui e eu te mando o proximo passo.",
      })),
      shortFirstMessage: `Oi! Passando para retomar ${primaryText}. Se fizer sentido, te explico o proximo passo por aqui.`,
      closingMessage: "Vou encerrar por aqui para respeitar seu tempo. Se quiser retomar depois, fico a disposicao.",
      nextActions: ["Criar resposta para objecao", "Criar proposta comercial", "Criar oferta melhorada"],
    }
  }

  if (appId === "local-ads") {
    return {
      title: `Anuncio para ${primaryText}`,
      headline: `${primaryText} com oferta clara para quem quer decidir mais rapido`,
      description: `Divulgue ${primaryText} com mensagem curta, diferencial visivel e CTA simples para puxar conversa comercial.`,
      cta: "Fale comigo no WhatsApp para receber os detalhes e proximo passo.",
      whatsappVersion: `Oi! Estou com uma oferta especial de ${primaryText}. Se quiser, te explico por aqui como funciona e qual opcao faz mais sentido para voce.`,
      flyerVersion: `${primaryText} com oferta local, atendimento claro e CTA direto para WhatsApp.`,
      variations: [
        {
          angle: "Oferta direta",
          headline: `${primaryText} com condicao especial`,
          description: "Texto objetivo destacando oferta, diferencial e CTA imediato.",
        },
        {
          angle: "Beneficio principal",
          headline: `${primaryText} para resolver isso com mais clareza`,
          description: "Texto curto focado no beneficio principal para o publico local.",
        },
        {
          angle: "Urgencia etica",
          headline: `${primaryText} com agenda limitada nesta semana`,
          description: "Texto enxuto com disponibilidade limitada sem exagero de promessa.",
        },
      ],
      nextActions: ["Criar plano de lancamento", "Criar oferta irresistivel", "Criar sequencia de follow-up"],
    }
  }

  if (appId === "launch-plan-48h") {
    return {
      title: `Plano de 48 horas para ${primaryText}`,
      planLabel: "Plano pratico de lancamento em 48 horas",
      checklist: [
        {
          label: `Definir promessa central de ${primaryText}`,
          owner: "Voce",
          expectedOutcome: "Oferta comunicada em uma frase clara.",
        },
        {
          label: "Organizar CTA e ponto de contato principal",
          owner: "Voce",
          expectedOutcome: "Lead sabe exatamente como responder.",
        },
        {
          label: "Preparar post principal de anuncio",
          owner: "Voce",
          expectedOutcome: "Post pronto para publicar no canal principal.",
        },
        {
          label: "Preparar mensagem de WhatsApp",
          owner: "Voce",
          expectedOutcome: "Mensagem pronta para lista quente ou contatos ativos.",
        },
        {
          label: "Publicar e responder os primeiros interessados",
          owner: "Voce",
          expectedOutcome: "Primeiras conversas iniciadas ainda no dia 1.",
        },
        {
          label: "Revisar resposta, ajustar CTA e reforcar urgencia etica",
          owner: "Voce",
          expectedOutcome: "Segundo dia com mensagem mais precisa.",
        },
      ],
      timeline: [
        {
          stage: "Hora 0-6",
          hourWindow: "Preparacao",
          goal: "Fechar mensagem central e ativos essenciais.",
          actions: ["Definir oferta", "Escolher canal principal", "Ajustar CTA"],
        },
        {
          stage: "Hora 6-18",
          hourWindow: "Publicacao inicial",
          goal: "Colocar a campanha no ar sem travar.",
          actions: ["Publicar anuncio", "Enviar primeira mensagem", "Responder rapido"],
        },
        {
          stage: "Hora 18-30",
          hourWindow: "Ajuste de conversao",
          goal: "Corrigir friccao e reforcar clareza.",
          actions: ["Rever perguntas recebidas", "Ajustar post", "Refazer CTA se preciso"],
        },
        {
          stage: "Hora 30-48",
          hourWindow: "Fechamento",
          goal: "Reforcar a campanha e medir resultado simples.",
          actions: ["Rodar follow-up", "Repostar oferta", "Medir respostas e conversas"],
        },
      ],
      keyMessages: [
        {
          label: "Mensagem principal",
          text: `${primaryText} com beneficio claro, linguagem direta e proximo passo simples.`,
        },
        {
          label: "Mensagem de prova",
          text: "Explique porque essa oferta resolve o problema agora sem prometer demais.",
        },
        {
          label: "Mensagem de CTA",
          text: "Convide para chamar no WhatsApp ou responder ainda hoje.",
        },
      ],
      announcementPost: `Post curto para ${primaryText} com promessa clara, beneficio principal e CTA imediato para conversa.`,
      whatsappMessage: `Oi! Abri uma campanha rapida de ${primaryText} nas proximas 48 horas. Se quiser, te explico por aqui como funciona e qual o proximo passo.`,
      ethicalUrgency: "Campanha ativa por 48 horas para manter foco e capacidade real de atendimento.",
      simpleMetrics: [
        "Quantidade de respostas recebidas",
        "Cliques ou chamadas no WhatsApp",
        "Conversas qualificadas iniciadas",
        "Fechamentos ou pedidos de proposta",
      ],
      nextActions: ["Criar anuncio local", "Criar roteiro de Reels", "Criar follow-up da campanha"],
    }
  }

  if (appId === "service-pricing") {
    const pricing = calculateServicePricing(input as unknown as ServicePricingInput)

    return {
      title: `Precificacao para ${primaryText}`,
      scenarioLabel: "Cenario calculado de precificacao",
      baseCalculation: pricing.baseCalculation,
      minimumSuggestedRange: pricing.minimumSuggestedRange,
      recommendedRange: pricing.recommendedRange,
      premiumRange: pricing.premiumRange,
      pricingExplanation:
        "A faixa foi montada a partir dos seus custos, horas estimadas, experiencia e complexidade do servico. Use a faixa recomendada como ancora principal e a premium quando houver mais personalizacao, urgencia ou risco.",
      presentationSuggestion:
        "Apresente primeiro o resultado e o escopo, depois explique que o valor considera tempo, custos e nivel de entrega. Se o cliente travar, mostre a faixa minima apenas como versao mais enxuta do mesmo servico.",
      lowPriceAlerts: pricing.lowPriceAlerts,
      nextActions: ["Criar proposta comercial", "Criar oferta", "Criar resposta para objecao de preco"],
    }
  }

  if (appId === "local-partnerships") {
    return {
      title: `Parcerias para ${primaryText}`,
      campaignLabel: "Mapa inicial de parceiros locais",
      ideas: Array.from({ length: 10 }, (_, index) => ({
        partnerCategory:
          [
            "Negocios complementares do mesmo bairro",
            "Profissionais de servicos para o mesmo publico",
            "Comunidades locais e grupos de networking",
            "Espacos de eventos pequenos",
            "Negocios de bem-estar e estilo de vida",
            "Prestadores que atendem antes do seu servico",
            "Prestadores que atendem depois do seu servico",
            "Criadores de conteudo local",
            "Assessorias ou consultores de nicho",
            "Empresas com base de clientes semelhante",
          ][index] || `Categoria de parceiro ${index + 1}`,
        partnershipReason: "Esse parceiro conversa com o mesmo publico e pode gerar troca de indicacoes ou oferta conjunta sem competir diretamente.",
        approachProposal: "Proponha uma acao simples de teste com beneficio claro para os dois lados e pouco custo inicial.",
        firstContactMessage:
          "Oi! Vi que atendemos um publico parecido aqui na regiao. Pensei em testar uma parceria simples para gerar valor para nossos clientes dos dois lados. Se fizer sentido, posso te explicar a ideia em 2 minutos.",
        jointCampaignIdea: "Criar uma oferta cruzada ou conteudo conjunto com CTA unico para puxar novas conversas comerciais.",
        recommendedNextStep: "Validar interesse rapido e marcar uma conversa curta para alinhar a primeira acao piloto.",
      })),
      nextActions: ["Criar mensagem de abordagem", "Criar anuncio local", "Criar plano de lancamento"],
    }
  }

  if (appId === "creative-brief") {
    return {
      title: `Briefing para ${primaryText}`,
      organizedBrief:
        `${primaryText} precisa de um briefing claro para alinhar objetivo, mensagem e entrega antes de pedir um servico criativo.`,
      projectGoal: "Organizar um pedido criativo objetivo, facil de explicar e pronto para solicitar orcamento.",
      targetAudience: "Publico principal do negocio que deve reconhecer valor e clareza no material.",
      mainMessage: "O material precisa comunicar beneficio principal, confianca e proximo passo sem excesso de informacao.",
      visualDirection: [
        "Linguagem visual simples e profissional.",
        "Estilo coerente com o perfil real do negocio.",
        "Clareza de leitura antes de detalhes decorativos.",
        "Elementos que reforcem confianca e organizacao.",
      ],
      requiredContent: [
        "Nome do negocio e assinatura principal.",
        "Servico ou oferta que precisa aparecer.",
        "CTA ou forma de contato prioritario.",
        "Informacoes obrigatorias que nao podem faltar.",
        "Formato esperado do material ou entrega.",
      ],
      openQuestions: [
        "Qual versao final realmente precisa ser entregue primeiro?",
        "Existe limitacao de prazo ou formato que o designer precisa saber?",
        "Ha referencia visual que aproxima do resultado desejado?",
        "O que deve ser evitado para nao descaracterizar o negocio?",
      ],
      deliveryChecklist: [
        "Revisar objetivo e publico antes de enviar.",
        "Confirmar conteudo obrigatorio do material.",
        "Anexar referencias e exemplos disponiveis.",
        "Definir prazo e canal de retorno.",
        "Enviar briefing final em texto facil de copiar.",
      ],
      nextActions: ["Solicitar servico pago", "Criar proposta comercial", "Criar anuncio local"],
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

  if (appId === "pitch-30-seconds") {
    return {
      title: `Pitch para ${primaryText}`,
      pitch30: `${primaryText} ajuda clientes ideais a resolver um problema real com uma entrega clara e facil de confiar.`,
      pitch10: `${primaryText} resolve isso de forma simples e profissional.`,
      whatsappVersion: `Oi! Eu trabalho com ${primaryText} para ajudar clientes a resolver esse problema com mais clareza e resultado.`,
      shortBio: `${primaryText} para clientes que buscam clareza, confianca e resultado.`,
      closingLine: "Se fizer sentido para voce, eu te explico o proximo passo em poucos minutos.",
      nextActions: ["Criar bio profissional", "Criar roteiro de video", "Criar descricao institucional"],
    }
  }

  if (appId === "professional-bio") {
    return {
      title: `Bio para ${primaryText}`,
      instagramBio: `${primaryText} | atendimento claro | resultado real | chame no direct ou WhatsApp`,
      linkedinBio: `${primaryText} com foco em clareza comercial, confianca e execucao consistente para o cliente certo.`,
      googleBusinessDescription: `${primaryText} com atendimento profissional, comunicacao objetiva e foco em resolver o que o cliente precisa sem complicacao.`,
      shortHeadline: `${primaryText} com clareza e confianca`,
      profileCta: "Chame no WhatsApp para receber uma orientacao inicial sem enrolacao.",
      positioningKeywords: ["atendimento", "resultado", "clareza", "confianca", "profissionalismo"],
      nextActions: ["Criar calendario de conteudo", "Criar posts de apresentacao", "Criar FAQ do negocio"],
    }
  }

  if (appId === "faq-objections") {
    return {
      title: `FAQ de ${primaryText}`,
      faqs: Array.from({ length: 10 }, (_, index) => ({
        question: `Pergunta frequente ${index + 1} sobre ${primaryText}?`,
        answer: `Resposta curta ${index + 1} explicando ${primaryText} de forma clara e comercial.`,
      })),
      objections: Array.from({ length: 5 }, (_, index) => ({
        objection: `Objecao comum ${index + 1} sobre ${primaryText}`,
        answer: `Resposta comercial ${index + 1} para reduzir atrito sem prometer demais.`,
      })),
      whatsappMessage: `Oi! Separei respostas rapidas sobre ${primaryText}. Se quiser, eu te explico qual opcao faz mais sentido para o seu caso.`,
      suggestedUsage: "Use as respostas no WhatsApp, no perfil comercial e em materiais de apresentacao.",
      nextActions: ["Criar respostas de WhatsApp", "Criar bio do negocio", "Criar calendario de conteudo educativo"],
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

async function buildServicePricingOutput(options: {
  input: ServicePricingInput
  prompt: NonNullable<Awaited<ReturnType<typeof resolveSextouToolsProPrompt>>>
  profile: {
    fullName: string
    businessName: string
    city?: string
    state?: string
  }
}) {
  const calculation = calculateServicePricing(options.input)
  const mockOutput = buildMockOutput("service-pricing", options.input) as Record<string, unknown>
  const explanationSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      pricingExplanation: { type: "string" },
      presentationSuggestion: { type: "string" },
      lowPriceAlerts: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
      nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
    },
    required: ["pricingExplanation", "presentationSuggestion", "lowPriceAlerts", "nextActions"],
  }

  const userPrompt = buildSextouToolsProUserPrompt({
    appId: "service-pricing",
    input: {
      ...options.input,
      baseCalculation: calculation.baseCalculation,
      minimumSuggestedRange: `${calculation.minimumSuggestedRange.min} a ${calculation.minimumSuggestedRange.max}`,
      recommendedRange: `${calculation.recommendedRange.min} a ${calculation.recommendedRange.max}`,
      premiumRange: `${calculation.premiumRange.min} a ${calculation.premiumRange.max}`,
      deterministicAlerts: calculation.lowPriceAlerts.join(" | "),
      note: "Os numeros acima ja estao fechados. Explique e sugira a apresentacao comercial sem alterar a precificacao.",
    },
    profile: options.profile,
  })

  let provider = "openai"
  let model = options.prompt.model
  let explanationOutput: Record<string, unknown>

  try {
    const providerResponse = await callOpenAiStructuredOutput({
      model: options.prompt.model,
      systemPrompt: options.prompt.systemPrompt,
      userPrompt,
      schemaName: "service_pricing_explanation",
      schema: explanationSchema,
    })

    model = providerResponse.model
    explanationOutput = providerResponse.parsedOutput
  } catch (error) {
    if (error instanceof Error && error.message === "openai-key-missing") {
      provider = "mock"
      explanationOutput = mockOutput
    } else {
      throw error
    }
  }

  return {
    provider,
    model,
    output: {
      title: `Precificacao para ${options.input.serviceName}`,
      scenarioLabel: `${options.input.serviceName} | ${options.input.experienceLevel} | complexidade ${options.input.serviceComplexity}`,
      baseCalculation: calculation.baseCalculation,
      minimumSuggestedRange: calculation.minimumSuggestedRange,
      recommendedRange: calculation.recommendedRange,
      premiumRange: calculation.premiumRange,
      pricingExplanation:
        typeof explanationOutput.pricingExplanation === "string"
          ? explanationOutput.pricingExplanation
          : String(mockOutput.pricingExplanation || ""),
      presentationSuggestion:
        typeof explanationOutput.presentationSuggestion === "string"
          ? explanationOutput.presentationSuggestion
          : String(mockOutput.presentationSuggestion || ""),
      lowPriceAlerts:
        Array.isArray(explanationOutput.lowPriceAlerts) && explanationOutput.lowPriceAlerts.length > 0
          ? explanationOutput.lowPriceAlerts.map(String)
          : calculation.lowPriceAlerts,
      nextActions:
        Array.isArray(explanationOutput.nextActions) && explanationOutput.nextActions.length === 3
          ? explanationOutput.nextActions.map(String)
          : ["Criar proposta comercial", "Criar oferta", "Criar resposta para objecao de preco"],
    },
  }
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

  if (options.appId === "service-pricing") {
    const pricingOutput = await buildServicePricingOutput({
      input: parsedInput as unknown as ServicePricingInput,
      prompt,
      profile: options.user,
    })

    provider = pricingOutput.provider
    model = pricingOutput.model
    parsedOutput = pricingOutput.output
  } else {
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
      recommendedNextApp:
        typeof (validatedOutput as { recommendedNextApp?: unknown }).recommendedNextApp === "object" &&
        (validatedOutput as { recommendedNextApp?: unknown }).recommendedNextApp
          ? (validatedOutput as { recommendedNextApp: Record<string, unknown> }).recommendedNextApp
          : null,
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
