"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface AdminToggleButtonProps {
  userId: string
  isAdmin: boolean
}

export function AdminToggleButton({ userId, isAdmin }: AdminToggleButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleClick = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Nao foi possivel atualizar o acesso admin.")
        return
      }

      router.refresh()
    } catch (_error) {
      setError("Nao foi possivel atualizar o acesso admin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`rounded-lg px-3 py-2 text-xs font-semibold ${
          isAdmin
            ? "bg-red-50 text-red-700 hover:bg-red-100"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {loading ? "Salvando..." : isAdmin ? "Remover admin" : "Tornar admin"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
