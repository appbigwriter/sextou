"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface ActiveAdsToggleButtonProps {
  userId: string
  hasActiveAds: boolean
}

export function ActiveAdsToggleButton({
  userId,
  hasActiveAds,
}: ActiveAdsToggleButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleClick = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-active-ads`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Nao foi possivel atualizar anuncios ativos.")
        return
      }

      router.refresh()
    } catch (_error) {
      setError("Nao foi possivel atualizar anuncios ativos.")
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
          hasActiveAds
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {loading ? "Salvando..." : hasActiveAds ? "Desabilitar PRO" : "Habilitar PRO"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
