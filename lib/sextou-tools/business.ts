import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  ToolkitInvoiceInput,
  ToolkitLeadInput,
  ToolkitLineItemInput,
  ToolkitQuoteInput,
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

export { buildDocumentTotals }
