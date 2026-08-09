"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations"
import { forgotPasswordAction } from "@/actions/auth"

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true)
    setServerError(null)
    const result = await forgotPasswordAction(data)
    if (result?.error) {
      setServerError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-5 text-center">
        <p className="font-medium text-green-800">Reset link sent</p>
        <p className="mt-1 text-sm text-green-700">Check your email for a link to reset your BioCard password.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>
    </form>
  )
}
