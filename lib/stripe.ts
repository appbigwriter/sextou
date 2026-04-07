import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    })
  }
  return stripeInstance
}

export const stripe = {
  get client() {
    return getStripe()
  },
}

export const PRICE_PER_AD = 30.00
export const CURRENCY = "usd"

export async function createCheckoutSession({
  adId,
  adTitle,
  customerEmail,
  customerName,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  adId: string
  adTitle: string
  customerEmail: string
  customerName: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripe()
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: `Publicação de Anúncio: ${adTitle}`,
            description: "Anúncio semanal na Sexta do Empreendedor",
          },
          unit_amount: Math.round(PRICE_PER_AD * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      adId,
      type: "ad_payment",
      ...metadata,
    },
  })

  return session
}

export async function createPaymentIntent({
  amount,
  currency = CURRENCY,
  metadata = {},
}: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripe()
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  })

  return paymentIntent
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  const stripe = getStripe()
  return stripe.paymentIntents.retrieve(paymentIntentId)
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  const stripe = getStripe()
  
  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  }

  if (amount) {
    refundParams.amount = Math.round(amount * 100)
  }

  return stripe.refunds.create(refundParams)
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

export function verifyStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}