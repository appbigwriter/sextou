import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  const result = await resolveSextouToolsProUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { leadId, fromStatus, toStatus } = await req.json()

  if (!leadId || !toStatus) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  }

  try {
    const existingLead = await prisma.zapLead.findFirst({
      where: {
        id: leadId,
        userId: result.user.id,
      },
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const updatedLead = await prisma.zapLead.update({
      where: { id: existingLead.id },
      data: { status: toStatus }
    })

    await prisma.leadStatusHistory.create({
      data: {
        leadId: leadId,
        fromStatus: fromStatus || "desconhecido",
        toStatus: toStatus,
        reason: "Movido via Kanban CRM"
      }
    })

    return NextResponse.json({ success: true, lead: updatedLead })
  } catch (error: any) {
    console.error("Lead status update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
