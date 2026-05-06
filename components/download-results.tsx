"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface DownloadResultsProps {
  assessmentType: "ttc" | "pregnancy" | "postpartum"
  score: number
  tier: string
  quizState: any
  tierColor: string
  tierLabel: string
  tierDescription: string
}

export function DownloadResults({
  assessmentType,
  score,
  tier,
  quizState,
  tierColor,
  tierLabel,
  tierDescription,
}: DownloadResultsProps) {
  const handleDownload = async () => {
    try {
      // Create a temporary container with the content to download
      const downloadContainer = document.createElement("div")
      downloadContainer.style.position = "absolute"
      downloadContainer.style.left = "-9999px"
      downloadContainer.style.width = "800px"
      downloadContainer.style.background = "#F8F5F2"
      downloadContainer.style.padding = "40px"
      downloadContainer.style.fontFamily = "Arial, sans-serif"

      const typeTitle =
        assessmentType === "ttc"
          ? "TTC Fertility"
          : assessmentType === "pregnancy"
            ? "Pregnancy Wellness"
            : "Postpartum Wellness"

      const timestamp = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      downloadContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3A2412; font-size: 24px; margin: 0 0 10px 0;">Your ${typeTitle} Assessment Results</h1>
          <p style="color: #666; margin: 0; font-size: 14px;">${timestamp}</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <div style="width: 120px; height: 120px; border-radius: 50%; background-color: ${tierColor}; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 48px; font-weight: bold; color: white;">${score}</span>
          </div>
          <h2 style="color: #3A2412; font-size: 20px; margin: 0 0 10px 0;">Your ${typeTitle} Score</h2>
          <p style="background-color: ${tierColor}; color: white; padding: 10px 20px; display: inline-block; border-radius: 20px; font-weight: bold; margin: 0;">
            ${tierLabel}
          </p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <p style="color: #3A2412; font-size: 14px; line-height: 1.6; margin: 0;">
            ${tierDescription}
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
          <h3 style="color: #3A2412; font-size: 16px; margin-bottom: 15px;">Assessment Details</h3>
          <div style="font-size: 13px; color: #666; line-height: 1.8;">
            <p><strong>Assessment Type:</strong> ${typeTitle}</p>
            <p><strong>Score Tier:</strong> ${tierLabel}</p>
            <p><strong>Date:</strong> ${timestamp}</p>
          </div>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            For a personalized wellness plan, visit the Catalyst Mom dashboard.
          </p>
        </div>
      `

      document.body.appendChild(downloadContainer)

      // Convert HTML to canvas
      const canvas = await html2canvas(downloadContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Create PDF from canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgData = canvas.toDataURL("image/png")

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Download the PDF
      const fileName = `Catalyst-Mom-${typeTitle}-Assessment-${timestamp.replace(/\s+/g, "-")}.pdf`
      pdf.save(fileName)

      // Clean up
      document.body.removeChild(downloadContainer)
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Failed to download results. Please try again.")
    }
  }

  return (
    <Button
      onClick={handleDownload}
      className="w-full md:w-auto flex items-center gap-2 text-white px-6 py-3 font-bold rounded-xl shadow-lg"
      style={{ background: "linear-gradient(135deg, #6B4423, #8B5A2B)" }}
    >
      <Download className="w-4 h-4" />
      Download Results
    </Button>
  )
}
