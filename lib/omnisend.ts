"use server"

export interface OmnisendContact {
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
  customProperties?: Record<string, string | number>
}

export async function addContactToOmnisend(contact: OmnisendContact) {
  const apiKey = process.env.OMNISEND_API_KEY

  if (!apiKey) {
    console.log("[v0] Omnisend - API key not configured, skipping")
    return { success: false, error: "API key not configured" }
  }

  try {
    console.log("[v0] Omnisend - Sending contact:", {
      email: contact.email,
      firstName: contact.firstName,
      tags: contact.tags,
    })

    const payload = {
      identifiers: [
        {
          type: "email",
          id: contact.email,
          channels: {
            email: {
              status: "subscribed",
              statusDate: new Date().toISOString(),
            },
          },
        },
      ],
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      tags: contact.tags || [],
      customProperties: contact.customProperties || {},
    }

    console.log("[v0] Omnisend - Payload:", JSON.stringify(payload, null, 2))

    const response = await fetch("https://api.omnisend.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    })

    console.log("[v0] Omnisend - Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Omnisend - Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      return { success: false, error: errorText }
    }

    const data = await response.json()
    console.log("[v0] Omnisend - Success! Contact ID:", data.contactID)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Omnisend - Exception:", error)
    return { success: false, error: String(error) }
  }
}
