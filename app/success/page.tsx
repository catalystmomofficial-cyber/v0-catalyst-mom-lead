"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // Here you could verify the session and update user status
      setIsLoading(false)
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#A15C2F] mx-auto"></div>
          <p className="mt-4 text-lg">Processing your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E6D3] to-[#E8D5C4]">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#3A2412] mb-4">Welcome to Catalyst Mom Premium! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Your subscription is now active. You'll receive an email confirmation shortly with access to your premium
          features.
        </p>
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-[#A15C2F] hover:bg-[#8B4A26] text-white px-6 py-3 rounded-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}
