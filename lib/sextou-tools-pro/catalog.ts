import { SextouToolsProTool } from "@/types/sextou-tools-pro"

const sextouToolsProCatalog: SextouToolsProTool[] = [
  {
    slug: "business-diagnosis",
    title: "Diagnostico Express do Negocio",
    shortDescription: "Gere um raio-x curto do negocio com prioridades, riscos e plano de 7 dias.",
    description:
      "Mini-app para organizar um diagnostico rapido do negocio com pontos fortes, gargalos, oportunidades, riscos e proximo app recomendado.",
    category: "sales",
    status: "live",
    icon: "DX",
    coachTip: "Explique a dor comercial principal e o canal atual para o diagnostico ficar util e menos generico.",
    exampleTitle: "Diagnostico para servico local",
    exampleOutput:
      "Resumo curto do negocio, 3 forcas, 3 gargalos, 3 oportunidades rapidas, 3 riscos, plano de 7 dias e sugestao do proximo mini-app.",
    nextActions: ["Criar oferta", "Criar calendario", "Criar plano de lancamento"],
  },
  {
    slug: "respostas-prontas-whatsapp",
    title: "Respostas Prontas para WhatsApp",
    shortDescription: "Monte respostas comerciais mais rapidas para atendimento, objeções e follow-up.",
    description:
      "Mini-app focado em atendimento comercial no WhatsApp com respostas curtas, consistentes e prontas para copiar.",
    category: "communication",
    status: "live",
    icon: "WA",
    coachTip: "Descreva o contexto real da conversa para evitar uma resposta generica demais.",
    exampleTitle: "Orcamento atrasado",
    exampleOutput:
      "Oi, [nome]. Separei sua proposta e consigo te enviar hoje ate as 4pm com as opcoes e prazo certinhos. Se quiser, ja deixo uma versao mais enxuta para voce comparar.",
    nextActions: ["Salvar como template", "Criar follow-up", "Criar FAQ do negocio"],
  },
  {
    slug: "follow-up-5-messages",
    title: "Follow-up Comercial em 5 Mensagens",
    shortDescription: "Crie uma sequencia curta para retomar contato sem soar insistente.",
    description:
      "Mini-app para gerar uma sequencia comercial etica com 5 mensagens, intervalos sugeridos e CTA por etapa.",
    category: "sales",
    status: "live",
    icon: "F5",
    coachTip: "Descreva a situacao real do lead para manter o tom util, etico e sem parecer cobranca robotica.",
    exampleTitle: "Follow-up para proposta enviada",
    exampleOutput:
      "Mensagem 1 retoma o contato com contexto, mensagem 2 reforca valor, mensagem 3 reduz friccao, mensagem 4 reabre a conversa e mensagem 5 encerra com elegancia.",
    nextActions: ["Criar resposta para objecao", "Criar proposta comercial", "Criar oferta melhorada"],
  },
  {
    slug: "local-ads",
    title: "Gerador de Anuncios Locais",
    shortDescription: "Gere anuncios curtos por canal com CTA claro, WhatsApp e versao para panfleto.",
    description:
      "Mini-app para montar textos de anuncio local com headline, descricao, CTA e 3 variacoes de abordagem sem abrir escopo para midia paga.",
    category: "sales",
    status: "live",
    icon: "ADS",
    coachTip: "Informe oferta, canal e diferencial para evitar um anuncio generico demais.",
    exampleTitle: "Anuncio para promocao local",
    exampleOutput:
      "Headline clara, descricao curta, CTA direto, versao WhatsApp, versao panfleto e 3 abordagens para testar a oferta.",
    nextActions: ["Criar plano de lancamento", "Criar oferta irresistivel", "Criar sequencia de follow-up"],
  },
  {
    slug: "launch-plan-48h",
    title: "Plano de Lancamento em 48 Horas",
    shortDescription: "Monte um plano curto com checklist, cronograma, mensagens e metricas para lancar rapido.",
    description:
      "Mini-app para transformar uma campanha simples em um plano pratico de 48 horas com tarefas acionaveis, mensagens-chave e acompanhamento leve.",
    category: "sales",
    status: "live",
    icon: "48H",
    coachTip: "Informe oferta, canal, prazo e recursos reais para manter o plano objetivo e executavel.",
    exampleTitle: "Lancamento rapido para servico local",
    exampleOutput:
      "Checklist das proximas 48 horas, cronograma por etapa, mensagens principais, post de anuncio, mensagem de WhatsApp e metricas simples.",
    nextActions: ["Criar anuncio local", "Criar roteiro de Reels", "Criar follow-up da campanha"],
  },
  {
    slug: "service-pricing",
    title: "Precificador Simples de Servicos",
    shortDescription: "Estime faixas de preco com calculo base, explicacao comercial e alerta de valor baixo.",
    description:
      "Mini-app para calcular faixas de precificacao de servicos com base em horas, custos, margem, experiencia e complexidade, usando IA apenas para explicar e apresentar o valor.",
    category: "sales",
    status: "live",
    icon: "PRC",
    coachTip: "Informe horas, custos e margem reais para que a faixa calculada fique defendivel na conversa com o cliente.",
    exampleTitle: "Precificacao para servico premium",
    exampleOutput:
      "Calculo base, faixa minima, faixa recomendada, faixa premium, explicacao simples do preco e sugestao de como apresentar o valor ao cliente.",
    nextActions: ["Criar proposta comercial", "Criar oferta", "Criar resposta para objecao de preco"],
  },
  {
    slug: "local-partnerships",
    title: "Ideias de Parcerias Locais",
    shortDescription: "Gere 10 ideias praticas de parceria por categoria com mensagem inicial e campanha conjunta.",
    description:
      "Mini-app para estruturar parcerias locais por categoria de parceiro, com proposta de abordagem, mensagem inicial e proximo passo recomendado sem listar empresas reais.",
    category: "sales",
    status: "live",
    icon: "LNK",
    coachTip: "Informe publico, objetivo e contexto local para gerar parceiros mais acionaveis e menos vagos.",
    exampleTitle: "Parcerias para negocio local",
    exampleOutput:
      "10 categorias de parceiros locais, motivo da parceria, abordagem inicial, mensagem pronta, campanha conjunta e proximo passo.",
    nextActions: ["Criar mensagem de abordagem", "Criar anuncio local", "Criar plano de lancamento"],
  },
  {
    slug: "creative-brief",
    title: "Briefing de Logo, Site ou Material Grafico",
    shortDescription: "Organize um briefing criativo claro para designer, agencia ou servico pago.",
    description:
      "Mini-app para estruturar briefing criativo com objetivo, mensagem principal, direcao visual, conteudo obrigatorio, perguntas pendentes e checklist de envio.",
    category: "communication",
    status: "live",
    icon: "BRF",
    coachTip: "Informe objetivo, publico e o que precisa entrar no material para o briefing ficar realmente acionavel.",
    exampleTitle: "Briefing para identidade visual simples",
    exampleOutput:
      "Objetivo do projeto, publico, mensagem central, direcao visual, conteudos obrigatorios, perguntas pendentes e checklist final para enviar ao designer.",
    nextActions: ["Solicitar servico pago", "Criar proposta comercial", "Criar anuncio local"],
  },
  {
    slug: "gerador-oferta-irresistivel",
    title: "Gerador de Oferta Irresistivel",
    shortDescription: "Transforme servicos e produtos em uma oferta clara, forte e facil de comunicar.",
    description:
      "Mini-app para estruturar oferta, headline, bonus, urgencia etica e CTA com foco em conversao.",
    category: "sales",
    status: "live",
    icon: "OF",
    coachTip: "Explique o problema principal do cliente antes de falar de preco ou bonus.",
    exampleTitle: "Oferta para limpeza residencial",
    exampleOutput:
      "Pacote Casa Leve: limpeza completa com checklist final, bonus de organizacao de cozinha e agendamento prioritario para novas clientes do mes.",
    nextActions: ["Criar anuncio local", "Criar roteiro de Reels", "Criar proposta comercial"],
  },
  {
    slug: "calendario-conteudo-7-dias",
    title: "Calendario de Conteudo de 7 Dias",
    shortDescription: "Planeje uma semana de posts com tema, legenda curta, CTA e ideia visual.",
    description:
      "Mini-app para empreendedores que precisam consistencia de conteudo sem perder tempo planejando do zero.",
    category: "content",
    status: "live",
    icon: "7D",
    coachTip: "Escolha um unico objetivo da semana para a IA nao misturar venda, autoridade e relacionamento.",
    exampleTitle: "Semana de autoridade",
    exampleOutput:
      "Dia 1: antes e depois de um servico. Dia 2: erro comum do cliente. Dia 3: bastidor rapido. Dia 4: depoimento. Dia 5: oferta leve. Dia 6: FAQ. Dia 7: CTA para WhatsApp.",
    nextActions: ["Gerar roteiro de Reels", "Criar anuncio local", "Criar resposta para comentarios"],
  },
  {
    slug: "proposta-comercial-one-page",
    title: "Proposta Comercial One-Page",
    shortDescription: "Gere uma proposta curta e profissional para revisar e enviar rapidamente.",
    description:
      "Mini-app textual para estruturar proposta comercial de uma pagina sem depender de PDF no primeiro momento.",
    category: "sales",
    status: "live",
    icon: "1P",
    coachTip: "Use o problema do cliente como abertura para que a proposta pareca sob medida.",
    exampleTitle: "Proposta de gestao de redes sociais",
    exampleOutput:
      "Objetivo: melhorar consistencia e conversao. Escopo: 12 posts, 4 Reels, roteiro mensal e acompanhamento semanal. Prazo inicial: 30 dias. Proximo passo: alinhar kickoff.",
    nextActions: ["Criar follow-up da proposta", "Criar oferta irresistivel", "Criar briefing visual"],
  },
  {
    slug: "roteiro-reels-shorts-30s",
    title: "Roteiro de Reels/Shorts de 30s",
    shortDescription: "Estruture gancho, fala, cenas e CTA para videos verticais curtos.",
    description:
      "Mini-app para transformar uma ideia simples em roteiro escaneavel e facil de gravar no celular.",
    category: "content",
    status: "live",
    icon: "30",
    coachTip: "Defina um unico objetivo do video: vender, educar, gerar autoridade ou puxar conversa.",
    exampleTitle: "Video de autoridade para limpeza",
    exampleOutput:
      "Gancho: voce ainda escolhe limpeza so pelo preco? Desenvolvimento: mostre o risco do servico mal feito. CTA: me chama no WhatsApp e eu te envio meu checklist.",
    nextActions: ["Criar legenda do post", "Criar oferta associada", "Criar follow-up"],
  },
  {
    slug: "pitch-30-seconds",
    title: "Pitch de 30 Segundos",
    shortDescription: "Crie uma apresentacao curta, clara e memoravel para networking, WhatsApp e video.",
    description:
      "Mini-app para transformar o que voce faz em um pitch rapido, escaneavel e facil de repetir em varios contextos.",
    category: "communication",
    status: "live",
    icon: "P30",
    coachTip: "Explique para quem voce vende e qual problema resolve antes de falar do seu diferencial.",
    exampleTitle: "Pitch para consultoria comercial",
    exampleOutput:
      "Eu ajudo pequenos negocios a organizar oferta, comunicacao e follow-up para vender com mais clareza e menos improviso.",
    nextActions: ["Criar bio profissional", "Criar roteiro de video", "Criar descricao institucional"],
  },
  {
    slug: "professional-bio",
    title: "Bio Profissional",
    shortDescription: "Gere bios prontas para Instagram, Google e LinkedIn com CTA claro e posicionamento.",
    description:
      "Mini-app para empreendedores que precisam se apresentar melhor em perfis digitais sem escrever tudo do zero.",
    category: "communication",
    status: "live",
    icon: "BIO",
    coachTip: "Defina servico principal, publico e CTA para evitar uma bio vaga demais.",
    exampleTitle: "Bio para negocio local",
    exampleOutput:
      "Atendimento claro, servico profissional e CTA simples para converter visitas em conversa comercial.",
    nextActions: ["Criar calendario de conteudo", "Criar posts de apresentacao", "Criar FAQ do negocio"],
  },
  {
    slug: "faq-objections",
    title: "FAQ & Objecoes",
    shortDescription: "Monte perguntas frequentes e respostas comerciais para reduzir atrito no atendimento.",
    description:
      "Mini-app para transformar duvidas recorrentes e objecoes em respostas curtas, reutilizaveis e mais vendaveis.",
    category: "communication",
    status: "live",
    icon: "FAQ",
    coachTip: "Liste as duvidas e objecoes reais do cliente para a IA nao inventar respostas genericas.",
    exampleTitle: "FAQ para servico residencial",
    exampleOutput:
      "Perguntas frequentes, respostas curtas e objecoes comuns organizadas para WhatsApp, perfil e apresentacao comercial.",
    nextActions: ["Criar respostas de WhatsApp", "Criar bio do negocio", "Criar calendario de conteudo educativo"],
  },
]

export function getSextouToolsProCatalog() {
  return sextouToolsProCatalog
}

export function getSextouToolsProTool(slug: string) {
  return sextouToolsProCatalog.find((tool) => tool.slug === slug)
}

export function groupSextouToolsProCatalogByCategory() {
  return {
    communication: sextouToolsProCatalog.filter((tool) => tool.category === "communication"),
    sales: sextouToolsProCatalog.filter((tool) => tool.category === "sales"),
    content: sextouToolsProCatalog.filter((tool) => tool.category === "content"),
  }
}
