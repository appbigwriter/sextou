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

export function isSextouToolsProDatabaseConnectionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1001" || error.code === "P1002" || error.code === "P1017"
  }

  return error instanceof Error && error.message.includes("Can't reach database server")
}

export function rethrowIfNotSextouToolsProSchemaError(error: unknown) {
  if (!isSextouToolsProSchemaUnavailable(error)) {
    throw error
  }
}

export function throwSextouToolsProDatabaseUnavailable(error: unknown): never {
  if (
    isSextouToolsProSchemaUnavailable(error) ||
    isSextouToolsProDatabaseConnectionError(error)
  ) {
    throw new SextouToolsProDatabaseUnavailableError()
  }

  throw error
}
