import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  ToolkitDirectoryEntryInput,
  ToolkitInvoiceInput,
  ToolkitLeadInput,
  ToolkitLineItemInput,
  ToolkitProjectInput,
  ToolkitQuoteInput,
  ToolkitTaskInput,
} from "@/types/sextou-tools"

function calculateLineItems(lineItems: ToolkitLineItemInput[]) {
  const normalizedItems = lineItems.map((item) => {
    const quantity = Number.isFinite(item.quantity) ? Math.max(item.quantity, 0) : 0
    const unitPrice = Number.isFinite(item.unitPrice) ? Math.max(item.unitPrice, 0) : 0
    const total = quantity * unitPrice

    return {
      description: item.description.trim() || "Item",
      quantity,
      unitPrice,
      total,
    }
  })

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0)

  return {
    normalizedItems,
    subtotal,
  }
}

function buildDocumentTotals(
  lineItems: ToolkitLineItemInput[],
  taxPercent = 0,
  discountAmount = 0
) {
  const { normalizedItems, subtotal } = calculateLineItems(lineItems)
  const safeTaxPercent = Math.max(taxPercent, 0)
  const safeDiscountAmount = Math.max(discountAmount, 0)
  const taxAmount = subtotal * (safeTaxPercent / 100)
  const total = Math.max(subtotal + taxAmount - safeDiscountAmount, 0)

  return {
    normalizedItems,
    subtotal,
    taxPercent: safeTaxPercent,
    taxAmount,
    discountAmount: safeDiscountAmount,
    total,
  }
}

function nextBusinessNumber(prefix: string) {
  const date = new Date()
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`
  const random = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `${prefix}-${stamp}-${random}`
}

export async function listToolkitLeads(userId: string) {
  return prisma.toolkitLead.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
  })
}

export async function createToolkitLead(userId: string, input: ToolkitLeadInput) {
  return prisma.toolkitLead.create({
    data: {
      userId,
      name: input.name,
      companyName: input.companyName || undefined,
      email: input.email || undefined,
      phone: input.phone || undefined,
      source: input.source,
      status: input.status,
      estimatedValue: input.estimatedValue ?? undefined,
      notes: input.notes || undefined,
      tags: input.tags ?? [],
    },
  })
}

export async function listToolkitQuotes(userId: string) {
  return prisma.toolkitQuote.findMany({
    where: { userId },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
  })
}

export async function createToolkitQuote(userId: string, input: ToolkitQuoteInput) {
  const totals = buildDocumentTotals(input.lineItems, input.taxPercent, input.discountAmount)

  return prisma.toolkitQuote.create({
    data: {
      userId,
      leadId: input.leadId || undefined,
      quoteNumber: nextBusinessNumber("Q"),
      status: "DRAFT",
      title: input.title,
      clientName: input.clientName,
      clientCompany: input.clientCompany || undefined,
      clientEmail: input.clientEmail || undefined,
      clientPhone: input.clientPhone || undefined,
      issueDate: new Date(input.issueDate),
      validUntil: input.validUntil ? new Date(input.validUntil) : undefined,
      notes: input.notes || undefined,
      lineItemsJson: totals.normalizedItems as Prisma.InputJsonValue,
      subtotal: totals.subtotal,
      taxPercent: totals.taxPercent,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
    },
  })
}

export async function listToolkitInvoices(userId: string) {
  return prisma.toolkitInvoice.findMany({
    where: { userId },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
        },
      },
      quote: {
        select: {
          id: true,
          quoteNumber: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
  })
}

export async function createToolkitInvoice(userId: string, input: ToolkitInvoiceInput) {
  const totals = buildDocumentTotals(input.lineItems, input.taxPercent, input.discountAmount)

  return prisma.toolkitInvoice.create({
    data: {
      userId,
      leadId: input.leadId || undefined,
      quoteId: input.quoteId || undefined,
      invoiceNumber: nextBusinessNumber("INV"),
      status: "DRAFT",
      title: input.title,
      clientName: input.clientName,
      clientCompany: input.clientCompany || undefined,
      clientEmail: input.clientEmail || undefined,
      clientPhone: input.clientPhone || undefined,
      issueDate: new Date(input.issueDate),
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      notes: input.notes || undefined,
      lineItemsJson: totals.normalizedItems as Prisma.InputJsonValue,
      subtotal: totals.subtotal,
      taxPercent: totals.taxPercent,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
      emailSubject: input.emailSubject || undefined,
      emailMessage: input.emailMessage || undefined,
    },
  })
}

export async function markToolkitInvoiceSent(invoiceId: string) {
  return prisma.toolkitInvoice.update({
    where: { id: invoiceId },
    data: {
      status: "SENT",
      lastEmailSentAt: new Date(),
    },
  })
}

function computeProjectProgress(tasks: Array<{ status: string }>) {
  if (tasks.length === 0) {
    return 0
  }

  const completed = tasks.filter((task) => task.status === "DONE").length
  return Math.round((completed / tasks.length) * 100)
}

export async function listToolkitProjects(userId: string) {
  const projects = await prisma.toolkitProject.findMany({
    where: { userId },
    include: {
      tasks: {
        orderBy: [{ createdAt: "desc" }],
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
  })

  return projects.map((project) => ({
    ...project,
    progress: computeProjectProgress(project.tasks),
  }))
}

export async function createToolkitProject(userId: string, input: ToolkitProjectInput) {
  return prisma.toolkitProject.create({
    data: {
      userId,
      name: input.name,
      description: input.description || undefined,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    },
  })
}

export async function createToolkitTask(userId: string, input: ToolkitTaskInput) {
  const task = await prisma.toolkitTask.create({
    data: {
      userId,
      projectId: input.projectId,
      title: input.title,
      description: input.description || undefined,
      status: input.status,
      priority: input.priority,
      assigneeName: input.assigneeName || undefined,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      completedAt: input.status === "DONE" ? new Date() : undefined,
    },
  })

  const projectTasks = await prisma.toolkitTask.findMany({
    where: { projectId: input.projectId, userId },
    select: { status: true },
  })

  await prisma.toolkitProject.update({
    where: { id: input.projectId },
    data: {
      progress: computeProjectProgress(projectTasks),
    },
  })

  return task
}

export async function updateToolkitTaskStatus(userId: string, taskId: string, status: string) {
  const task = await prisma.toolkitTask.findFirst({
    where: { id: taskId, userId },
    select: {
      id: true,
      projectId: true,
    },
  })

  if (!task) {
    throw new Error("task-not-found")
  }

  const updatedTask = await prisma.toolkitTask.update({
    where: { id: taskId },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
  })

  const projectTasks = await prisma.toolkitTask.findMany({
    where: { projectId: task.projectId, userId },
    select: { status: true },
  })

  await prisma.toolkitProject.update({
    where: { id: task.projectId },
    data: {
      progress: computeProjectProgress(projectTasks),
    },
  })

  return updatedTask
}

export async function listToolkitDirectoryEntries(userId: string, isAdmin: boolean) {
  return prisma.toolkitDirectoryEntry.findMany({
    where: isAdmin
      ? undefined
      : {
          OR: [{ status: "APPROVED", isPublic: true }, { userId }],
        },
    orderBy: [{ updatedAt: "desc" }],
    take: 24,
  })
}

export async function createToolkitDirectoryEntry(
  userId: string,
  input: ToolkitDirectoryEntryInput
) {
  return prisma.toolkitDirectoryEntry.create({
    data: {
      userId,
      businessName: input.businessName,
      ownerName: input.ownerName,
      category: input.category,
      city: input.city,
      state: input.state,
      phone: input.phone || undefined,
      whatsapp: input.whatsapp || undefined,
      email: input.email || undefined,
      instagram: input.instagram || undefined,
      website: input.website || undefined,
      shortDescription: input.shortDescription,
      servicesSummary: input.servicesSummary || undefined,
      badgeLabel: input.badgeLabel || undefined,
      isPublic: input.isPublic ?? true,
      status: "PENDING",
    },
  })
}

export async function moderateToolkitDirectoryEntry(
  entryId: string,
  status: "APPROVED" | "REJECTED",
  adminNotes?: string
) {
  return prisma.toolkitDirectoryEntry.update({
    where: { id: entryId },
    data: {
      status,
      adminNotes: adminNotes || undefined,
    },
  })
}

export { buildDocumentTotals }
