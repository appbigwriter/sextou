import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const lead = await prisma.zapLead.findUnique({
      where: { id: params.id, userId: result.user.id },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: "desc" }
        },
        statusHistory: {
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ lead })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { contact, estimatedValue, nextFollowupAt, heatScore } = body

    const lead = await prisma.zapLead.update({
      where: { id: params.id, userId: result.user.id },
      data: {
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        nextFollowupAt: nextFollowupAt ? new Date(nextFollowupAt) : null,
        heatScore: heatScore !== undefined ? parseInt(heatScore) : undefined,
      }
    })

    if (contact) {
      await prisma.contact.update({
        where: { id: lead.contactId },
        data: {
          displayName: contact.displayName,
          email: contact.email,
          company: contact.company,
          notes: contact.notes,
          phoneE164: contact.phoneE164
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
