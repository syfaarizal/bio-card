"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileIdentitySchema, type ProfileIdentityInput } from "@/lib/validations"
import { saveProfileIdentity } from "@/actions/profile"
import { useAutoSave } from "@/hooks/use-auto-save"
import { SaveStatus } from "@/components/shared/save-status"
import { parseBirthdayParts, MONTH_NAMES } from "@/lib/birthday"
import type { FullProfile } from "@/types"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function IdentitySection({ profile, onUpdate }: Props) {
  const birthday = profile.birthday ? new Date(profile.birthday) : null

  const { register, control, formState: { errors } } = useForm<ProfileIdentityInput>({
    resolver: zodResolver(profileIdentitySchema),
    // There is no submit button — the form saves itself. Validating on submit
    // only would mean the field errors never render, so the birthday rules
    // would fail silently.
    mode: "onChange",
    defaultValues: {
      displayName: profile.displayName ?? "",
      slug: profile.slug,
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      birthdayDay: birthday ? String(birthday.getUTCDate()) : "",
      birthdayMonth: birthday ? String(birthday.getUTCMonth() + 1) : "",
      birthdayYear: birthday ? String(birthday.getUTCFullYear()) : "",
      tags: profile.tags.join(", "),
    },
  })

  const formData = useWatch<ProfileIdentityInput>({ control }) as ProfileIdentityInput

  /**
   * Push the form state into the live preview.
   *
   * This reads `useWatch`'s value, which is one render behind the keystroke
   * that triggered it — so calling it straight from `onChange` made the
   * preview lag by one character (typing "Dimas" showed "Dima"). Instead the
   * preview is driven from a `useEffect` on the watched values, which always
   * sees the committed state.
   */
  useEffect(() => {
    const parsed = parseBirthdayParts(
      formData.birthdayDay ?? "",
      formData.birthdayMonth ?? "",
      formData.birthdayYear ?? "",
    )

    onUpdate({
      displayName: formData.displayName ?? null,
      slug: formData.slug,
      bio: formData.bio ?? null,
      location: formData.location ?? null,
      birthday: parsed,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    })
    // `onUpdate` is a stable setState wrapper in the editor; re-running on
    // every parent render would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.displayName, formData.slug, formData.bio, formData.location, formData.tags, formData.birthdayDay, formData.birthdayMonth, formData.birthdayYear])

  const { status } = useAutoSave({
    data: formData,
    // Don't push an invalid form to the server — the field error already
    // explains what is wrong, and a rejected save would add a second,
    // more confusing "Failed to save" next to it.
    enabled: Object.keys(errors).length === 0,
    onSave: async (data) => {
      const result = await saveProfileIdentity(data)
      if (result.error) throw new Error(result.error)
    },
  })

  return (
    <section id="identity" className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 transition-colors dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Identity</h2>
        <SaveStatus status={status} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">Username</label>
        <input
          value={profile.user.username}
          readOnly
          className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500"
        />
        <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">Username cannot be changed.</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">Display Name</label>
        <input
          {...register("displayName")}
          placeholder="Your Name"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
        />
        {errors.displayName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.displayName.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">
          Profile URL <span className="text-gray-400 font-normal dark:text-zinc-500">biocard.app/</span>
        </label>
        <input
          {...register("slug")}
          placeholder="yourname"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
        />
        {errors.slug && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">Bio / Role</label>
        <input
          {...register("bio")}
          placeholder="Describe yourself in a few words"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
        />
        {errors.bio && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.bio.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">Location</label>
        <input
          {...register("location")}
          placeholder="Your City, Country"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">Birthday</label>
        <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
          <input
            {...register("birthdayDay")}
            placeholder="Day"
            inputMode="numeric"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
          />
          <select
            {...register("birthdayMonth")}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
          >
            <option value="">Month</option>
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={String(i + 1)}>{m}</option>
            ))}
          </select>
          <input
            {...register("birthdayYear")}
            placeholder="Year"
            inputMode="numeric"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
          />
        </div>
        {errors.birthdayDay && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.birthdayDay.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">Tags</label>
        <input
          {...register("tags")}
          placeholder="Tags separated by commas"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
        />
        <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">Separate with commas. Max 5 tags.</p>
        {errors.tags && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.tags.message}</p>}
      </div>
    </section>
  )
}
