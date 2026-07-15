import { NextResponse } from "next/server"
import { requireSextouToolsProApiUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const onboardingSchema = z.object({
  businessType: z.string().max(120).optional().nullable(),
  whatYouSell: z.string().max(300).optional().nullable(),
  idealCustomer: z.string().max(300).optional().nullable(),
  mainSalesChannel: z.string().max(80).optional().nullable(),
  preferredLanguage: z.string().max(10).optional(),
})

export async function PATCH(request: Request) {
  const user = await requireSextouToolsProApiUser()

  if (user === false) {
    return NextResponse.json({ error: "SextouTools PRO access requires active ads" }, { status: 403 })
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = onboardingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(data.businessType !== undefined && { businessType: data.businessType }),
      ...(data.whatYouSell !== undefined && { whatYouSell: data.whatYouSell }),
      ...(data.idealCustomer !== undefined && { idealCustomer: data.idealCustomer }),
      ...(data.mainSalesChannel !== undefined && { mainSalesChannel: data.mainSalesChannel }),
      ...(data.preferredLanguage !== undefined && { preferredLanguage: data.preferredLanguage }),
    },
  })

  return NextResponse.json({ ok: true })
}
