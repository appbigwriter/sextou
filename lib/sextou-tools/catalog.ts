import { ToolkitTool } from "@/types/sextou-tools"

const toolkitCatalog: ToolkitTool[] = [
  {
    slug: "gerador-qr-code",
    title: "Gerador de QR Code",
    shortDescription: "Crie QR Codes de WhatsApp, site, Google Review, Wi-Fi e mais.",
    description: "Ferramenta para gerar QR Codes prontos para marketing, atendimento e operacao local.",
    phase: 2,
    status: "live",
    icon: "QR",
    highlight: "Ja disponivel na suite.",
    category: "marketing",
    plannedFeatures: ["QR por tipo", "Preview em tempo real", "Download PNG/SVG", "Historico por usuario"],
  },
  {
    slug: "calculadora-preco-servico",
    title: "Calculadora de Preco de Servico",
    shortDescription: "Defina preco minimo, ideal e margem do seu servico.",
    description: "Calculadora para precificacao de servicos considerando custos, horas, taxas e lucro desejado.",
    phase: 2,
    status: "live",
    icon: "$",
    highlight: "Ja disponivel para calculo de margem e taxas.",
    category: "pricing",
    plannedFeatures: ["Memoria de calculo", "Preco minimo e ideal", "Copia de resumo", "Historico por usuario"],
  },
  {
    slug: "calculadora-roi-campanha",
    title: "Calculadora de ROI de Campanha",
    shortDescription: "Entenda ROI, ROAS, conversao e custo por lead.",
    description: "Calculadora de retorno para campanhas de Google, Meta, revista, radio, evento ou indicacao.",
    phase: 2,
    status: "live",
    icon: "%",
    highlight: "Ja disponivel para diagnostico rapido de campanha.",
    category: "marketing",
    plannedFeatures: ["ROI e ROAS", "Diagnostico textual", "Canal da campanha", "Historico por usuario"],
  },
  {
    slug: "checklist-abertura-empresa",
    title: "Checklist de Abertura de Empresa",
    shortDescription: "Organize os passos para abrir ou estruturar o negocio.",
    description: "Checklist educativo para empreendedores brasileiros nos EUA com progresso salvo por usuario.",
    phase: 2,
    status: "live",
    icon: "OK",
    highlight: "Ja disponivel com progresso salvo por usuario.",
    category: "operations",
    plannedFeatures: ["Etapas por perfil", "Progresso percentual", "Notas do usuario", "Historico por usuario"],
  },
  {
    slug: "gerador-orcamento-pdf",
    title: "Gerador de Orcamento em PDF",
    shortDescription: "Monte orcamentos profissionais para enviar a clientes.",
    description: "Fluxo comercial para criar, revisar e baixar orcamentos com itens, totais e logo.",
    phase: 3,
    status: "live",
    icon: "PDF",
    highlight: "Ja disponivel com PDF e historico por usuario.",
    category: "sales",
    plannedFeatures: ["Multiplos itens", "Preview PDF", "Totais em tempo real", "Rascunhos"],
  },
  {
    slug: "gerenciador-oportunidades-leads",
    title: "Gerenciador de Oportunidades - Leads",
    shortDescription: "Acompanhe status, follow-ups e valor potencial dos leads.",
    description: "Mini CRM para organizar oportunidades comerciais e preparar integracao com orcamentos.",
    phase: 3,
    status: "live",
    icon: "CRM",
    highlight: "Ja disponivel para pipeline comercial inicial.",
    category: "sales",
    plannedFeatures: ["Kanban", "Filtro por status", "Follow-up", "Conversao em cliente"],
  },
  {
    slug: "gerador-invoice-email",
    title: "Gerador de Invoice com E-mail",
    shortDescription: "Crie invoices em PDF e envie ao cliente.",
    description: "Ferramenta financeira para emitir invoices com historico, status e envio por e-mail.",
    phase: 3,
    status: "live",
    icon: "INV",
    highlight: "Ja disponivel com PDF, status e envio por e-mail.",
    category: "sales",
    plannedFeatures: ["PDF profissional", "Status de invoice", "Envio por e-mail", "Historico completo"],
  },
  {
    slug: "gerenciador-projetos-tarefas",
    title: "Gerenciador de Projetos e Tarefas",
    shortDescription: "Organize projetos, responsaveis, prazos e progresso.",
    description: "Ferramenta operacional para pequenas equipes acompanharem execucao e tarefas.",
    phase: 4,
    status: "planned",
    icon: "PM",
    highlight: "Foco em recorrencia e operacao continua.",
    category: "operations",
    plannedFeatures: ["Projetos", "Tarefas", "Kanban", "Progresso por projeto"],
  },
  {
    slug: "diretorio-empresas-brasileiras",
    title: "Diretorio de Empresas Brasileiras",
    shortDescription: "Cadastre, busque e destaque empresas brasileiras nos EUA.",
    description: "Diretorio publico moderado para fortalecer a comunidade e ampliar a visibilidade dos membros.",
    phase: 4,
    status: "planned",
    icon: "DIR",
    highlight: "Modulo comunitario com dados publicos e moderacao.",
    category: "community",
    plannedFeatures: ["Perfil publico", "Busca por categoria", "Aprovacao admin", "Selos de membro"],
  },
]

export function getToolkitCatalog() {
  return toolkitCatalog
}

export function getToolkitTool(slug: string) {
  return toolkitCatalog.find((tool) => tool.slug === slug)
}

export function groupToolkitCatalogByPhase() {
  return {
    phase2: toolkitCatalog.filter((tool) => tool.phase === 2),
    phase3: toolkitCatalog.filter((tool) => tool.phase === 3),
    phase4: toolkitCatalog.filter((tool) => tool.phase === 4),
  }
}
