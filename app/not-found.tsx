import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-gray-100 select-none leading-none mb-6">404</p>
        <h1 className="text-xl font-semibold text-gray-900">Profile not found</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
          This profile doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to BioCard
        </Link>
      </div>
    </div>
  )
}
