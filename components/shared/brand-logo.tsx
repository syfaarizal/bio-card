import Image from "next/image"

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/biocard-logo.svg"
      alt="BioCard logo"
      width={64}
      height={64}
      unoptimized
      className={className}
    />
  )
}
