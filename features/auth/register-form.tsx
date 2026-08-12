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
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-5 text-center dark:border-green-900/60 dark:bg-green-950/40">
        <p className="font-medium text-green-800 dark:text-green-300">Check your email</p>
        <p className="mt-1 text-sm text-green-700 dark:text-green-400">
          We sent a verification link. Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 dark:text-zinc-300">
          Username
        </label>
        <div className="flex items-center rounded-lg border border-gray-300 bg-white focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors overflow-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-zinc-300 dark:focus-within:ring-zinc-300">
          <span className="pl-3 pr-1 text-sm text-gray-400 select-none dark:text-zinc-500">biocard.app/</span>
          <input
            {...register("username")}
            id="username"
            type="text"
            autoComplete="username"
            placeholder="yourname"
            className="flex-1 py-2 pr-3 text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
        </div>
        {errors.username && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.username.message}</p>}
      </div>

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
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
          />
        {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">Create a new password just for your BioCard account.</p>
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  )
}
