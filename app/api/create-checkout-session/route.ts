import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, userId, email, name } = body

    console.log("[v0] Checkout request:", { priceId, userId, email, name })

    if (!priceId || priceId.startsWith("pk_")) {
      console.error("Invalid price ID provided:", priceId)
      return NextResponse.json(
        {
          error: "Invalid price ID. Please check your Stripe configuration.",
        },
        { status: 400 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}`,
      customer_email: email,
      metadata: {
        userId: userId || "",
        customerName: name || "",
      },
      subscription_data: {
        metadata: {
          userId: userId || "",
          customerName: name || "",
        },
      },
    })

    console.log("[v0] Created checkout session:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
