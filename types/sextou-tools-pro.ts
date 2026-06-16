export type SextouToolsProStatus = "live" | "beta" | "planned"

export type SextouToolsProCategory =
  | "communication"
  | "sales"
  | "content"

export interface SextouToolsProTool {
  slug: string
  title: string
  shortDescription: string
  description: string
  category: SextouToolsProCategory
  status: SextouToolsProStatus
  icon: string
  coachTip: string
  exampleTitle: string
  exampleOutput: string
  nextActions: string[]
}

export type SextouToolsProGenerationStatus = "ACTIVE" | "ARCHIVED" | "DELETED"
export type SextouToolsProGenerationSourceAction = "GENERATE" | "REGENERATE" | "DUPLICATE"

export interface SextouToolsProGenerationInput {
  appId: string
  input: Record<string, unknown>
  language?: string
  sourceGenerationId?: string
  sourceAction?: SextouToolsProGenerationSourceAction
}

export interface SextouToolsProGenerationActionInput {
  action:
    | "favorite"
    | "unfavorite"
    | "archive"
    | "restore"
    | "delete"
    | "set-operational-status"
    | "set-calendar-post-published"
  operationalStatus?: string
  postIndex?: number
  published?: boolean
}
