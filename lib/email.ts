import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
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
          <h1>Parabens, ${userName}!</h1>
        </div>
        <div class="content">
          <h2>Seu anuncio foi aprovado!</h2>
          <p>Seu anuncio "<strong>${adTitle}</strong>" foi publicado na SEXTOU.biz.</p>
          <p>Agora milhares de brasileiros podem ver seu negocio.</p>
          <a href="${process.env.NEXTAUTH_URL}/anuncios" class="button">Ver minha publicacao</a>
        </div>
        <div class="footer">
          <p>SEXTOU.biz - A vitrine da comunidade brasileira</p>
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
        .button { display: inline-block; background: #4B5563; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Informe sobre seu anuncio</h1>
        </div>
        <div class="content">
          <h2>Ola, ${userName}!</h2>
          <p>Seu anuncio "<strong>${adTitle}</strong>" nao foi aprovado nesta edicao.</p>
          <div class="reason">
            <strong>Motivo:</strong> ${reason}
          </div>
          <p>Voce pode corrigir e enviar novamente. Emitimos o reembolso de $30.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Acessar painel</a>
        </div>
        <div class="footer">
          <p>SEXTOU.biz - A vitrine da comunidade brasileira</p>
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
          <h1>Pagamento Confirmado!</h1>
        </div>
        <div class="content">
          <h2>Ola, ${userName}!</h2>
          <p>Recebemos o pagamento de <strong>$30</strong> para o anuncio "<strong>${adTitle}</strong>".</p>
          <p>Seu anuncio esta em analise e sera publicado na proxima sexta-feira.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Ver detalhes</a>
        </div>
        <div class="footer">
          <p>SEXTOU.biz - A vitrine da comunidade brasileira</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getPasswordResetTemplate(userName: string, resetUrl: string) {
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
          <h1>Recuperacao de senha</h1>
        </div>
        <div class="content">
          <h2>Ola, ${userName}!</h2>
          <p>Recebemos um pedido para redefinir a senha da sua conta na SEXTOU.biz.</p>
          <p>Se foi voce, clique no botao abaixo para criar uma nova senha:</p>
          <a href="${resetUrl}" class="button">Redefinir senha</a>
          <p>Este link expira em 1 hora.</p>
          <p>Se voce nao solicitou esta alteracao, ignore este email.</p>
        </div>
        <div class="footer">
          <p>SEXTOU.biz - A vitrine da comunidade brasileira</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendAnuncioAprovadoEmail(userEmail: string, userName: string, adTitle: string) {
  return sendEmail({
    to: userEmail,
    subject: "Seu anuncio foi aprovado! - SEXTOU.biz",
    html: getAnuncioAprovadoTemplate(userName, adTitle),
  })
}

export async function sendAnuncioRejeitadoEmail(
  userEmail: string,
  userName: string,
  adTitle: string,
  reason: string
) {
  return sendEmail({
    to: userEmail,
    subject: "Seu anuncio precisa de ajustes - SEXTOU.biz",
    html: getAnuncioRejeitadoTemplate(userName, adTitle, reason),
  })
}

export async function sendPagamentoConfirmadoEmail(userEmail: string, userName: string, adTitle: string) {
  return sendEmail({
    to: userEmail,
    subject: "Pagamento confirmado! - SEXTOU.biz",
    html: getPagamentoConfirmadoTemplate(userName, adTitle),
  })
}

export async function sendPasswordResetEmail(userEmail: string, userName: string, resetUrl: string) {
  return sendEmail({
    to: userEmail,
    subject: "Recuperacao de senha - SEXTOU.biz",
    html: getPasswordResetTemplate(userName, resetUrl),
  })
}
