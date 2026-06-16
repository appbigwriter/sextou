import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  rethrowIfNotSextouToolsProSchemaError,
  throwSextouToolsProDatabaseUnavailable,
} from "@/lib/sextou-tools-pro/prisma-guards"

export const SEXTTOU_TOOLS_PRO_DAILY_LIMIT = 5
export const SEXTTOU_TOOLS_PRO_REGEN_LIMIT = 2

function getDayBounds() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return { start, end }
}

export async function listSextouToolsProUsageSummary(userId: string) {
  const { start, end } = getDayBounds()

  try {
    const usedToday = await prisma.sextouToolsProUsageEvent.count({
      where: {
        userId,
        actionType: { in: ["GENERATE", "REGENERATE"] },
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    })

    return {
      dailyLimit: SEXTTOU_TOOLS_PRO_DAILY_LIMIT,
      usedToday,
      remainingToday: Math.max(SEXTTOU_TOOLS_PRO_DAILY_LIMIT - usedToday, 0),
    }
  } catch (error) {
    rethrowIfNotSextouToolsProSchemaError(error)
    return {
      dailyLimit: SEXTTOU_TOOLS_PRO_DAILY_LIMIT,
      usedToday: 0,
      remainingToday: SEXTTOU_TOOLS_PRO_DAILY_LIMIT,
    }
  }
}

export async function assertSextouToolsProUsageAllowed(
  userId: string,
  sourceGenerationId?: string,
  sourceAction: "GENERATE" | "REGENERATE" | "DUPLICATE" = "GENERATE"
) {
  const { remainingToday } = await listSextouToolsProUsageSummary(userId)

  if (sourceAction !== "DUPLICATE" && remainingToday <= 0) {
    throw new Error("daily-limit-reached")
  }

  if (sourceAction === "REGENERATE" && sourceGenerationId) {
    const regenerationCount = await prisma.sextouToolsProUsageEvent.count({
      where: {
        userId,
        generationId: sourceGenerationId,
        actionType: "REGENERATE",
      },
    }).catch((error) => {
      rethrowIfNotSextouToolsProSchemaError(error)
      return 0
    })

    if (regenerationCount >= SEXTTOU_TOOLS_PRO_REGEN_LIMIT) {
      throw new Error("regeneration-limit-reached")
    }
  }
}

export async function recordSextouToolsProUsageEvent(
  userId: string,
  appId: string,
  actionType: string,
  generationId?: string
) {
  try {
    return await prisma.sextouToolsProUsageEvent.create({
      data: {
        userId,
        appId,
        actionType,
        generationId: generationId || undefined,
      },
    })
  } catch (error) {
    throwSextouToolsProDatabaseUnavailable(error)
  }
}

export function isSextouToolsProUsageLimitError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message === "daily-limit-reached" || error.message === "regeneration-limit-reached")
  )
}
