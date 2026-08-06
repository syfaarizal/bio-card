"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { registerSchema, loginSchema, forgotPasswordSchema } from "@/lib/validations"
import { redirect } from "next/navigation"
import type { RegisterInput, LoginInput, ForgotPasswordInput } from "@/lib/validations"

export async function registerAction(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email, username, password } = parsed.data
  const supabase = await createServerSupabaseClient()

  // Check username availability
  const existingUser = await prisma.user.findUnique({ where: { username } })
  if (existingUser) {
    return { error: "This username is already taken." }
  }

  // Create auth user in Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Something went wrong. Please try again." }
  }

  // Create user record in our DB
  await prisma.user.create({
    data: {
      id: authData.user.id,
      email,
      username,
      profile: {
        create: {
          slug: username, // default slug = username
        },
      },
    },
  })

  return { success: true, message: "Check your email to verify your account." }
}

export async function loginAction(input: LoginInput) {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email, password } = parsed.data
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "Invalid email or password." }
  }

  redirect("/dashboard")
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function forgotPasswordAction(input: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: "Something went wrong. Please try again." }
  }

  return { success: true, message: "Check your email for a reset link." }
}
