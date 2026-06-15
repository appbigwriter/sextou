import { sendEmail } from "@/lib/email"

interface ToolkitInvoiceEmailInput {
  to: string
  clientName: string
  businessName: string
  invoiceNumber: string
  title: string
  total: string
  dueDate?: string | null
  message?: string | null
  pdfBase64?: string
}

function getToolkitInvoiceEmailTemplate({
  clientName,
  businessName,
  invoiceNumber,
  title,
  total,
  dueDate,
  message,
}: ToolkitInvoiceEmailInput) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #222; background: #f5f5f5; }
        .container { max-width: 620px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
        .hero { background: linear-gradient(135deg, #FF3D57 0%, #FF8C00 100%); color: white; padding: 28px; }
        .content { padding: 28px; }
        .pill { display: inline-block; padding: 8px 12px; border-radius: 999px; background: rgba(255,255,255,0.18); font-size: 12px; font-weight: bold; letter-spacing: 0.08em; text-transform: uppercase; }
        .meta { background: #f9fafb; border-radius: 16px; padding: 18px; margin: 18px 0; }
        .footer { color: #666; font-size: 12px; margin-top: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="hero">
            <span class="pill">Invoice</span>
            <h1 style="margin: 14px 0 6px;">${title}</h1>
            <p style="margin: 0;">${businessName}</p>
          </div>
          <div class="content">
            <p>Ola, ${clientName}.</p>
            <p>${message || "Segue sua invoice em anexo para pagamento e acompanhamento."}</p>
            <div class="meta">
              <p style="margin: 0 0 8px;"><strong>Numero:</strong> ${invoiceNumber}</p>
              <p style="margin: 0 0 8px;"><strong>Total:</strong> ${total}</p>
              ${dueDate ? `<p style="margin: 0;"><strong>Vencimento:</strong> ${dueDate}</p>` : ""}
            </div>
            <p>O PDF desta invoice segue em anexo neste e-mail.</p>
            <p class="footer">Enviado via Sextou Tools · Brazilian Business Toolkit</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendToolkitInvoiceEmail(input: ToolkitInvoiceEmailInput) {
  return sendEmail({
    to: input.to,
    subject: `${input.invoiceNumber} - ${input.title}`,
    html: getToolkitInvoiceEmailTemplate(input),
  })
}
