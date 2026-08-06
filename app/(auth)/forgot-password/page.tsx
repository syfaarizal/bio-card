import { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your BioCard password.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Reset your password</h1>
          <p className="mt-1 text-sm text-gray-500">Enter your email and we&apos;ll send you a reset link.</p>
        </div>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-gray-900 underline underline-offset-4 hover:no-underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
