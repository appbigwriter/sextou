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
        const planSlug = session.metadata?.planSlug
        const userId = session.metadata?.userId

        // --- Fluxo de assinatura premium (story 1.7) ---
        // Distingue do pagamento de anuncio (metadata.adId) pela presenca
        // de metadata.planSlug. Os dois fluxos compartilham este evento.
        if (planSlug) {
          if (!userId) {
            console.error("Premium subscription event without userId in metadata")
            break
          }

          // premium_expires_at: assinatura recorrente nao tem expiracao fixa;
          // se a Stripe expuser a data da proxima cobranca, usamos ela.
          // No Stripe SDK 22, current_period_end vive no subscription item.
          let premiumExpiresAt: Date | null = null
          if (session.subscription) {
            try {
              const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
              )
              const periodEnd = subscription.items.data[0]?.current_period_end
              if (periodEnd) {
                premiumExpiresAt = new Date(periodEnd * 1000)
              }
            } catch (subErr) {
              console.error("Could not retrieve subscription period end:", subErr)
            }
          }

          // Idempotencia (AC7): se o usuario ja esta premium no mesmo plano,
          // nao reprocessa. Reprocessar o mesmo evento nao duplica nem lanca erro.
          const existing = await prisma.user.findUnique({
            where: { id: userId },
            select: { isPremium: true, premiumPlanSlug: true },
          })

          if (existing?.isPremium && existing.premiumPlanSlug === planSlug) {
            console.log(`Premium already active for user ${userId} (plan ${planSlug}) — skipping (idempotent)`)
            break
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              isPremium: true,
              premiumPlanSlug: planSlug,
              premiumSince: new Date(),
              premiumExpiresAt,
            },
          })

          console.log(`Premium activated for user ${userId} (plan ${planSlug})`)
          break
        }

        // --- Fluxo de pagamento de anuncio (existente — nao modificar) ---
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

          if (user?.affiliateId) {
            const commissionAmount = ((session.amount_total || 3000) / 100) * 0.5
            await prisma.user.update({
              where: { id: user.affiliateId },
              data: { balance: { increment: commissionAmount } },
            })
          }

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

      // --- Cancelamento/expiracao de assinatura premium (story 1.7, AC6) ---
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error("customer.subscription.deleted event without userId in metadata")
          break
        }

        // Idempotencia (AC7): se ja nao esta premium, nada a fazer.
        const existing = await prisma.user.findUnique({
          where: { id: userId },
          select: { isPremium: true },
        })

        if (!existing?.isPremium) {
          console.log(`User ${userId} already not premium — skipping (idempotent)`)
          break
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPremium: false,
            premiumPlanSlug: null,
            premiumExpiresAt: new Date(),
          },
        })

        console.log(`Premium revoked for user ${userId} (subscription deleted)`)
        break
      }

      // --- Falha de pagamento de assinatura (story 1.7, AC6 — opcional) ---
      case "invoice.payment_failed": {
        const invoice = event.data.object
        // No Stripe SDK 22, o vinculo com a assinatura vive em
        // invoice.parent.subscription_details.subscription.
        const subscriptionRef =
          invoice.parent?.subscription_details?.subscription ?? null
        const subscriptionId =
          typeof subscriptionRef === "string"
            ? subscriptionRef
            : subscriptionRef?.id ?? null

        if (!subscriptionId) {
          console.log(`invoice.payment_failed without subscription: ${invoice.id}`)
          break
        }

        let userId: string | undefined
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          userId = subscription.metadata?.userId
        } catch (subErr) {
          console.error("Could not retrieve subscription on payment failure:", subErr)
          break
        }

        if (!userId) {
          console.error("invoice.payment_failed: subscription has no userId in metadata")
          break
        }

        const existing = await prisma.user.findUnique({
          where: { id: userId },
          select: { isPremium: true },
        })

        if (!existing?.isPremium) {
          console.log(`User ${userId} already not premium — skipping (idempotent)`)
          break
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPremium: false,
            premiumPlanSlug: null,
          },
        })

        console.log(`Premium revoked for user ${userId} (invoice payment failed)`)
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
