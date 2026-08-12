import Link from "next/link"
import { ArrowRight, Zap, Palette, Link2 } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { LandingGallery } from "@/features/public/landing-gallery"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export const revalidate = 3600 // ISR — revalidate gallery every hour

async function getPublishedProfiles() {
  return prisma.profile.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      displayName: true,
      bio: true,
      tags: true,
      themeId: true,
      images: { select: { type: true, url: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
  })
}

export default async function LandingPage() {
  const profiles = await getPublishedProfiles()

  const features = [
    {
      icon: Zap,
      title: "Live Preview",
      desc: "See your changes instantly. No refresh. No guessing. Every edit updates your card in real time.",
    },
    {
      icon: Palette,
      title: "5 Beautiful Themes",
      desc: "White, Midnight, Rose, Cyber, Glass. Pick one and look great immediately.",
    },
    {
      icon: Link2,
      title: "One Link, Everything",
      desc: "Social links, music, gallery, bio — all in one shareable URL that works everywhere.",
    },
  ]

  const faqs = [
    {
      q: "Is BioCard free?",
      a: "Yes. BioCard is free forever. No credit card required to get started.",
    },
    {
      q: "Can I change my username?",
      a: "Usernames are permanent once registered. You can customize your public URL slug before publishing.",
    },
    {
      q: "What is a slug?",
      a: "Your slug is the URL people use to visit your profile, like biocard.app/yourname. It defaults to your username but can be customized.",
    },
    {
      q: "How does the music feature work?",
      a: "Paste any Spotify track link and BioCard automatically fetches the song title, artist, and album art to display on your card.",
    },
    {
      q: "Can I make my profile private?",
      a: "Yes. You can set your profile to Draft or Archived any time. Only Published profiles are visible to the public.",
    },
    {
      q: "Will there be more themes?",
      a: "Yes. A theme marketplace is planned for V2 where creators can share and use custom themes.",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors dark:bg-zinc-950 dark:text-zinc-50">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/90 backdrop-blur-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center dark:bg-white">
            <span className="text-white text-xs font-bold dark:text-zinc-950">B</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-zinc-50">BioCard</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100">
            Log in
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 mb-8 dark:border-zinc-800 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Free forever — no credit card required
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.1] dark:text-zinc-50">
          One link.
          <br />
          <span className="text-gray-300 dark:text-zinc-600">Your whole identity.</span>
        </h1>
        <p className="mt-7 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed dark:text-zinc-400">
          Build a beautiful, personalized profile page in minutes.
          Share it everywhere. Let people see who you really are.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-xl font-medium hover:bg-gray-700 transition-colors text-sm dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Create your BioCard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-7 py-3.5 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-4 dark:bg-white">
                <Icon className="w-5 h-5 text-white dark:text-zinc-950" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-50">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed dark:text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="border-t border-gray-100 py-24 px-6 transition-colors dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-50">Made by real people</h2>
            <p className="mt-3 text-gray-500 text-sm dark:text-zinc-400">
              {profiles.length > 0
                ? "BioCards from our community."
                : "Be the first to publish your BioCard."}
            </p>
          </div>
          <LandingGallery profiles={profiles} />
          {profiles.length === 0 && (
            <div className="text-center mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 underline underline-offset-4 hover:no-underline dark:text-zinc-100"
              >
                Create the first one
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-gray-100 py-24 px-6 transition-colors dark:border-zinc-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12 dark:text-zinc-50">
            Frequently asked
          </h2>
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-zinc-800">
            {faqs.map(({ q, a }) => (
              <div key={q} className="py-5">
                <p className="text-sm font-semibold text-gray-900 mb-2 dark:text-zinc-100">{q}</p>
                <p className="text-sm text-gray-500 leading-relaxed dark:text-zinc-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-gray-100 bg-gray-900 py-20 px-6 dark:border-zinc-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white">Start for free.</h2>
          <p className="mt-3 text-gray-400 text-sm">
            Build your BioCard in minutes. Share it everywhere.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm"
          >
            Create your BioCard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 bg-gray-900 py-6 px-6 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">B</span>
            </div>
            <span className="text-sm text-gray-500">BioCard</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 BioCard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
