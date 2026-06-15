import type { Prisma } from "@prisma/client"

export type ToolkitStatus = "planned" | "beta" | "live"

export interface ToolkitTool {
  slug: string
  title: string
  shortDescription: string
  description: string
  phase: 2 | 3 | 4
  status: ToolkitStatus
  icon: string
  highlight: string
  category: "marketing" | "pricing" | "operations" | "sales" | "community"
  plannedFeatures: string[]
}

export interface ToolkitExecutionPayload {
  input?: Prisma.InputJsonValue | null
  output?: Prisma.InputJsonValue | null
  metadata?: Prisma.InputJsonValue | null
}
