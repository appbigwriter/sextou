import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

const updateCouponSchema = z.object({
  code: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE"]).optional(),
  discountValue: z.number().optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  maxUses: z.number().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const body = await request.json()
    const data = updateCouponSchema.parse(body)

    const updateData: Record<string, unknown> = { ...data }

    if (data.code) {
      updateData.code = data.code.toUpperCase()
    }
    if (data.validFrom) {
      updateData.validFrom = new Date(data.validFrom)
    }
    if (data.validUntil) {
      updateData.validUntil = new Date(data.validUntil)
    }

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(coupon)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Update coupon error:", error)
    return NextResponse.json({ error: "Erro ao atualizar cupom" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    await prisma.coupon.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete coupon error:", error)
    return NextResponse.json({ error: "Erro ao excluir cupom" }, { status: 500 })
  }
}
