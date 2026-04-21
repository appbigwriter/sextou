"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface ApproveButtonProps {
  adId: string
}

export function ApproveButton({ adId }: ApproveButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!confirm("Tem certeza que deseja APROVAR este anúncio?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/ads/${adId}/approve`, { method: "POST" })
      if (res.ok) {
        alert("Anúncio aprovado com sucesso!")
        router.push("/admin/anuncios")
      } else {
        alert("Erro ao aprovar")
      }
    } catch {
      alert("Erro ao aprovar")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-60"
    >
      {loading ? "Salvando..." : "Publicar"}
    </button>
  )
}