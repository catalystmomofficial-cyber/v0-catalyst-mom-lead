import { type NextRequest, NextResponse } from "next/server"

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

    // Generate a mock session ID for testing
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`

    console.log("[v0] Created checkout session:", mockSessionId)

    return NextResponse.json({ sessionId: mockSessionId })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
