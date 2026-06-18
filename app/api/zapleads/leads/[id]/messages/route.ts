import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { body, direction = "out" } = await req.json()

    if (!body) {
      return NextResponse.json({ error: "Conteúdo da interação é obrigatório" }, { status: 400 })
    }

    const message = await prisma.zapMessage.create({
      data: {
        leadId: params.id,
        userId: result.user.id,
        direction,
        channel: "manual",
        body,
        status: "logged"
      }
    })

    // Atualiza também a data da última interação no Lead
    await prisma.zapLead.update({
      where: { id: params.id },
      data: { lastInteractionAt: new Date() }
    })

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
