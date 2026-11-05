"use client"

import { useRef } from "react"
import { ArrowUpRight, Link2, X } from "lucide-react"
import type { ProfileLink } from "@/types"
import { BrandIcon } from "@/components/shared/brand-icon"

export function MoreLinksDialog({ links }: { links: ProfileLink[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  if (links.length === 0) return null

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} aria-haspopup="dialog" className="group mx-auto mt-3 flex min-h-10 w-full max-w-sm items-center justify-center gap-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-soft)] px-5 py-3 text-sm font-semibold text-[var(--theme-text)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)] @sm:text-base">
        <Link2 className="h-5 w-5 text-[var(--theme-accent)] transition-transform group-hover:rotate-[-12deg]" />
        <span>Explore more links</span><span className="text-[var(--theme-accent)]" aria-hidden>→</span>
      </button>
      <dialog ref={dialogRef} aria-labelledby="more-links-title" onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close() }} className="m-auto max-h-[min(80dvh,44rem)] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-panel)] p-0 text-[var(--theme-text)] shadow-2xl backdrop:bg-black/50">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] px-5 py-4">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">All links</p><h2 id="more-links-title" className="mt-1 text-lg font-bold">Explore more links</h2></div>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close links" className="rounded-full p-2 text-[var(--theme-muted)] transition hover:bg-[var(--theme-soft)] hover:text-[var(--theme-text)]"><X className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[calc(min(80dvh,44rem)-5rem)] space-y-2 overflow-y-auto p-4">
          {links.map((link) => <a key={link.id} href={link.url} title={link.title} target="_blank" rel="noreferrer" className="flex min-h-16 items-center gap-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-soft)] px-4 py-3 transition hover:border-[var(--theme-accent)] hover:shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-panel)] text-[var(--theme-accent)]"><BrandIcon provider={link.provider} className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{link.title}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--theme-muted)]" />
          </a>)}
        </div>
      </dialog>
    </>
  )
}
