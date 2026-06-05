"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface DeleteUserButtonProps {
  userId: string
  userName: string
  userEmail: string
  isAdmin: boolean
}

export function DeleteUserButton({ userId, userName, userEmail, isAdmin }: DeleteUserButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDeleteClick = () => {
    setError("")
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Não foi possível excluir o usuário.")
        setShowConfirm(false)
        return
      }

      router.refresh()
    } catch (_error) {
      setError("Não foi possível excluir o usuário.")
      setShowConfirm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setError("")
  }

  if (showConfirm) {
    return (
      <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
        <p className="text-xs font-semibold text-red-800">Confirmar exclusão?</p>
        <p className="text-xs text-red-700">
          <span className="font-medium">{userName}</span>
          <br />
          <span className="text-red-500">{userEmail}</span>
        </p>
        <p className="text-xs text-red-600">
          ⚠️ Todos os anúncios e dados deste usuário serão excluídos permanentemente.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Excluindo..." : "Confirmar exclusão"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDeleteClick}
        disabled={loading || isAdmin}
        title={isAdmin ? "Não é possível excluir um admin" : `Excluir ${userName}`}
        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Excluir conta
      </button>
      {isAdmin && (
        <p className="text-xs text-gray-400">Remova o acesso admin antes de excluir.</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
