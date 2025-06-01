"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyOtp, forgotPassword } from "@/lib/auth" // Import API calls

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("resetEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // Redirect back if no email found
      router.push("/forgot-password")
    }
  }, [router])

  const maskEmail = (email: string) => {
    if (!email) return ""
    const [localPart, domain] = email.split("@")
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`
    }
    const maskedLocal = localPart[0] + "*".repeat(localPart.length - 2) + localPart[localPart.length - 1]
    return `${maskedLocal}@${domain}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = await verifyOtp(email, otp)
      // Store the token for the next step (reset password)
      sessionStorage.setItem("resetToken", token)
      setIsLoading(false)
      router.push("/reset-password")
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const message = await forgotPassword(email)
      setSuccess(message)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center mb-6">
        We've sent a verification code to <br />
        <span className="font-medium text-gray-800">{maskEmail(email)}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            className="w-full text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
          {isLoading ? "Verifying..." : "Verify code"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            className="text-gray-800 font-medium hover:underline"
          >
            Resend code
          </button>
        </p>
      </div>
    </div>
  )
}
