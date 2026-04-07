import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@sextadoempreendedor.com",
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Email error:", error)
    return { success: false, error }
  }
}

export function getAnuncioAprovadoTemplate(userName: string, adTitle: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F97316, #EA580C); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Parabéns, ${userName}!</h1>
        </div>
        <div class="content">
          <h2>Seu anúncio foi aprovado!</h2>
          <p>Seu anúncio "<strong>${adTitle}</strong>" foi publicado na Sexta do Empreendedor.</p>
          <p>Agora milhares de brasileiros podem ver seu negócio!</p>
          <a href="${process.env.NEXTAUTH_URL}/anuncios" class="button">Ver minha publicação</a>
        </div>
        <div class="footer">
          <p>Sexta do Empreendedor - A vitrine da comunidade brasileira</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getAnuncioRejeitadoTemplate(userName: string, adTitle: string, reason: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reason { background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>😔 Informe sobre seu anúncio</h1>
        </div>
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          <p>Seu anúncio "<strong>${adTitle}</strong>" não foi aprovado nesta edição.</p>
          <div class="reason">
            <strong>Motivo:</strong> ${reason}
          </div>
          <p>Você pode corrigir e enviar novamente. Emitimos o reembolso de $30.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button" style="background: #4B5563;">Acessar painel</a>
        </div>
        <div class="footer">
          <p>Sexta do Empreendedor - A vitrine da comunidade brasileira</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getPagamentoConfirmadoTemplate(userName: string, adTitle: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pagamento Confirmado!</h1>
        </div>
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          <p>Recebemos o pagamento de <strong>$30</strong> para o anúncio "<strong>${adTitle}</strong>".</p>
          <p>Seu anúncio está em análise e será publicado na próxima sexta-feira!</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Ver detalhes</a>
        </div>
        <div class="footer">
          <p>Sexta do Empreendedor - A vitrine da comunidade brasileira</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendAnuncioAprovadoEmail(userEmail: string, userName: string, adTitle: string) {
  return sendEmail({
    to: userEmail,
    subject: "🎉 Seu anúncio foi aprovado! - Sexta do Empreendedor",
    html: getAnuncioAprovadoTemplate(userName, adTitle),
  })
}

export async function sendAnuncioRejeitadoEmail(userEmail: string, userName: string, adTitle: string, reason: string) {
  return sendEmail({
    to: userEmail,
    subject: "😔 Seu anúncio precisa de ajustes - Sexta do Empreendedor",
    html: getAnuncioRejeitadoTemplate(userName, adTitle, reason),
  })
}

export async function sendPagamentoConfirmadoEmail(userEmail: string, userName: string, adTitle: string) {
  return sendEmail({
    to: userEmail,
    subject: "✅ Pagamento confirmado! - Sexta do Empreendedor",
    html: getPagamentoConfirmadoTemplate(userName, adTitle),
  })
}