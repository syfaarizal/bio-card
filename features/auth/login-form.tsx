"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { loginAction } from "@/actions/auth"

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setServerError(null)
    const result = await loginAction(data)
    if (result?.error) {
      setServerError(result.error)
      setLoading(false)
    }
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          BioCard password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        <p className="mt-1 text-xs text-gray-500">This is separate from your email account password.</p>
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
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  )
}
