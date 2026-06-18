import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const OPT_OUT_KEYWORDS = ["sair", "pare", "parar", "não quero", "nao quero", "descadastrar", "stop"]

export async function handleInboundMessage(fromNumber: string, messageBody: string) {
  try {
    // 1. Limpar número que vem como 551199999999@c.us
    const cleanPhone = fromNumber.split("@")[0]
    const phoneE164 = "+" + cleanPhone

    // 2. Localizar o Contato
    const contact = await prisma.contact.findFirst({
      where: { phoneE164 }
    })

    if (!contact) return // Não é um contato extraído conhecido

    // 3. Localizar o ZapLead (apenas frio ou contatado)
    const zapLead = await prisma.zapLead.findFirst({
      where: {
        contactId: contact.id,
        status: {
          in: ["frio", "contatado"]
        }
      }
    })

    if (!zapLead) return // Já está quente, em negociação, fechado ou perdido. Ignoramos.

    // 4. Registrar a mensagem Inbound
    await prisma.zapMessage.create({
      data: {
        leadId: zapLead.id,
        userId: zapLead.userId,
        direction: "in",
        channel: "whatsapp",
        body: messageBody,
        status: "received"
      }
    })

    // Atualiza timestamp de iteração
    await prisma.zapLead.update({
      where: { id: zapLead.id },
      data: { lastInteractionAt: new Date() }
    })

    // 5. Opt-out determinístico (Não gasta IA)
    const lowerBody = messageBody.toLowerCase()
    const isOptOut = OPT_OUT_KEYWORDS.some(kw => lowerBody.includes(kw))

    if (isOptOut) {
      await moveLeadStatus(zapLead, "perdido", "Opt-out recebido pelo usuário")
      return
    }

    // 6. Classificação com IA
    const intent = await classifyIntentWithAI(messageBody)

    if (intent === "OPT_OUT") {
      await moveLeadStatus(zapLead, "perdido", "IA detectou rejeição/opt-out")
    } else if (intent === "INTERESSE" || intent === "DUVIDA") {
      await moveLeadStatus(zapLead, "quente", `IA detectou ${intent.toLowerCase()}`)
    }

  } catch (err) {
    console.error("Erro no Auto Heat Service:", err)
  }
}

async function classifyIntentWithAI(message: string): Promise<"INTERESSE" | "DUVIDA" | "OPT_OUT" | "NEUTRO"> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `Você é um classificador de intenções para vendas no WhatsApp.
Classifique a seguinte mensagem do cliente em EXATAMENTE UMA das categorias:
- INTERESSE: O cliente demonstra interesse claro no que foi ofertado, pede preço, ou quer avançar.
- DUVIDA: O cliente pergunta como funciona, ou pede mais informações.
- OPT_OUT: O cliente não quer receber mensagens, pede para parar, recusa, diz que não tem interesse ou é grosso.
- NEUTRO: Respostas muito curtas que não dizem nada (ex: "ok", "tá", "bom dia") ou emojis neutros.

RESPONDA APENAS A PALAVRA DA CATEGORIA EM MAIÚSCULO.`
        },
        {
          role: "user",
          content: message
        }
      ]
    })

    const classification = response.choices[0].message?.content?.trim().toUpperCase()

    if (classification === "INTERESSE") return "INTERESSE"
    if (classification === "DUVIDA") return "DUVIDA"
    if (classification === "OPT_OUT") return "OPT_OUT"
    return "NEUTRO"

  } catch (err) {
    console.error("Erro ao classificar intenção com IA:", err)
    return "NEUTRO"
  }
}

async function moveLeadStatus(lead: any, toStatus: string, reason: string) {
  // Move o Lead
  await prisma.zapLead.update({
    where: { id: lead.id },
    data: { status: toStatus }
  })

  // Salva no Histórico
  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead.id,
      fromStatus: lead.status,
      toStatus: toStatus,
      reason: reason
    }
  })
}
