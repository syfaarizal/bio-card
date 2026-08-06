import type { SpotifyOEmbed } from "@/types"

export async function fetchSpotifyOEmbed(url: string): Promise<SpotifyOEmbed> {
  const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`

  const res = await fetch(oembedUrl, {
    next: { revalidate: 3600 }, // cache 1 hour
  })

  if (!res.ok) {
    throw new Error("Couldn't fetch song info. Try again later.")
  }

  const data = await res.json()

  if (!data.title || !data.author_name) {
    throw new Error("That doesn't look like a valid Spotify track URL.")
  }

  return data as SpotifyOEmbed
}
