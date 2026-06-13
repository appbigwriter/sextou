"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface RejectButtonProps {
  adId: string
  className?: string
}

export function RejectButton({ adId, className }: RejectButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    const reason = prompt("Motivo da rejeição:")
    if (!reason) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/ads/${adId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        alert("Anúncio rejeitado")
        router.refresh()
      } else {
        alert("Erro ao rejeitar")
      }
    } catch {
      alert("Erro")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className || "px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-60"}
    >
      {loading ? "Salvando..." : "Recusar"}
    </button>
  )
}