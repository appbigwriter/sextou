import { prisma } from "@/lib/prisma"
import { ToolkitExecutionPayload } from "@/types/sextou-tools"

export async function listRecentToolkitExecutions(userId: string, limit = 10) {
  return prisma.toolExecution.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function listRecentToolkitExecutionsByTool(
  userId: string,
  toolSlug: string,
  limit = 10
) {
  return prisma.toolExecution.findMany({
    where: { userId, toolSlug },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function recordToolkitExecution(
  userId: string,
  toolSlug: string,
  payload: ToolkitExecutionPayload = {}
) {
  return prisma.toolExecution.create({
    data: {
      userId,
      toolSlug,
      inputJson: payload.input ?? undefined,
      outputJson: payload.output ?? undefined,
      metadataJson: payload.metadata ?? undefined,
    },
  })
}
