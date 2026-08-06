import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/features/auth/login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your BioCard account.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Log in to your BioCard account</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-gray-900 underline underline-offset-4 hover:no-underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
