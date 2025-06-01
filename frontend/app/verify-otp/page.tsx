import Link from "next/link"
import VerifyOtpForm from "@/components/verify-otp-form"

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="ReadRack Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-800">ReadRack</span>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Enter verification code</h1>

          <VerifyOtpForm />

          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-gray-800 font-medium hover:underline">
              ← Back to forgot password
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
