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

  const quote = await prisma.toolkitQuote.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
  })

  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 })
  }

  const items = Array.isArray(quote.lineItemsJson) ? quote.lineItemsJson : []
  const pdf = createToolkitPdfBuffer({
    title: quote.title,
    documentNumber: quote.quoteNumber,
    businessName: user.businessName,
    businessEmail: user.email,
    clientName: quote.clientName,
    clientCompany: quote.clientCompany,
    clientEmail: quote.clientEmail,
    issueDate: quote.issueDate.toLocaleDateString("pt-BR"),
    validUntil: quote.validUntil?.toLocaleDateString("pt-BR"),
    notes: quote.notes,
    items: items as Array<{ description: string; quantity: number; unitPrice: number; total: number }>,
    subtotal: quote.subtotal,
    taxAmount: quote.taxAmount,
    discountAmount: quote.discountAmount,
    total: quote.total,
  })

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quote.quoteNumber}.pdf"`,
    },
  })
}
