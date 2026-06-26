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
    // Apaga todos os Leads do Kanban deste usuário (o histórico também some via Cascade no banco)
    const deleted = await prisma.zapLead.deleteMany({
      where: {
        userId: result.user.id,
      }
    })

    return NextResponse.json({ message: "Leads removidos com sucesso", count: deleted.count })
  } catch (error: any) {
    console.error("Leads delete error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
