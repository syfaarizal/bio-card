import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Geist_Mono } from "next/font/google"
import "@/styles/themes/index.css"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
  const themeScript = `
    try {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add("dark");
      }
    } catch {}
  `

  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: themeScript }}
      />
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
