import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      paymentIntent: session.payment_intent,
    })
  } catch (error) {
    console.error("Verify session error:", error)
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 })
  }
}