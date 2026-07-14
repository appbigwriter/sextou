import { Prisma } from "@prisma/client"

export class SextouToolsProDatabaseUnavailableError extends Error {
  constructor() {
    super("sextou-tools-pro-db-unavailable")
    this.name = "SextouToolsProDatabaseUnavailableError"
  }
}

export function isSextouToolsProSchemaUnavailable(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2021" || error.code === "P2022"
  }

  return false
}

// Substrings que indicam bloqueio por RLS (Row Level Security) ou falta de grant
// no Postgres. Quando o role do DATABASE_URL nao consegue ler/escrever uma tabela,
// o erro chega aqui e precisa ser tratado como indisponibilidade graceful (degradar
// para []/null) - nunca como crash que deixa a pagina em branco.
const PERMISSION_ERROR_PATTERNS = [
  "permission denied",
  "insufficient_privilege",
  "row-level security",
  "row level security",
  "rls policy",
  "must have",
  "violates row-level",
  "must be owner",
  "cannot change",
]

function messageMatchesPermissionError(message: string): boolean {
  const lower = (message || "").toLowerCase()
  return PERMISSION_ERROR_PATTERNS.some((pattern) => lower.includes(pattern))
}

export function isSextouToolsProPermissionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const message = error.message || ""

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2010" && messageMatchesPermissionError(message)) {
      return true
    }
  }

  return messageMatchesPermissionError(message)
}

export function isSextouToolsProDatabaseConnectionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1001" || error.code === "P1002" || error.code === "P1017"
  }

  return error instanceof Error && error.message.includes("Can't reach database server")
}

/**
 * Verdadeiro quando qualquer erro impede o acesso ao banco de forma segura:
 * conexao recusada, schema ausente OU bloqueio por RLS/permissao. Centraliza os
 * tres motivos de degradacao graceful para evitar telas em branco.
 */
export function isSextouToolsProDatabaseUnavailable(error: unknown): boolean {
  return (
    isSextouToolsProDatabaseConnectionError(error) ||
    isSextouToolsProSchemaUnavailable(error) ||
    isSextouToolsProPermissionError(error)
  )
}

/**
 * Re-lanca o erro a menos que ele indique indisponibilidade do banco (schema
 * ausente, conexao recusada ou bloqueio por RLS/permissao). Usado pelas funcoes
 * de leitura (listagens, contagens) para degradar para []/null sem crashar a
 * pagina quando o Postgres bloqueia o acesso.
 */
export function rethrowIfNotSextouToolsProSchemaError(error: unknown) {
  if (!isSextouToolsProDatabaseUnavailable(error)) {
    throw error
  }
}

export function throwSextouToolsProDatabaseUnavailable(error: unknown): never {
  if (isSextouToolsProDatabaseUnavailable(error)) {
    throw new SextouToolsProDatabaseUnavailableError()
  }

  throw error
}
