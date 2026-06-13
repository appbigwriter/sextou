"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface ApproveButtonProps {
  adId: string
  className?: string
}

export function ApproveButton({ adId, className }: ApproveButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!confirm("Tem certeza que deseja APROVAR este anúncio?")) return
    
    const receiptNumber = prompt("Insira o número do comprovante de pagamento (ou deixe em branco se não aplicável):")
    if (receiptNumber === null) return // Canceled

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/ads/${adId}/approve`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptNumber: receiptNumber.trim() })
      })
      if (res.ok) {
        alert("Anúncio aprovado com sucesso!")
        router.refresh()
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
      className={className || "px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-60"}
    >
      {loading ? "Salvando..." : "Publicar"}
    </button>
  )
}