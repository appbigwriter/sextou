import { prisma } from "@/lib/prisma"
import { getSextouToolsProDefinition, SextouToolsProAppId } from "@/lib/sextou-tools-pro/schemas"

const defaultModel = process.env.OPENAI_MODEL || "gpt-4o-mini"

function stringifyInput(input: Record<string, unknown>) {
  return Object.entries(input)
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : String(value ?? "")}`)
    .join("\n")
}

function buildSystemPrompt(appId: SextouToolsProAppId) {
  if (appId === "respostas-prontas-whatsapp") {
    return "Voce gera respostas comerciais curtas e objetivas para WhatsApp. Evite agressividade, juridiquês e promessas exageradas. Retorne apenas JSON valido."
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
