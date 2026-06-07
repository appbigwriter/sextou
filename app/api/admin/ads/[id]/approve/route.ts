import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export const runtime = 'nodejs'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const body = await _request.json().catch(() => ({}))
    const { receiptNumber } = body

    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!ad) {
      return NextResponse.json({ error: "Anuncio nao encontrado" }, { status: 404 })
    }

    const adUpdateData: any = {
      status: "PUBLISHED",
      publishedAt: new Date(),
    }

    if (receiptNumber) {
      adUpdateData.paymentStatus = "PAID"
      adUpdateData.paymentDate = new Date()
    }

    const updatedAd = await prisma.ad.update({
      where: { id: params.id },
      data: adUpdateData,
    })

    if (receiptNumber) {
      // Find an existing pending payment
      const existingPayment = await prisma.payment.findFirst({
        where: { adId: params.id, status: "PENDING" },
      })

      if (existingPayment) {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: "CONFIRMED",
            transactionId: receiptNumber,
            confirmedBy: adminCheck.session.user.email,
            confirmedAt: new Date(),
            transactionDate: new Date(),
          },
        })
        
        // Handle commission if it hasn't been paid yet (in this simple flow we assume it hasn't)
        if (ad.user?.affiliateId) {
          const commissionAmount = existingPayment.amount * 0.5
          await prisma.user.update({
            where: { id: ad.user.affiliateId },
            data: { balance: { increment: commissionAmount } },
          })
        }
      } else {
        // Create new payment record
        const amount = ad.paymentAmount || 0
        await prisma.payment.create({
          data: {
            adId: params.id,
            userId: ad.userId,
            amount: amount,
            paymentMethod: "ZELLE",
            transactionId: receiptNumber,
            status: "CONFIRMED",
            confirmedBy: adminCheck.session.user.email,
            confirmedAt: new Date(),
            transactionDate: new Date(),
          },
        })
        
        if (ad.user?.affiliateId) {
          const commissionAmount = amount * 0.5
          await prisma.user.update({
            where: { id: ad.user.affiliateId },
            data: { balance: { increment: commissionAmount } },
          })
        }
      }
    }

    return NextResponse.json(updatedAd)
  } catch (error) {
    console.error("Approve ad error:", error)
    return NextResponse.json({ error: "Erro ao aprovar anuncio" }, { status: 500 })
  }
}
