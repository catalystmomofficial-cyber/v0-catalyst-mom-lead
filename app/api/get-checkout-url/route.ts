import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the checkout session to get the URL
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error retrieving checkout URL:", error)
    return NextResponse.json({ error: "Error retrieving checkout URL" }, { status: 500 })
  }
}
