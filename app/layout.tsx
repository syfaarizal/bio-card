import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { ThemeInitializer } from "@/components/shared/theme-initializer"
import "@/styles/themes/index.css"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GeistMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  fallback: ["monospace"],
})

export const metadata: Metadata = {
  title: {
    default: "BioCard — One link. Your whole identity.",
    template: "%s | BioCard",
  },
  description: "Create a beautiful, personalized bio link page in minutes.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://biocard.app"),
  openGraph: {
    type: "website",
    siteName: "BioCard",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeInitializer />
        {children}
      </body>
    </html>
  )
}
