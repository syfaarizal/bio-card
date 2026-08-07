"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { socialLinksSchema, type SocialLinksInput } from "@/lib/validations"
import { saveSocialLinks } from "@/actions/profile"
import { useAutoSave } from "@/hooks/use-auto-save"
import { SaveStatus } from "@/components/shared/save-status"
import type { FullProfile } from "@/types"
import { AtSign, PlayCircle } from "lucide-react"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

const SOCIAL_FIELDS = [
  { key: "instagram" as const, label: "Instagram", placeholder: "https://instagram.com/yourname", Icon: AtSign },
  { key: "tiktok" as const, label: "TikTok", placeholder: "https://tiktok.com/@yourname", Icon: null },
  { key: "twitter" as const, label: "Twitter / X", placeholder: "https://twitter.com/yourname", Icon: null },
  { key: "youtube" as const, label: "YouTube", placeholder: "https://youtube.com/@yourname", Icon: PlayCircle },
]

export function SocialSection({ profile, onUpdate }: Props) {
  const { register, control, formState: { errors } } = useForm<SocialLinksInput>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      instagram: profile.links?.instagram ?? "",
      tiktok: profile.links?.tiktok ?? "",
      twitter: profile.links?.twitter ?? "",
      youtube: profile.links?.youtube ?? "",
    },
  })

  const formData = useWatch<SocialLinksInput>({ control }) as SocialLinksInput

  const { status } = useAutoSave({
    data: formData,
    onSave: async (data) => {
      const result = await saveSocialLinks(data)
      if (result.error) throw new Error(result.error)
      onUpdate({ links: { ...profile.links, ...data } as FullProfile["links"] })
    },
  })

  return (
    <section id="social" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Social Media Links</h2>
        <SaveStatus status={status} />
      </div>

      {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
          <input
            {...register(key)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
          />
          {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]?.message}</p>}
        </div>
      ))}

      {!formData.instagram && !formData.tiktok && !formData.twitter && !formData.youtube && (
        <p className="text-xs text-gray-400 italic">
          Add at least one social link so people can find you.
        </p>
      )}
    </section>
  )
}
