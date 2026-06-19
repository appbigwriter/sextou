import { getSextouToolsProCatalog, getSextouToolsProTool } from "@/lib/sextou-tools-pro/catalog"

export type SextouToolsShowcasePackage = "pro" | "premium"

export interface SextouToolsShowcaseApp {
  slug: string
  title: string
  icon: string
  packageType: SextouToolsShowcasePackage
  shortDescription: string
  heroDescription: string
  actualPath: string
  availability: "live" | "coming-soon"
  features: string[]
  practicalExamples: string[]
  exampleTitle: string
  exampleOutcome: string
}

const showcaseApps: SextouToolsShowcaseApp[] = [
  {
    slug: "business-diagnosis",
    title: "Diagnostico Express do Negocio",
    icon: "DX",
    packageType: "pro",
    shortDescription: "Gere um raio-x curto do negocio com prioridades, riscos e plano de 7 dias.",
    heroDescription: "Entenda rapidamente onde o seu negocio esta perdendo dinheiro, tempo ou clareza antes de investir em novas acoes.",
    actualPath: "/sextou-tools-pro/business-diagnosis",
    availability: "live",
    features: [
      "Raio-x rapido com gargalos, oportunidades e riscos comerciais.",
      "Prioriza o que atacar primeiro para sair da paralisia.",
      "Entrega plano de 7 dias com proximos passos acionaveis.",
      "Sugere qual outro app da suite faz mais sentido na sequencia.",
    ],
    practicalExamples: [
      "Uma empresa de limpeza identifica que o problema nao e demanda, mas follow-up fraco no WhatsApp.",
      "Um restaurante percebe que a oferta principal esta confusa e precisa de reposicionamento.",
      "Um prestador de servico usa o diagnostico para decidir entre investir em conteudo, oferta ou parcerias.",
    ],
    exampleTitle: "Quando usar no dia a dia",
    exampleOutcome: "Antes de contratar trafego, redesign ou consultoria, o empreendedor roda um diagnostico de 5 minutos e descobre onde esta o maior vazamento comercial.",
  },
  {
    slug: "respostas-prontas-whatsapp",
    title: "Respostas Prontas para WhatsApp",
    icon: "WA",
    packageType: "pro",
    shortDescription: "Monte respostas comerciais mais rapidas para atendimento, objecoes e follow-up.",
    heroDescription: "Padronize o atendimento sem parecer robotico e responda clientes com mais velocidade e firmeza comercial.",
    actualPath: "/sextou-tools-pro/respostas-prontas-whatsapp",
    availability: "live",
    features: [
      "Cria respostas curtas para orcamento, prazo, objecoes e fechamento.",
      "Mantem consistencia de tom mesmo com equipe pequena.",
      "Ajuda a responder mais rapido em horarios de pico.",
      "Reduz improviso em conversas que definem venda.",
    ],
    practicalExamples: [
      "Responder um lead que pediu preco e sumiu por dois dias.",
      "Contornar objecao de valor sem entrar em guerra de desconto.",
      "Enviar mensagem clara para remarcar servico, entrega ou visita tecnica.",
    ],
    exampleTitle: "Aplicacao pratica",
    exampleOutcome: "Uma empreendedora salva respostas para orcamento, agenda e objecoes e corta pela metade o tempo gasto no WhatsApp sem perder conversao.",
  },
  {
    slug: "follow-up-5-messages",
    title: "Follow-up Comercial em 5 Mensagens",
    icon: "F5",
    packageType: "pro",
    shortDescription: "Crie uma sequencia curta para retomar contato sem soar insistente.",
    heroDescription: "Recupere conversas mornas com uma sequencia humana, elegante e pensada para destravar vendas paradas.",
    actualPath: "/sextou-tools-pro/follow-up-5-messages",
    availability: "live",
    features: [
      "Monta uma sequencia completa com 5 toques e CTA por etapa.",
      "Equilibra urgencia e educacao sem parecer cobranca automatica.",
      "Adapta o tom para leads frios, propostas enviadas ou clientes indecisos.",
      "Evita perder vendas por simples falta de retomada.",
    ],
    practicalExamples: [
      "Retomar um orçamento de instalacao que ficou sem resposta.",
      "Reabrir conversa com cliente que pediu proposta e desapareceu.",
      "Encerrar com elegancia quando nao houver interesse real.",
    ],
    exampleTitle: "Exemplo na rotina",
    exampleOutcome: "Um consultor gera uma sequencia para propostas enviadas e deixa de depender de lembranca ou improviso para fazer follow-up.",
  },
  {
    slug: "local-ads",
    title: "Gerador de Anuncios Locais",
    icon: "ADS",
    packageType: "pro",
    shortDescription: "Gere anuncios curtos por canal com CTA claro, WhatsApp e versao para panfleto.",
    heroDescription: "Crie anuncios locais que explicam a oferta com clareza e ja nascem prontos para canais reais de bairro, comunidade e WhatsApp.",
    actualPath: "/sextou-tools-pro/local-ads",
    availability: "live",
    features: [
      "Gera headline, descricao e CTA para divulgacao local.",
      "Entrega variacoes por canal sem depender de agencia.",
      "Cria versao curta para WhatsApp e versao simples para panfleto.",
      "Ajuda a testar angulos diferentes para a mesma oferta.",
    ],
    practicalExamples: [
      "Divulgar promocao de manicure para a comunidade brasileira da cidade.",
      "Criar texto de panfleto para servico residencial local.",
      "Montar anuncio de abertura de agenda para prestador de servicos.",
    ],
    exampleTitle: "Uso real para pequenos negocios",
    exampleOutcome: "Um negocio local testa tres abordagens para a mesma oferta e descobre qual gera mais conversa no WhatsApp.",
  },
  {
    slug: "launch-plan-48h",
    title: "Plano de Lancamento em 48 Horas",
    icon: "48H",
    packageType: "pro",
    shortDescription: "Monte um plano curto com checklist, cronograma, mensagens e metricas para lancar rapido.",
    heroDescription: "Ideal para quem precisa colocar uma campanha no ar em dois dias sem deixar pontas soltas pelo caminho.",
    actualPath: "/sextou-tools-pro/launch-plan-48h",
    availability: "live",
    features: [
      "Organiza checklist, cronograma e mensagens por etapa.",
      "Quebra o lancamento em tarefas executaveis nas proximas 48 horas.",
      "Ajuda a alinhar conteudo, anuncio e follow-up no mesmo plano.",
      "Traz metricas simples para acompanhar a resposta da campanha.",
    ],
    practicalExamples: [
      "Lancar uma nova turma de curso local em dois dias.",
      "Abrir agenda promocional para feriado ou semana especial.",
      "Estruturar campanha relampago para servico sazonal.",
    ],
    exampleTitle: "Aplicacao em campanha rapida",
    exampleOutcome: "Em vez de postar correndo e esquecer o resto, o empreendedor recebe um plano completo do que fazer, quando publicar e como acompanhar.",
  },
  {
    slug: "service-pricing",
    title: "Precificador Simples de Servicos",
    icon: "PRC",
    packageType: "pro",
    shortDescription: "Estime faixas de preco com calculo base, explicacao comercial e alerta de valor baixo.",
    heroDescription: "Pare de chutar preco no susto e passe a defender seu valor com uma faixa coerente e explicavel.",
    actualPath: "/sextou-tools-pro/service-pricing",
    availability: "live",
    features: [
      "Calcula faixas minima, recomendada e premium.",
      "Cruza horas, custos, margem e complexidade.",
      "Entrega argumento comercial para apresentar o valor ao cliente.",
      "Aponta quando o preco esta baixo demais para ser sustentavel.",
    ],
    practicalExamples: [
      "Definir quanto cobrar por social media mensal.",
      "Montar faixa de preco para limpeza profunda ou pintura.",
      "Rever um servico subprecificado antes de renovar contrato.",
    ],
    exampleTitle: "Na vida do empreendedor",
    exampleOutcome: "Em poucos minutos, o prestador sai de um numero inseguro para uma faixa defendivel, com margem e narrativa de valor.",
  },
  {
    slug: "local-partnerships",
    title: "Ideias de Parcerias Locais",
    icon: "LNK",
    packageType: "pro",
    shortDescription: "Gere 10 ideias praticas de parceria por categoria com mensagem inicial e campanha conjunta.",
    heroDescription: "Encontre novas portas de entrada no mercado local sem depender apenas de anuncio ou indicacao espontanea.",
    actualPath: "/sextou-tools-pro/local-partnerships",
    availability: "live",
    features: [
      "Sugere parceiros com fit comercial para seu publico.",
      "Monta abordagem inicial sem soar genérica.",
      "Propõe acao conjunta simples para ativar a parceria.",
      "Ajuda a criar um pipeline local de oportunidades.",
    ],
    practicalExamples: [
      "Uma empresa de limpeza busca parceria com corretores e administradores.",
      "Uma confeiteira local encontra negocios complementares para kits e datas especiais.",
      "Um personal trainer mapeia colaboracoes com clinicas e studios.",
    ],
    exampleTitle: "Onde isso ajuda",
    exampleOutcome: "O empreendedor sai com parceiros possiveis, mensagem inicial e ideia de campanha conjunta para testar ainda na mesma semana.",
  },
  {
    slug: "creative-brief",
    title: "Briefing de Logo, Site ou Material Grafico",
    icon: "BRF",
    packageType: "pro",
    shortDescription: "Organize um briefing criativo claro para designer, agencia ou servico pago.",
    heroDescription: "Evite retrabalho com designers e agencias entregando um briefing claro, objetivo e facil de executar.",
    actualPath: "/sextou-tools-pro/creative-brief",
    availability: "live",
    features: [
      "Estrutura objetivo, mensagem e direcao visual do projeto.",
      "Lista conteudos obrigatorios e referencias chave.",
      "Organiza perguntas pendentes antes de contratar o servico.",
      "Ajuda a pedir o material certo logo na primeira rodada.",
    ],
    practicalExamples: [
      "Pedir uma nova logo sem parecer que voce quer 'qualquer coisa bonita'.",
      "Encomendar um flyer promocional para evento local.",
      "Briefar um site institucional com CTA claro para WhatsApp.",
    ],
    exampleTitle: "Exemplo de impacto",
    exampleOutcome: "Com um briefing pronto, o empreendedor ganha velocidade, reduz revisoes e melhora a qualidade do material entregue.",
  },
  {
    slug: "gerador-oferta-irresistivel",
    title: "Gerador de Oferta Irresistivel",
    icon: "OF",
    packageType: "pro",
    shortDescription: "Transforme servicos e produtos em uma oferta clara, forte e facil de comunicar.",
    heroDescription: "Pegue um servico comum e transforme em uma oferta mais clara, desejavel e facil de vender.",
    actualPath: "/sextou-tools-pro/gerador-oferta-irresistivel",
    availability: "live",
    features: [
      "Cria headline, pacote, bonus e CTA.",
      "Ajuda a estruturar urgencia sem apelar.",
      "Deixa a proposta mais facil de entender e repetir.",
      "Conecta problema do cliente com promessa mais forte.",
    ],
    practicalExamples: [
      "Empacotar um servico de limpeza em formato promocional.",
      "Transformar consultoria avulsa em pacote mais valioso.",
      "Criar oferta de abertura para agenda de um novo mes.",
    ],
    exampleTitle: "O que muda na pratica",
    exampleOutcome: "Em vez de vender 'horas de servico', o empreendedor passa a vender uma solucao com nome, estrutura e argumentos claros.",
  },
  {
    slug: "calendario-conteudo-7-dias",
    title: "Calendario de Conteudo de 7 Dias",
    icon: "7D",
    packageType: "pro",
    shortDescription: "Planeje uma semana de posts com tema, legenda curta, CTA e ideia visual.",
    heroDescription: "Tire o peso de pensar no que postar todos os dias e ganhe uma semana inteira de conteudo estruturado.",
    actualPath: "/sextou-tools-pro/calendario-conteudo-7-dias",
    availability: "live",
    features: [
      "Entrega 7 ideias de post com objetivo definido.",
      "Inclui legenda curta, CTA e orientacao visual.",
      "Equilibra autoridade, relacionamento e venda.",
      "Ajuda a manter consistencia sem travar na criacao.",
    ],
    practicalExamples: [
      "Planejar uma semana de conteudo para Instagram de negocio local.",
      "Montar posts para aquecer uma oferta antes de lancar.",
      "Criar rotina de publicacao para quem posta so quando lembra.",
    ],
    exampleTitle: "Rotina mais leve",
    exampleOutcome: "O empreendedor abre a semana sabendo exatamente o que publicar e como conectar cada post com uma conversa comercial.",
  },
  {
    slug: "proposta-comercial-one-page",
    title: "Proposta Comercial One-Page",
    icon: "1P",
    packageType: "pro",
    shortDescription: "Gere uma proposta curta e profissional para revisar e enviar rapidamente.",
    heroDescription: "Ganhe agilidade para enviar propostas bonitas, claras e com cara de fechamento, mesmo sem montar PDF do zero.",
    actualPath: "/sextou-tools-pro/proposta-comercial-one-page",
    availability: "live",
    features: [
      "Estrutura proposta de uma pagina com foco em decisao.",
      "Organiza objetivo, escopo, prazo e proximo passo.",
      "Evita propostas longas demais e confusas.",
      "Facilita revisao rapida antes de enviar ao cliente.",
    ],
    practicalExamples: [
      "Enviar proposta de social media no mesmo dia da reuniao.",
      "Responder pedido de orçamento de forma mais profissional.",
      "Padronizar propostas para servicos recorrentes.",
    ],
    exampleTitle: "Velocidade com clareza",
    exampleOutcome: "Em vez de demorar dias montando proposta, o empreendedor sai com uma versao enxuta, convincente e pronta para revisar.",
  },
  {
    slug: "roteiro-reels-shorts-30s",
    title: "Roteiro de Reels/Shorts de 30s",
    icon: "30",
    packageType: "pro",
    shortDescription: "Estruture gancho, fala, cenas e CTA para videos verticais curtos.",
    heroDescription: "Transforme uma ideia simples em video curto com abertura forte, roteiro claro e CTA que puxa conversa.",
    actualPath: "/sextou-tools-pro/roteiro-reels-shorts-30s",
    availability: "live",
    features: [
      "Monta gancho, desenvolvimento e CTA em 30 segundos.",
      "Ajuda a gravar com celular sem depender de roteiro longo.",
      "Conecta conteudo com objetivo comercial real.",
      "Reduz o bloqueio de 'sei o que falar, mas nao como dizer'.",
    ],
    practicalExamples: [
      "Criar video curto para divulgar servico local.",
      "Responder duvida frequente em formato de autoridade.",
      "Aquecer oferta semanal com conteudo rapido para Instagram.",
    ],
    exampleTitle: "Conteudo gravavel de verdade",
    exampleOutcome: "O empreendedor grava mais rapido porque ja recebe a ordem das falas, o gancho e o CTA final para o WhatsApp.",
  },
  {
    slug: "pitch-30-seconds",
    title: "Pitch de 30 Segundos",
    icon: "P30",
    packageType: "pro",
    shortDescription: "Crie uma apresentacao curta, clara e memoravel para networking, WhatsApp e video.",
    heroDescription: "Aprenda a explicar o que voce faz sem enrolar e sem soar generico em reunioes, grupos e mensagens.",
    actualPath: "/sextou-tools-pro/pitch-30-seconds",
    availability: "live",
    features: [
      "Resume o negocio em uma fala curta e memoravel.",
      "Ajuda a apresentar problema, publico e diferencial.",
      "Funciona para networking, video e mensagem direta.",
      "Evita respostas vagas quando perguntam 'o que voce faz?'.",
    ],
    practicalExamples: [
      "Se apresentar em grupo de networking.",
      "Gravar video de apresentacao do negocio.",
      "Abrir conversa com possivel parceiro ou cliente.",
    ],
    exampleTitle: "Quando isso aparece",
    exampleOutcome: "Em vez de travar ou falar demais, o empreendedor passa a repetir uma mensagem curta que as pessoas entendem e lembram.",
  },
  {
    slug: "professional-bio",
    title: "Bio Profissional",
    icon: "BIO",
    packageType: "pro",
    shortDescription: "Gere bios prontas para Instagram, Google e LinkedIn com CTA claro e posicionamento.",
    heroDescription: "Melhore sua primeira impressao digital com uma bio que explica valor e convida a agir.",
    actualPath: "/sextou-tools-pro/professional-bio",
    availability: "live",
    features: [
      "Cria bio para Instagram, LinkedIn e perfis locais.",
      "Deixa claro o servico, publico e CTA.",
      "Evita bios vagas cheias de frases bonitas e pouca acao.",
      "Ajuda a alinhar posicionamento com a oferta do negocio.",
    ],
    practicalExamples: [
      "Atualizar Instagram profissional para captar mais mensagens.",
      "Reescrever perfil do Google Business com mais clareza.",
      "Montar bio de LinkedIn para consultor ou prestador de servicos.",
    ],
    exampleTitle: "Impacto imediato",
    exampleOutcome: "Uma bio melhorada aumenta a chance de o visitante entender em segundos o que o negocio faz e como entrar em contato.",
  },
  {
    slug: "faq-objections",
    title: "FAQ & Objecoes",
    icon: "FAQ",
    packageType: "pro",
    shortDescription: "Monte perguntas frequentes e respostas comerciais para reduzir atrito no atendimento.",
    heroDescription: "Antecipe duvidas e objecoes do cliente antes que elas travem sua venda no inbox ou no WhatsApp.",
    actualPath: "/sextou-tools-pro/faq-objections",
    availability: "live",
    features: [
      "Organiza perguntas frequentes com respostas reutilizaveis.",
      "Ajuda a tratar objecoes de preco, prazo e confianca.",
      "Gera material que pode virar FAQ de site, perfil ou atendimento.",
      "Reduz o desgaste de responder sempre as mesmas duvidas.",
    ],
    practicalExamples: [
      "Preparar respostas para clientes que acham o preco alto.",
      "Criar FAQ para servico residencial ou produto artesanal.",
      "Treinar equipe pequena com respostas mais consistentes.",
    ],
    exampleTitle: "Aplicacao no atendimento",
    exampleOutcome: "O empreendedor transforma duvidas recorrentes em arsenal comercial pronto para copiar, adaptar e publicar.",
  },
  {
    slug: "storybrand-strategy-generator",
    title: "Clareza — StoryBrand SB7",
    icon: "SB7",
    packageType: "premium",
    shortDescription: "Transforme ideias de marketing em uma estrategia de marca clara baseada no metodo StoryBrand SB7.",
    heroDescription: "Para quem quer subir o nivel do posicionamento e criar uma mensagem central forte, consistente e vendavel.",
    actualPath: "/sextou-tools-pro/storybrand-strategy-generator",
    availability: "live",
    features: [
      "Cria BrandScript completo com a estrutura SB7.",
      "Gera one-liner, wireframe de homepage e e-mails de apoio.",
      "Ajuda a organizar a narrativa da marca com mais clareza.",
      "Eleva o discurso comercial para alem de posts isolados.",
    ],
    practicalExamples: [
      "Reposicionar uma agencia local que parece 'igual a todas'.",
      "Criar mensagem central para um curso, mentoria ou consultoria.",
      "Reestruturar a homepage de um negocio com foco em conversao.",
    ],
    exampleTitle: "Quando o Premium faz sentido",
    exampleOutcome: "Um empreendedor deixa de falar apenas de servicos e passa a comunicar uma jornada clara, com problema, promessa e proximo passo bem definidos.",
  },
  {
    slug: "youtube-growth-studio",
    title: "YouTube Growth Studio AI",
    icon: "YT",
    packageType: "premium",
    shortDescription: "Gere um plano completo com cronograma, roteiros, titulos, descricoes, tags e briefings de thumbnails.",
    heroDescription: "Transforme YouTube em canal de autoridade e descoberta, com plano editorial completo e reaproveitamento de conteudo.",
    actualPath: "/sextou-tools-pro/youtube-growth-studio",
    availability: "live",
    features: [
      "Planeja calendario de videos e Shorts com intencao estrategica.",
      "Cria roteiros, titulos, descricoes e hashtags.",
      "Sugere thumbnails e conteudos derivados para outras redes.",
      "Ajuda a transformar video em ativo recorrente de autoridade.",
    ],
    practicalExamples: [
      "Planejar um canal de negocio local para brasileiros nos EUA.",
      "Criar conteudo que educa e gera pedidos de orçamento.",
      "Reaproveitar um video em Shorts, carrossel e post promocional.",
    ],
    exampleTitle: "Visao pratica",
    exampleOutcome: "Com um unico briefing, o empreendedor recebe um plano inteiro de conteudo para YouTube e seus desdobramentos de marketing.",
  },
  {
    slug: "social-network-studio",
    title: "EasySocial - Network Studio",
    icon: "ES",
    packageType: "premium",
    shortDescription: "Crie campanhas e copys baseadas nos 42 ensinamentos de copy de resposta direta.",
    heroDescription: "Uma maquina de campanhas, narrativas e copies para quem quer vender nas redes com muito mais refinamento estrategico.",
    actualPath: "/sextou-tools-pro/social-network-studio",
    availability: "live",
    features: [
      "Estrutura campanhas com base em principios de copy de resposta direta.",
      "Organiza promessa, prova, objecoes e sequencia criativa.",
      "Ajuda a construir campanhas mais robustas do que um post isolado.",
      "Entrega dossie de campanha para reaproveitar em multiplos canais.",
    ],
    practicalExamples: [
      "Preparar campanha mensal de uma mentoria ou servico premium.",
      "Criar nova narrativa para vender um servico local recorrente.",
      "Montar campanha com angulos, copys e conteudos derivados.",
    ],
    exampleTitle: "Uso para crescer com mais estrategia",
    exampleOutcome: "Em vez de improvisar post por post, o empreendedor cria uma campanha coerente, com oferta, mensagem e sequencia pensadas para conversao.",
  },
  {
    slug: "zapleads",
    title: "ZapLeads CRM & Extrator",
    icon: "ZAP",
    packageType: "premium",
    shortDescription: "Extraia contatos de grupos e crie um funil Kanban integrado ao WhatsApp.",
    heroDescription: "Conecte prospeccao, organizacao comercial e follow-up em um unico fluxo centrado no WhatsApp.",
    actualPath: "/sextou-tools-pro/zapleads",
    availability: "live",
    features: [
      "Organiza leads em etapas visuais de Kanban.",
      "Integra extracao de contatos e acompanhamento comercial.",
      "Centraliza mensagens e proximos passos por lead.",
      "Ajuda a transformar volume de conversa em pipeline real.",
    ],
    practicalExamples: [
      "Organizar contatos de grupos de networking e comunidade.",
      "Separar leads quentes, em conversa e em follow-up.",
      "Criar rotina comercial mais disciplinada no WhatsApp.",
    ],
    exampleTitle: "Aplicacao no comercial",
    exampleOutcome: "O empreendedor para de depender de memoria e passa a enxergar quem esta entrando, quem travou e quem precisa de proximo toque.",
  },
  {
    slug: "launch-studio-pro",
    title: "Launch Studio PRO",
    icon: "PLF",
    packageType: "premium",
    shortDescription: "Sua fabrica de Formulas de Lancamento baseada na Product Launch Formula (PLF).",
    heroDescription: "Para estruturacoes de lancamento mais profundas, com narrativa, sequencia e ativos de campanha orientados por metodo.",
    actualPath: "/sextou-tools-pro/launch-studio-pro",
    availability: "coming-soon",
    features: [
      "Planeja estrutura de lancamento por etapas e janelas.",
      "Ajuda a construir aquecimento, abertura e fechamento.",
      "Conecta copy, conteudo e oferta em uma mesma logica.",
      "Foi pensado para ofertas que exigem campanha mais completa.",
    ],
    practicalExamples: [
      "Preparar lancamento de curso, mentoria ou programa em grupo.",
      "Organizar agenda de campanha para produto digital ou premium.",
      "Subir o nivel de uma oferta que ja nao cabe em posts soltos.",
    ],
    exampleTitle: "Visao do que vem",
    exampleOutcome: "O empreendedor passa a enxergar seu lancamento como sistema, nao apenas como serie de posts e mensagens corridas.",
  },
]

export function getSextouToolsShowcaseApps() {
  return showcaseApps
}

export function getSextouToolsShowcaseApp(slug: string) {
  return showcaseApps.find((app) => app.slug === slug)
}

export function getSextouToolsShowcaseHref(slug: string) {
  return `/sextou-tools-apps/${slug}`
}

export function getSextouToolsShowcaseAccessHref(slug: string) {
  const app = getSextouToolsShowcaseApp(slug)
  return app ? `/sextou-tools-pro/acesso?next=${encodeURIComponent(app.actualPath)}` : "/sextou-tools-pro/acesso"
}

export function isSextouToolsPremiumShowcase(slug: string) {
  const app = getSextouToolsShowcaseApp(slug)
  return app?.packageType === "premium"
}

export function canOpenSextouToolsShowcaseApp(
  slug: string,
  user?: { hasActiveAds?: boolean; isPremium?: boolean } | null,
) {
  const app = getSextouToolsShowcaseApp(slug)

  if (!app || app.availability !== "live" || !user?.hasActiveAds) {
    return false
  }

  return app.packageType === "pro" ? true : !!user.isPremium
}

export function getSextouToolsShowcaseSummary(slug: string) {
  const showcaseApp = getSextouToolsShowcaseApp(slug)

  if (showcaseApp) {
    return showcaseApp
  }

  const catalogTool = getSextouToolsProTool(slug)

  if (!catalogTool) {
    return null
  }

  return {
    slug: catalogTool.slug,
    title: catalogTool.title,
    icon: catalogTool.icon,
    packageType: getSextouToolsProCatalog().some((tool) => tool.slug === slug) ? "pro" : "premium",
    shortDescription: catalogTool.shortDescription,
    heroDescription: catalogTool.description,
    actualPath: `/sextou-tools-pro/${catalogTool.slug}`,
    availability: "live",
    features: [catalogTool.description, catalogTool.coachTip, ...catalogTool.nextActions].slice(0, 4),
    practicalExamples: [catalogTool.exampleOutput],
    exampleTitle: catalogTool.exampleTitle,
    exampleOutcome: catalogTool.exampleOutput,
  } satisfies SextouToolsShowcaseApp
}
