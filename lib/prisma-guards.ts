import { Prisma } from "@prisma/client"

export function isDatabaseUnavailableError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P1001", "P1002", "P1017", "P2021", "P2022"].includes(error.code)
  }

  return (
    error instanceof Error &&
    (error.message.includes("Can't reach database server") ||
      error.message.includes("database server") ||
      error.message.includes("prepared statement"))
  )
}
