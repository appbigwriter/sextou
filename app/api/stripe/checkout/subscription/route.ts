import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { getStripe, verifyStripeConfigured } from "@/lib/stripe"

const subscriptionSchema = z.object({
  planSlug: z.enum(["starter", "pro", "agency"]),
  returnTo: z.string().optional(),
})

const PLAN_PRICE_ENV: Record<"starter" | "pro" | "agency", string> = {
  starter: "STRIPE_PRICE_STARTER",
  pro: "STRIPE_PRICE_PRO",
  agency: "STRIPE_PRICE_AGENCY",
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyStripeConfigured()) {
      return NextResponse.json({ error: "Stripe nao configurado" }, { status: 500 })
    }

    const session = await auth()

    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { planSlug, returnTo } = subscriptionSchema.parse(body)

    const priceId = process.env[PLAN_PRICE_ENV[planSlug]]

    if (!priceId) {
      return NextResponse.json(
        { error: "Plano indisponivel no momento" },
        { status: 500 }
      )
    }

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.AUTH_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000"

    const successPath =
      returnTo ||
      "/sextou-tools-pro/launch-studio?premium=success&session_id={CHECKOUT_SESSION_ID}"
    const cancelPath = "/sextou-tools-pro/acesso?premium=cancelled"

    const stripe = getStripe()

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}${successPath}`,
      cancel_url: `${baseUrl}${cancelPath}`,
      metadata: {
        userId: session.user.id,
        planSlug,
        type: "premium_subscription",
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planSlug,
        },
      },
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Stripe subscription checkout error:", error)
    return NextResponse.json(
      { error: "Erro ao criar sessao de assinatura" },
      { status: 500 }
    )
  }
}
