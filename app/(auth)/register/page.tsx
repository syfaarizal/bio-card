import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/features/auth/register-form"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your BioCard account and build your profile.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Create your BioCard</h1>
          <p className="mt-1 text-sm text-gray-500">Free forever. No credit card required.</p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gray-900 underline underline-offset-4 hover:no-underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
