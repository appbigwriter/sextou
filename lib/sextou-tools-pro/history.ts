import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  rethrowIfNotSextouToolsProSchemaError,
  throwSextouToolsProDatabaseUnavailable,
} from "@/lib/sextou-tools-pro/prisma-guards"

export async function listRecentSextouToolsProGenerations(userId: string, limit = 10) {
  try {
    return await prisma.sextouToolsProGeneration.findMany({
      where: {
        userId,
        status: { not: "DELETED" },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  } catch (error) {
    rethrowIfNotSextouToolsProSchemaError(error)
    return []
  }
}

export async function listRecentSextouToolsProGenerationsByApp(
  userId: string,
  appId: string,
  limit = 10
) {
  try {
    return await prisma.sextouToolsProGeneration.findMany({
      where: {
        userId,
        appId,
        status: { not: "DELETED" },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  } catch (error) {
    rethrowIfNotSextouToolsProSchemaError(error)
    return []
  }
}

export async function getSextouToolsProGenerationById(userId: string, generationId: string) {
  try {
    return await prisma.sextouToolsProGeneration.findFirst({
      where: {
        id: generationId,
        userId,
      },
    })
  } catch (error) {
    rethrowIfNotSextouToolsProSchemaError(error)
    return null
  }
}

export async function createSextouToolsProGeneration(input: {
  userId: string
  appId: string
  title: string
  inputData: Prisma.InputJsonValue
  outputData: Prisma.InputJsonValue
  outputText: string
  metadataJson?: Prisma.InputJsonValue
  language: string
  model: string
  promptVersion: string
  sourceAction: string
  sourceGenerationId?: string
}) {
  try {
    return await prisma.sextouToolsProGeneration.create({
      data: {
        userId: input.userId,
        appId: input.appId,
        title: input.title,
        inputData: input.inputData,
        outputData: input.outputData,
        outputText: input.outputText,
        metadataJson: input.metadataJson,
        language: input.language,
        model: input.model,
        promptVersion: input.promptVersion,
        sourceAction: input.sourceAction,
        sourceGenerationId: input.sourceGenerationId || undefined,
      },
    })
  } catch (error) {
    throwSextouToolsProDatabaseUnavailable(error)
  }
}

export async function duplicateSextouToolsProGeneration(userId: string, generationId: string) {
  const existing = await getSextouToolsProGenerationById(userId, generationId)

  if (!existing) {
    throw new Error("generation-not-found")
  }

  try {
    return await prisma.sextouToolsProGeneration.create({
      data: {
        userId,
        appId: existing.appId,
        title: `${existing.title} (copia)`,
        inputData: existing.inputData as Prisma.InputJsonValue,
        outputData: existing.outputData as Prisma.InputJsonValue,
        outputText: existing.outputText,
        metadataJson: (existing.metadataJson as Prisma.InputJsonValue | null) ?? undefined,
        language: existing.language,
        model: existing.model,
        promptVersion: existing.promptVersion,
        sourceAction: "DUPLICATE",
        sourceGenerationId: existing.id,
      },
    })
  } catch (error) {
    throwSextouToolsProDatabaseUnavailable(error)
  }
}

export async function updateSextouToolsProGenerationAction(
  userId: string,
  generationId: string,
  payload: {
    action:
      | "favorite"
      | "unfavorite"
      | "archive"
      | "restore"
      | "delete"
      | "set-operational-status"
      | "set-calendar-post-published"
      | "set-follow-up-message-sent"
      | "set-launch-plan-task-completed"
      | "set-local-partnership-status"
    operationalStatus?: string
    postIndex?: number
    published?: boolean
    messageIndex?: number
    sent?: boolean
    section?: "checklist" | "timeline"
    taskIndex?: number
    completed?: boolean
    partnerIndex?: number
    partnershipStatus?: "novo" | "contatado" | "interessado"
  }
) {
  const existing = await getSextouToolsProGenerationById(userId, generationId)

  if (!existing) {
    throw new Error("generation-not-found")
  }

  try {
    if (payload.action === "favorite" || payload.action === "unfavorite") {
      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { isFavorite: payload.action === "favorite" },
      })
    }

    if (payload.action === "archive") {
      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { status: "ARCHIVED" },
      })
    }

    if (payload.action === "restore") {
      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { status: "ACTIVE" },
      })
    }

    if (payload.action === "set-operational-status") {
      const metadata =
        existing.metadataJson && typeof existing.metadataJson === "object" && !Array.isArray(existing.metadataJson)
          ? { ...(existing.metadataJson as Record<string, unknown>) }
          : {}

      metadata.operationalStatus = payload.operationalStatus || "DRAFT"

      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { metadataJson: metadata as Prisma.InputJsonValue },
      })
    }

    if (payload.action === "set-calendar-post-published") {
      const metadata =
        existing.metadataJson && typeof existing.metadataJson === "object" && !Array.isArray(existing.metadataJson)
          ? { ...(existing.metadataJson as Record<string, unknown>) }
          : {}

      const publishedPosts =
        metadata.publishedPosts && typeof metadata.publishedPosts === "object" && !Array.isArray(metadata.publishedPosts)
          ? { ...(metadata.publishedPosts as Record<string, unknown>) }
          : {}

      if (typeof payload.postIndex !== "number") {
        throw new Error("invalid-post-index")
      }

      publishedPosts[String(payload.postIndex)] = Boolean(payload.published)
      metadata.publishedPosts = publishedPosts

      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { metadataJson: metadata as Prisma.InputJsonValue },
      })
    }

    if (payload.action === "set-follow-up-message-sent") {
      const metadata =
        existing.metadataJson && typeof existing.metadataJson === "object" && !Array.isArray(existing.metadataJson)
          ? { ...(existing.metadataJson as Record<string, unknown>) }
          : {}

      const sentMessages =
        metadata.sentMessages && typeof metadata.sentMessages === "object" && !Array.isArray(metadata.sentMessages)
          ? { ...(metadata.sentMessages as Record<string, unknown>) }
          : {}

      if (typeof payload.messageIndex !== "number") {
        throw new Error("invalid-message-index")
      }

      sentMessages[String(payload.messageIndex)] = Boolean(payload.sent)
      metadata.sentMessages = sentMessages

      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { metadataJson: metadata as Prisma.InputJsonValue },
      })
    }

    if (payload.action === "set-launch-plan-task-completed") {
      const metadata =
        existing.metadataJson && typeof existing.metadataJson === "object" && !Array.isArray(existing.metadataJson)
          ? { ...(existing.metadataJson as Record<string, unknown>) }
          : {}

      if (payload.section !== "checklist" && payload.section !== "timeline") {
        throw new Error("invalid-task-section")
      }

      if (typeof payload.taskIndex !== "number") {
        throw new Error("invalid-task-index")
      }

      const field = payload.section === "checklist" ? "launchPlanChecklist" : "launchPlanTimeline"
      const taskMap =
        metadata[field] && typeof metadata[field] === "object" && !Array.isArray(metadata[field])
          ? { ...(metadata[field] as Record<string, unknown>) }
          : {}

      taskMap[String(payload.taskIndex)] = Boolean(payload.completed)
      metadata[field] = taskMap

      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { metadataJson: metadata as Prisma.InputJsonValue },
      })
    }

    if (payload.action === "set-local-partnership-status") {
      const metadata =
        existing.metadataJson && typeof existing.metadataJson === "object" && !Array.isArray(existing.metadataJson)
          ? { ...(existing.metadataJson as Record<string, unknown>) }
          : {}

      if (typeof payload.partnerIndex !== "number") {
        throw new Error("invalid-partner-index")
      }

      if (
        payload.partnershipStatus !== "novo" &&
        payload.partnershipStatus !== "contatado" &&
        payload.partnershipStatus !== "interessado"
      ) {
        throw new Error("invalid-partnership-status")
      }

      const localPartnershipStatus =
        metadata.localPartnershipStatus &&
        typeof metadata.localPartnershipStatus === "object" &&
        !Array.isArray(metadata.localPartnershipStatus)
          ? { ...(metadata.localPartnershipStatus as Record<string, unknown>) }
          : {}

      localPartnershipStatus[String(payload.partnerIndex)] = payload.partnershipStatus
      metadata.localPartnershipStatus = localPartnershipStatus

      return await prisma.sextouToolsProGeneration.update({
        where: { id: generationId },
        data: { metadataJson: metadata as Prisma.InputJsonValue },
      })
    }

    return await prisma.sextouToolsProGeneration.update({
      where: { id: generationId },
      data: { status: "DELETED" },
    })
  } catch (error) {
    throwSextouToolsProDatabaseUnavailable(error)
  }
}
