import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const leads = await prisma.zapLead.findMany({
      where: {
        userId: result.user.id,
      },
      include: {
        contact: {
          include: { sourceGroup: true },
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ leads })
  } catch (error: any) {
    console.error("Leads fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Apaga os filhos explicitamente antes dos leads — não depende de ON DELETE CASCADE
    // estar configurado nas FKs do banco (evita erro de constraint ao limpar o CRM).
    const userId = result.user.id
    const [, , , deleted] = await prisma.$transaction([
      prisma.zapMessage.deleteMany({ where: { userId } }),
      prisma.leadEvent.deleteMany({ where: { userId } }),
      prisma.leadStatusHistory.deleteMany({ where: { lead: { userId } } }),
      prisma.zapLead.deleteMany({ where: { userId } }),
    ])

    return NextResponse.json({ message: "Leads removidos com sucesso", count: deleted.count })
  } catch (error: any) {
    console.error("Leads delete error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
