import { SextouToolsProTool } from "@/types/sextou-tools-pro"

const sextouToolsProCatalog: SextouToolsProTool[] = [
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
