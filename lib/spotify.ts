import type { SpotifyOEmbed } from "@/types"

const SPOTIFY_TRACK_URL_PATTERN = /^\/(?:intl-[^/]+\/)?track\/([A-Za-z0-9]+)\/?$/i

export function normalizeSpotifyTrackUrl(value: string): string | null {
  try {
    const parsed = new URL(value.trim())
    if (
      parsed.protocol !== "https:" ||
      !["open.spotify.com", "www.open.spotify.com"].includes(parsed.hostname)
    ) {
      return null
    }

    const match = parsed.pathname.match(SPOTIFY_TRACK_URL_PATTERN)
    return match ? `https://open.spotify.com/track/${match[1]}` : null
  } catch {
    return null
  }
}

export async function fetchSpotifyOEmbed(url: string): Promise<SpotifyOEmbed> {
  const normalizedUrl = normalizeSpotifyTrackUrl(url)
  if (!normalizedUrl) {
    throw new Error("That doesn't look like a valid Spotify track URL.")
  }

  const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(normalizedUrl)}`

  const res = await fetch(oembedUrl, {
    next: { revalidate: 3600 }, // cache 1 hour
  })

  if (!res.ok) {
    throw new Error("Couldn't fetch song info. Try again later.")
  }

  const data = await res.json()

  // Spotify's oEmbed response does not always include author_name for tracks.
  if (!data.title) {
    throw new Error("That doesn't look like a valid Spotify track URL.")
  }

  return {
    ...(data as SpotifyOEmbed),
    author_name: data.author_name ?? "Spotify",
    thumbnail_url: data.thumbnail_url ?? "",
  }
}
