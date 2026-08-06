"use client"

import { useState } from "react"
import { deleteAccount } from "@/actions/profile"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [deleteInput, setDeleteInput] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

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

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const supabase = createClient()
    const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) alert(error.message)
    else alert("Password updated.")
    form.reset()
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account.</p>
      </div>

      {/* Change Password */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
            <input
              name="newPassword"
              type="password"
              placeholder="Min. 8 characters"
              minLength={8}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </section>

      {/* Delete Account */}
      <section className="bg-white rounded-xl border border-red-100 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-red-700">Delete Account</h2>
        <p className="text-sm text-gray-500">
          Your account will be deactivated. You have 30 days to recover it before all data is permanently deleted.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Type your username to confirm
              </label>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="your-username"
                className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
            {deleteError && (
              <p className="text-xs text-red-600">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deleteInput}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteLoading ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput("") }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
