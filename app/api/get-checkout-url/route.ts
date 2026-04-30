import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Return a mock checkout URL for testing
    const mockCheckoutUrl = `${request.nextUrl.origin}/success?session_id=${sessionId}`

    return NextResponse.json({ url: mockCheckoutUrl })
  } catch (error) {
    console.error("Error retrieving checkout URL:", error)
    return NextResponse.json({ error: "Error retrieving checkout URL" }, { status: 500 })
  }
}
