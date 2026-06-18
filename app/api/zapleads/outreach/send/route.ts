import { NextResponse } from "next/server"
import { whatsappEngine } from "@/lib/whatsapp"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { leadId, message, phoneE164 } = await req.json()

    if (!leadId || !message || !phoneE164) {
      return NextResponse.json({ error: "Parâmetros insuficientes" }, { status: 400 })
    }

    if (whatsappEngine.status !== "CONNECTED") {
      return NextResponse.json({ error: "WhatsApp não está conectado para envio" }, { status: 400 })
    }

    const client = whatsappEngine.getClient()
    if (!client) {
      return NextResponse.json({ error: "Cliente WhatsApp não encontrado" }, { status: 500 })
    }

    // Limpa o número e garante DDI
    const cleanPhone = phoneE164.replace(/\D/g, "")
    const chatId = `${cleanPhone}@c.us`

    // Tenta enviar
    await client.sendMessage(chatId, message)

    // Loga a mensagem enviada
    const zapMessage = await prisma.zapMessage.create({
      data: {
        leadId,
        userId: result.user.id,
        direction: "out",
        channel: "whatsapp",
        body: message,
        aiGenerated: true,
        status: "sent"
      }
    })

    // Atualiza o Status do Lead para "Contatado" se for o primeiro envio
    const lead = await prisma.zapLead.findUnique({ where: { id: leadId } })
    if (lead && lead.status === "frio") {
      await prisma.zapLead.update({
        where: { id: leadId },
        data: { status: "contatado", lastInteractionAt: new Date() }
      })

      await prisma.leadStatusHistory.create({
        data: {
          leadId: leadId,
          fromStatus: "frio",
          toStatus: "contatado",
          reason: "Enviado quebra-gelo com IA"
        }
      })
    } else {
      await prisma.zapLead.update({
        where: { id: leadId },
        data: { lastInteractionAt: new Date() }
      })
    }

    return NextResponse.json({ success: true, zapMessage })
  } catch (error: any) {
    console.error("WhatsApp Send error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
