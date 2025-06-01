import Link from "next/link"
import ForgotPasswordForm from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
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
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Forgot your password?</h1>
          <p className="text-gray-600 text-center mb-6">
            Enter your email address and we'll send you a verification code to reset your password.
          </p>

          <ForgotPasswordForm />

          <div className="mt-6 text-center">
            <Link href="/login" className="text-gray-800 font-medium hover:underline">
              ← Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
