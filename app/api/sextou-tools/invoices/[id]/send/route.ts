import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendToolkitInvoiceEmail } from "@/lib/sextou-tools/email"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { createToolkitPdfBuffer } from "@/lib/sextou-tools/pdf"
import { markToolkitInvoiceSent } from "@/lib/sextou-tools/business"

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const invoice = await prisma.toolkitInvoice.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  if (!invoice.clientEmail) {
    return NextResponse.json({ error: "Client email is required" }, { status: 400 })
  }

  const items = Array.isArray(invoice.lineItemsJson) ? invoice.lineItemsJson : []
  const pdf = createToolkitPdfBuffer({
    title: invoice.title,
    documentNumber: invoice.invoiceNumber,
    businessName: user.businessName,
    businessEmail: user.email,
    clientName: invoice.clientName,
    clientCompany: invoice.clientCompany,
    clientEmail: invoice.clientEmail,
    issueDate: invoice.issueDate.toLocaleDateString("pt-BR"),
    dueDate: invoice.dueDate?.toLocaleDateString("pt-BR"),
    notes: invoice.notes,
    items: items as Array<{ description: string; quantity: number; unitPrice: number; total: number }>,
    subtotal: invoice.subtotal,
    taxAmount: invoice.taxAmount,
    discountAmount: invoice.discountAmount,
    total: invoice.total,
  })

  const result = await sendToolkitInvoiceEmail({
    to: invoice.clientEmail,
    clientName: invoice.clientName,
    businessName: user.businessName,
    invoiceNumber: invoice.invoiceNumber,
    title: invoice.emailSubject || invoice.title,
    total: formatUsd(invoice.total),
    dueDate: invoice.dueDate?.toLocaleDateString("pt-BR"),
    message: invoice.emailMessage,
    pdfBase64: pdf.toString("base64"),
  })

  if (!result.success) {
    return NextResponse.json({ error: "Email send failed" }, { status: 500 })
  }

  await markToolkitInvoiceSent(invoice.id)

  return NextResponse.json({ success: true })
}
