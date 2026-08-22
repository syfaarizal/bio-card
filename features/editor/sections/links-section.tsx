"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { PROVIDERS, POPULAR_PROVIDERS, FALLBACK_ICONS, type ProviderId } from "@/lib/links/providers"
import { detectProvider, getDefaultLabel, normalizeUrl } from "@/lib/links/detect"
import { createLink, updateLink, deleteLink, reorderLinks } from "@/actions/profile"
import { BrandIcon } from "@/components/shared/brand-icon"
import { cn } from "@/lib/utils"
import { Plus, GripVertical, Trash2, Edit2, X, Link2, ExternalLink } from "lucide-react"
import type { ProfileLink } from "@/types"

interface Props {
  links: ProfileLink[]
  onUpdate: (updates: { profileLinks?: ProfileLink[] }) => void
}

type DialogMode = "add" | "edit" | null

export function LinksSection({ links, onUpdate }: Props) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [editingLink, setEditingLink] = useState<ProfileLink | null>(null)
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [detectedProvider, setDetectedProvider] = useState<ProviderId>("custom")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const dialogRef = useRef<HTMLDialogElement>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const linkToDelete = useRef<ProfileLink | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Local state for optimistic updates
  const [localLinks, setLocalLinks] = useState<ProfileLink[]>(links)

  // Sync with parent when links change
  useEffect(() => {
    setLocalLinks(links)
  }, [links])

  // Sort links by sortOrder
  const sortedLinks = [...localLinks].sort((a, b) => a.sortOrder - b.sortOrder)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (dialogMode) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [dialogMode])

  useEffect(() => {
    const dialog = deleteDialogRef.current
    if (!dialog) return

    if (deletingId) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [deletingId])

  const handleUrlChange = (value: string) => {
    setUrl(value)
    setError(null)

    if (value.trim()) {
      const normalized = normalizeUrl(value)
      const provider = detectProvider(normalized)
      setDetectedProvider(provider)

      // Auto-set title if empty
      if (!title) {
        setTitle(getDefaultLabel(provider))
      }
    } else {
      setDetectedProvider("custom")
    }
  }

  const handleProviderSelect = (providerId: ProviderId) => {
    setDetectedProvider(providerId)
    if (!title || title === getDefaultLabel(detectedProvider)) {
      setTitle(getDefaultLabel(providerId))
    }
  }

  const openAddDialog = () => {
    setUrl("")
    setTitle("")
    setDetectedProvider("custom")
    setError(null)
    setEditingLink(null)
    setDialogMode("add")
  }

  const openEditDialog = (link: ProfileLink) => {
    setUrl(link.url)
    setTitle(link.title)
    setDetectedProvider(link.provider as ProviderId)
    setError(null)
    setEditingLink(link)
    setDialogMode("edit")
  }

  const closeDialog = () => {
    setDialogMode(null)
    setEditingLink(null)
    setUrl("")
    setTitle("")
    setDetectedProvider("custom")
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (dialogMode === "add") {
        const result = await createLink({
          title: title.trim(),
          url: url.trim(),
          provider: detectedProvider,
        })

        if (result.error) {
          setError(result.error)
          return
        }

        // Trigger parent to refresh from server
        onUpdate({})
      } else if (dialogMode === "edit" && editingLink) {
        const result = await updateLink(editingLink.id, {
          title: title.trim(),
          url: url.trim(),
          provider: detectedProvider,
        })

        if (result.error) {
          setError(result.error)
          return
        }

        // Trigger parent to refresh from server
        onUpdate({})
      }

      closeDialog()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (link: ProfileLink) => {
    linkToDelete.current = link
    setDeletingId(link.id)
  }

  const handleDelete = async () => {
    if (!linkToDelete.current) return

    setSaving(true)
    try {
      const result = await deleteLink(linkToDelete.current.id)
      if (result.error) {
        setError(result.error)
        return
      }

      // Remove from local state
      setLocalLinks((prev) => prev.filter((l) => l.id !== linkToDelete.current?.id))
      onUpdate({})
      linkToDelete.current = null
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete link")
    } finally {
      setSaving(false)
      setDeletingId(null)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, linkId: string) => {
    setDragId(linkId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, linkId: string) => {
    e.preventDefault()
    if (dragId && dragId !== linkId) {
      setDragOverId(linkId)
    }
  }

  const handleDragEnd = async () => {
    if (dragId && dragOverId && dragId !== dragOverId) {
      const newOrder = [...localLinks]
      const fromIndex = newOrder.findIndex((l) => l.id === dragId)
      const toIndex = newOrder.findIndex((l) => l.id === dragOverId)

      if (fromIndex !== -1 && toIndex !== -1) {
        const [moved] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, moved)

        // Optimistic update
        setLocalLinks(newOrder)

        // Persist to server
        await reorderLinks(newOrder.map((l) => l.id))
        onUpdate({})
      }
    }

    setDragId(null)
    setDragOverId(null)
  }

  return (
    <section id="links" className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 transition-colors dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Links</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
            Share your socials, websites, communities, and anything else.
          </p>
        </div>
        <button
          onClick={openAddDialog}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Link
        </button>
      </div>

      {/* Links list */}
      {sortedLinks.length === 0 ? (
        <div className="text-center py-8">
          <Link2 className="w-8 h-8 mx-auto text-gray-300 dark:text-zinc-700 mb-2" />
          <p className="text-sm text-gray-400 dark:text-zinc-500">You haven't added any links yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedLinks.map((link) => (
            <div
              key={link.id}
              draggable
              onDragStart={(e) => handleDragStart(e, link.id)}
              onDragOver={(e) => handleDragOver(e, link.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border bg-gray-50 dark:bg-zinc-900 transition-all group",
                dragOverId === link.id && "border-gray-900 dark:border-zinc-300",
                dragId === link.id && "opacity-50"
              )}
            >
              <GripVertical className="w-4 h-4 text-gray-400 dark:text-zinc-600 cursor-grab flex-shrink-0" />

              <BrandIcon provider={link.provider as ProviderId} className="w-5 h-5 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">{link.title}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">{link.url}</p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditDialog(link)}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => confirmDelete(link)}
                  className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-950 text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <dialog
        ref={dialogRef}
        onClose={closeDialog}
        className="p-0 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl backdrop:bg-black/50 w-full max-w-md"
      >
        <form ref={formRef} onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50">
              {dialogMode === "add" ? "Add Link" : "Edit Link"}
            </h3>
            <button
              type="button"
              onClick={closeDialog}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Popular providers */}
          <div className="flex flex-wrap gap-2">
            {POPULAR_PROVIDERS.map((providerId) => {
              const provider = PROVIDERS[providerId]
              const isSelected = detectedProvider === providerId

              return (
                <button
                  key={providerId}
                  type="button"
                  onClick={() => handleProviderSelect(providerId)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors",
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
                  )}
                >
                  <span className="w-3.5 h-3.5">
                    <BrandIcon provider={providerId} className="w-3.5 h-3.5" />
                  </span>
                  {provider.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => handleProviderSelect("custom")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors",
                detectedProvider === "custom"
                  ? "bg-gray-900 text-white border-gray-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
              )}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Custom
            </button>
          </div>

          {/* URL input */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
            />
          </div>

          {/* Title input */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-zinc-400">Label</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Link"
              required
              maxLength={50}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeDialog}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {saving ? "Saving..." : dialogMode === "add" ? "Add Link" : "Save Changes"}
            </button>
          </div>
        </form>
      </dialog>

      {/* Delete confirmation dialog */}
      <dialog
        ref={deleteDialogRef}
        onClose={() => setDeletingId(null)}
        className="p-0 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl backdrop:bg-black/50 w-full max-w-sm"
      >
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Delete Link</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Are you sure you want to delete "{linkToDelete.current?.title}"?
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeletingId(null)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  )
}
