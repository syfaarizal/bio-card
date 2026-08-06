"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations"
import { registerAction } from "@/actions/auth"

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    setServerError(null)
    const result = await registerAction(data)
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
        <p className="font-medium text-green-800">Check your email</p>
        <p className="mt-1 text-sm text-green-700">
          We sent a verification link. Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <div className="flex items-center rounded-lg border border-gray-300 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors overflow-hidden">
          <span className="pl-3 pr-1 text-sm text-gray-400 select-none">biocard.app/</span>
          <input
            {...register("username")}
            id="username"
            type="text"
            autoComplete="username"
            placeholder="yourname"
            className="flex-1 py-2 pr-3 text-sm outline-none bg-transparent"
          />
        </div>
        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
      </div>

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
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
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
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  )
}
