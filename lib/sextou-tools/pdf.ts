interface PdfDocumentItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface PdfDocumentData {
  title: string
  documentNumber: string
  businessName: string
  businessEmail: string
  clientName: string
  clientCompany?: string | null
  clientEmail?: string | null
  issueDate: string
  dueDate?: string | null
  validUntil?: string | null
  notes?: string | null
  items: PdfDocumentItem[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
}

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function buildPdfLines(data: PdfDocumentData) {
  const lines = [
    data.title,
    `Numero: ${data.documentNumber}`,
    `Empresa: ${data.businessName}`,
    `Email: ${data.businessEmail}`,
    `Cliente: ${data.clientName}`,
  ]

  if (data.clientCompany) lines.push(`Empresa do cliente: ${data.clientCompany}`)
  if (data.clientEmail) lines.push(`Email do cliente: ${data.clientEmail}`)
  lines.push(`Data de emissao: ${data.issueDate}`)
  if (data.dueDate) lines.push(`Vencimento: ${data.dueDate}`)
  if (data.validUntil) lines.push(`Valido ate: ${data.validUntil}`)
  lines.push("")
  lines.push("Itens")

  data.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.description} | Qty ${item.quantity} | ${formatUsd(item.unitPrice)} | ${formatUsd(item.total)}`
    )
  })

  lines.push("")
  lines.push(`Subtotal: ${formatUsd(data.subtotal)}`)
  lines.push(`Impostos: ${formatUsd(data.taxAmount)}`)
  lines.push(`Desconto: ${formatUsd(data.discountAmount)}`)
  lines.push(`Total: ${formatUsd(data.total)}`)

  if (data.notes) {
    lines.push("")
    lines.push("Observacoes")
    lines.push(data.notes)
  }

  return lines
}

export function createToolkitPdfBuffer(data: PdfDocumentData) {
  const lines = buildPdfLines(data)
  const textCommands = lines
    .map((line, index) => {
      const y = 760 - index * 18
      return `BT /F1 11 Tf 48 ${y} Td (${escapePdfText(line)}) Tj ET`
    })
    .join("\n")

  const stream = `q\n${textCommands}\nQ`

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${Buffer.byteLength(stream, "utf8")} >> stream\n${stream}\nendstream endobj`,
  ]

  let pdf = "%PDF-1.4\n"
  const offsets = [0]

  objects.forEach((object) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"))
    pdf += `${object}\n`
  })

  const xrefStart = Buffer.byteLength(pdf, "utf8")
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += "0000000000 65535 f \n"
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return Buffer.from(pdf, "utf8")
}
