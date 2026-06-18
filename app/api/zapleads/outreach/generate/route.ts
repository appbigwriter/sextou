import { NextResponse } from "next/server"
import OpenAI from "openai"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY não configurada no servidor." }, { status: 500 })
  }

  const openai = new OpenAI({ apiKey })

  try {
    const { leadName, groupPurpose, notes } = await req.json()

    if (!leadName) {
      return NextResponse.json({ error: "Nome do lead ausente" }, { status: 400 })
    }

    const prompt = `Você é um SDR e Closer de vendas profissional. Sua tarefa é escrever a primeira mensagem de abordagem (Quebra-gelo) para o WhatsApp de um potencial cliente.
A mensagem deve soar muito natural, amigável, direta, NÃO deve parecer um robô.
Use no máximo 2-3 parágrafos muito curtos. Nada de textões.

DADOS DO LEAD:
- Nome: ${leadName}
- Motivo da abordagem (Propósito do Grupo de Origem): ${groupPurpose || 'Networking/Vendas B2B'}
- Anotações Extras: ${notes || 'Nenhuma'}

Tons esperados: Curto, Curioso, Amigável.
Escreva a mensagem pronta para envio, sem aspas, sem colocar placeholders como [Seu Nome]. Se precisar, assine apenas como "Sextou".`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Mais rápido para o caso B2B básico
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 250,
    })

    const message = response.choices[0].message?.content || ""

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error("OpenAI error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
