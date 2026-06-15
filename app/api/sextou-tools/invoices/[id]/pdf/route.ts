import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { createToolkitPdfBuffer } from "@/lib/sextou-tools/pdf"

export async function GET(
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

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  })
}
