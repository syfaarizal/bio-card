"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { musicSchema, type MusicInput } from "@/lib/validations"
import { saveMusic } from "@/actions/profile"
import type { FullProfile } from "@/types"
import { Music2 } from "lucide-react"
import Image from "next/image"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function MusicSection({ profile, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<MusicInput>({
    resolver: zodResolver(musicSchema),
    defaultValues: { spotifyUrl: profile.music?.spotifyUrl ?? "" },
  })

  const onSubmit = async (data: MusicInput) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    const result = await saveMusic(data)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const hasMusic = profile.music?.songTitle

  return (
    <section id="music" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Music / Now Playing</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Spotify Track URL</label>
          <input
            {...register("spotifyUrl")}
            placeholder="https://open.spotify.com/track/..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
          />
          {errors.spotifyUrl && <p className="mt-1 text-xs text-red-600">{errors.spotifyUrl.message}</p>}
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Song info fetched.</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Fetching…" : "Fetch Song Info"}
        </button>
      </form>

      {hasMusic ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          {profile.music?.albumArt && (
            <Image src={profile.music.albumArt} alt="Album art" width={40} height={40} className="rounded-md" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{profile.music?.songTitle}</p>
            <p className="text-xs text-gray-500 truncate">{profile.music?.artistName}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Paste a Spotify track URL to show what you&apos;re listening to.</p>
      )}
    </section>
  )
}
