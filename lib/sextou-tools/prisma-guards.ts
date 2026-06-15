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

export function isToolkitDatabaseConnectionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1001" || error.code === "P1002" || error.code === "P1017"
  }

  return error instanceof Error && error.message.includes("Can't reach database server")
}

export function rethrowIfNotToolkitSchemaError(error: unknown) {
  if (!isToolkitSchemaUnavailable(error)) {
    throw error
  }
}

export function throwToolkitDatabaseUnavailable(error: unknown): never {
  if (isToolkitSchemaUnavailable(error)) {
    throw new ToolkitDatabaseUnavailableError()
  }

  throw error
}
