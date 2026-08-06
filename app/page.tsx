import Link from "next/link"
import { ArrowRight, Zap, Shield, Palette } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: "Live Preview",
      desc: "See your changes instantly. No refresh. No guessing.",
    },
    {
      icon: Palette,
      title: "Beautiful Themes",
      desc: "5 carefully crafted themes. Pick one, look great immediately.",
    },
    {
      icon: Shield,
      title: "One Link, Everything",
      desc: "Social links, music, gallery, bio — all in one shareable URL.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="font-semibold text-gray-900">BioCard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-24 pb-16">
        <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-tight">
          One link.
          <br />
          <span className="text-gray-400">Your whole identity.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
          Build a beautiful, personalized profile page in minutes. Share it everywhere.
          Let people see who you really are.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Create your BioCard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Log in
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">Free forever. No credit card required.</p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-xl mx-auto text-center px-6">
          <h2 className="text-3xl font-black text-white">Start for free.</h2>
          <p className="mt-3 text-gray-400">Build your BioCard in minutes. Share it everywhere.</p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Create your BioCard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gray-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">B</span>
            </div>
            <span className="text-sm text-gray-400">BioCard</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 BioCard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
