"use client"

import { useState } from "react"
import { deleteAccount } from "@/actions/profile"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error"

interface Toast {
  type: ToastType
  message: string
}

function InlineToast({ toast }: { toast: Toast }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm px-3 py-2 rounded-lg border",
        toast.type === "success"
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      )}
    >
      {toast.type === "success" ? (
        <Check className="w-3.5 h-3.5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      {toast.message}
    </div>
  )
}

export default function SettingsPage() {
  // Password
  const [pwLoading, setPwLoading] = useState(false)
  const [pwToast, setPwToast] = useState<Toast | null>(null)
  const [newPassword, setNewPassword] = useState("")

  // Delete account
  const [deleteInput, setDeleteInput] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const router = useRouter()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPwToast({ type: "error", message: "Password must be at least 8 characters." })
      return
    }
    setPwLoading(true)
    setPwToast(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPwToast({ type: "error", message: error.message })
    } else {
      setPwToast({ type: "success", message: "Password updated successfully." })
      setNewPassword("")
    }
    setPwLoading(false)
    setTimeout(() => setPwToast(null), 4000)
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    const result = await deleteAccount(deleteInput)
    if (result.error) {
      setDeleteError(result.error)
      setDeleteLoading(false)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account.</p>
      </div>

      {/* ── Change Password ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
          <p className="text-xs text-gray-400 mt-0.5">Must be at least 8 characters.</p>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            minLength={8}
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
          />
          {pwToast && <InlineToast toast={pwToast} />}
          <button
            type="submit"
            disabled={pwLoading || !newPassword}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {pwLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {pwLoading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </section>

      {/* ── Danger Zone ── */}
      <section className="bg-white rounded-2xl border border-red-100 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Deleting your account deactivates it for 30 days. After that, all data is permanently removed.
          </p>
        </div>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-xs text-red-700 font-medium">
                This action cannot be undone immediately. Type your username to confirm.
              </p>
            </div>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="your-username"
              className="w-full rounded-xl border border-red-200 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-colors"
            />
            {deleteError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {deleteError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deleteInput}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleteLoading ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteInput("")
                  setDeleteError(null)
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
