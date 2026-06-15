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

export interface ToolkitLineItemInput {
  description: string
  quantity: number
  unitPrice: number
}

export interface ToolkitLeadInput {
  name: string
  companyName?: string
  email?: string
  phone?: string
  source: string
  status: string
  estimatedValue?: number | null
  notes?: string
  tags?: string[]
}

export interface ToolkitQuoteInput {
  leadId?: string | null
  title: string
  clientName: string
  clientCompany?: string
  clientEmail?: string
  clientPhone?: string
  issueDate: string
  validUntil?: string | null
  notes?: string
  taxPercent?: number
  discountAmount?: number
  lineItems: ToolkitLineItemInput[]
}

export interface ToolkitInvoiceInput {
  leadId?: string | null
  quoteId?: string | null
  title: string
  clientName: string
  clientCompany?: string
  clientEmail?: string
  clientPhone?: string
  issueDate: string
  dueDate?: string | null
  notes?: string
  taxPercent?: number
  discountAmount?: number
  emailSubject?: string
  emailMessage?: string
  lineItems: ToolkitLineItemInput[]
}

export interface ToolkitProjectInput {
  name: string
  description?: string
  status: string
  priority: string
  dueDate?: string | null
}

export interface ToolkitTaskInput {
  projectId: string
  title: string
  description?: string
  status: string
  priority: string
  assigneeName?: string
  dueDate?: string | null
}

export interface ToolkitDirectoryEntryInput {
  businessName: string
  ownerName: string
  category: string
  city: string
  state: string
  phone?: string
  whatsapp?: string
  email?: string
  instagram?: string
  website?: string
  shortDescription: string
  servicesSummary?: string
  badgeLabel?: string
  isPublic?: boolean
}
