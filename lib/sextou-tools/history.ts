import { prisma } from "@/lib/prisma"
import { ToolkitExecutionPayload } from "@/types/sextou-tools"
import {
  rethrowIfNotToolkitSchemaError,
  throwToolkitDatabaseUnavailable,
} from "@/lib/sextou-tools/prisma-guards"

export async function listRecentToolkitExecutions(userId: string, limit = 10) {
  try {
    return await prisma.toolExecution.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  } catch (error) {
    rethrowIfNotToolkitSchemaError(error)
    return []
  }
}

export async function listRecentToolkitExecutionsByTool(
  userId: string,
  toolSlug: string,
  limit = 10
) {
  try {
    return await prisma.toolExecution.findMany({
      where: { userId, toolSlug },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  } catch (error) {
    rethrowIfNotToolkitSchemaError(error)
    return []
  }
}

export async function recordToolkitExecution(
  userId: string,
  toolSlug: string,
  payload: ToolkitExecutionPayload = {}
) {
  try {
    return await prisma.toolExecution.create({
      data: {
        userId,
        toolSlug,
        inputJson: payload.input ?? undefined,
        outputJson: payload.output ?? undefined,
        metadataJson: payload.metadata ?? undefined,
      },
    })
  } catch (error) {
    throwToolkitDatabaseUnavailable(error)
  }
}
