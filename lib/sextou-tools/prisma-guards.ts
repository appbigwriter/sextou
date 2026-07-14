import { Prisma } from "@prisma/client"

export class ToolkitDatabaseUnavailableError extends Error {
  constructor() {
    super("toolkit-db-unavailable")
    this.name = "ToolkitDatabaseUnavailableError"
  }
}

export function isToolkitSchemaUnavailable(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2021" || error.code === "P2022"
  }

  return false
}

// Substrings que indicam bloqueio por RLS (Row Level Security) ou falta de grant
// no Postgres. Quando o role do DATABASE_URL nao consegue ler/escrever uma tabela
// (RLS ativo sem BYPASSRLS, ou permissoes ausentes), o erro chega aqui e precisa
// ser tratado como indisponibilidade - nunca como crash que deixa a pagina em branco.
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

/**
 * Detecta erros de permissao/RLS do Postgres. O erro de permissao costuma chegar
 * como P2010 (Raw query failed) envolvendo "permission denied for table X", ou
 * diretamente pela mensagem do Postgres (42501 insufficient_privilege).
 */
export function isToolkitPermissionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const message = error.message || ""

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2010 = Raw query failed (comum em negacao de permissao).
    if (error.code === "P2010" && messageMatchesPermissionError(message)) {
      return true
    }
  }

  return messageMatchesPermissionError(message)
}

export function isToolkitDatabaseConnectionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1001" || error.code === "P1002" || error.code === "P1017"
  }

  return error instanceof Error && error.message.includes("Can't reach database server")
}

/**
 * Verdadeiro quando qualquer erro impede o app de acessar o banco de forma segura:
 * conexao recusada, schema ausente OU bloqueio por RLS/permissao. Centraliza os
 * tres motivos de degradacao graceful para evitar telas em branco.
 */
export function isToolkitDatabaseUnavailable(error: unknown): boolean {
  return (
    isToolkitDatabaseConnectionError(error) ||
    isToolkitSchemaUnavailable(error) ||
    isToolkitPermissionError(error)
  )
}

export function rethrowIfNotToolkitSchemaError(error: unknown) {
  if (!isToolkitSchemaUnavailable(error)) {
    throw error
  }
}

export function throwToolkitDatabaseUnavailable(error: unknown): never {
  if (isToolkitDatabaseUnavailable(error)) {
    throw new ToolkitDatabaseUnavailableError()
  }

  throw error
}
