"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileIdentitySchema, type ProfileIdentityInput } from "@/lib/validations"
import { saveProfileIdentity } from "@/actions/profile"
import { useAutoSave } from "@/hooks/use-auto-save"
import { SaveStatus } from "@/components/shared/save-status"
import type { FullProfile } from "@/types"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function IdentitySection({ profile, onUpdate }: Props) {
  const birthday = profile.birthday ? new Date(profile.birthday) : null

  const { register, control, formState: { errors } } = useForm<ProfileIdentityInput>({
    resolver: zodResolver(profileIdentitySchema),
    defaultValues: {
      displayName: profile.displayName ?? "",
      slug: profile.slug,
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      birthdayDay: birthday ? String(birthday.getUTCDate()) : "",
      birthdayMonth: birthday ? String(birthday.getUTCMonth() + 1) : "",
      birthdayYear: birthday ? String(birthday.getUTCFullYear()) : "",
      tags: profile.tags.join(", "),
      themeId: profile.themeId,
    },
  })

  const formData = useWatch<ProfileIdentityInput>({ control }) as ProfileIdentityInput

  // Sync preview on every keystroke
  const handleChange = () => {
    onUpdate({
      displayName: formData.displayName ?? null,
      slug: formData.slug,
      bio: formData.bio ?? null,
      location: formData.location ?? null,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    })
  }

  const { status } = useAutoSave({
    data: formData,
    onSave: async (data) => {
      const result = await saveProfileIdentity(data)
      if (result.error) throw new Error(result.error)
    },
  })

  return (
    <section id="identity" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Identity</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
        <input
          value={profile.user.username}
          readOnly
          className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-400">Username cannot be changed.</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
        <input
          {...register("displayName")}
          onChange={(e) => { register("displayName").onChange(e); handleChange() }}
          placeholder="Kai Shi"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
        {errors.displayName && <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Profile URL <span className="text-gray-400 font-normal">biocard.app/</span>
        </label>
        <input
          {...register("slug")}
          onChange={(e) => { register("slug").onChange(e); handleChange() }}
          placeholder="yourname"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
        {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Bio / Role</label>
        <input
          {...register("bio")}
          onChange={(e) => { register("bio").onChange(e); handleChange() }}
          placeholder="Coder, Creator, Developer"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
        {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
        <input
          {...register("location")}
          onChange={(e) => { register("location").onChange(e); handleChange() }}
          placeholder="Jawa Barat, Indonesia"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Birthday</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            {...register("birthdayDay")}
            placeholder="Day"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
          />
          <select
            {...register("birthdayMonth")}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-white"
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1)}>{m}</option>
            ))}
          </select>
          <input
            {...register("birthdayYear")}
            placeholder="Year"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
        <input
          {...register("tags")}
          onChange={(e) => { register("tags").onChange(e); handleChange() }}
          placeholder="Developer, Anime, Creator"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
        />
        <p className="mt-1 text-xs text-gray-400">Separate with commas. Max 5 tags.</p>
        {errors.tags && <p className="mt-1 text-xs text-red-600">{errors.tags.message}</p>}
      </div>
    </section>
  )
}
