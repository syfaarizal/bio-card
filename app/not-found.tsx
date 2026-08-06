import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <p className="text-6xl font-black text-gray-200 mb-4">404</p>
      <h1 className="text-xl font-semibold text-gray-900">Profile not found</h1>
      <p className="mt-2 text-sm text-gray-500">This profile doesn&apos;t exist or hasn&apos;t been published yet.</p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-gray-900 underline underline-offset-4 hover:no-underline"
      >
        Go back home
      </Link>
    </div>
  )
}
