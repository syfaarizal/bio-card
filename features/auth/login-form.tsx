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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-zinc-300">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 dark:text-zinc-300">
          BioCard password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
        />
        {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">This is separate from your email account password.</p>
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  )
}
