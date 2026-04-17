import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getStripe, constructWebhookEvent, verifyStripeConfigured } from "@/lib/stripe"
import { sendEmail } from "@/lib/email"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    if (!verifyStripeConfigured()) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event
    try {
      event = constructWebhookEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const stripe = getStripe()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        
        const adId = session.metadata?.adId
        const userId = session.metadata?.userId

        if (!adId) {
          console.error("No adId in session metadata")
          break
        }

        const payment = await prisma.payment.create({
          data: {
            adId,
            userId: userId || "",
            amount: (session.amount_total || 3000) / 100,
            paymentMethod: "STRIPE",
            transactionId: session.payment_intent as string,
            status: "PAID",
          } as any,
        })

        await prisma.ad.update({
          where: { id: adId },
          data: {
            status: "UNDER_REVIEW",
            paymentStatus: "PAID",
            paymentAmount: (session.amount_total || 3000) / 100,
            paymentDate: new Date(),
          } as any,
        })

        if (userId) {
          const user = await prisma.user.findUnique({ where: { id: userId } })
          if (user?.email) {
            await sendEmail({
              to: user.email,
              subject: "Pagamento confirmado!",
              html: `
                <h1>Pagamento Confirmado</h1>
                <p>Seu pagamento foi processado com sucesso!</p>
                <p>O anúncio está em análise e será publicado em breve.</p>
                <p>Obrigado por usar a SEXTOU.biz!</p>
              `,
            })
          }
        }

        console.log(`Payment completed for ad ${adId}, payment ID: ${payment.id}`)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        console.log(`Payment failed: ${paymentIntent.id}`)
        break
      }

      case "charge.refunded": {
        const charge = event.data.object
        const paymentIntentId = charge.payment_intent as string

        await prisma.payment.updateMany({
          where: { transactionId: paymentIntentId },
          data: {
            status: "REFUNDED",
          },
        })

        console.log(`Charge refunded: ${charge.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
