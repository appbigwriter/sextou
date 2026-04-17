"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteAdButtonProps {
  adId: string
  adTitle: string
  variant?: "icon" | "full"
  onDelete?: () => void
}

export function DeleteAdButton({ adId, adTitle, variant = "icon", onDelete }: DeleteAdButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/ads/${adId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao excluir anúncio")
      }

      setIsOpen(false)
      if (onDelete) {
        onDelete()
      } else {
        router.refresh()
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      setLoading(false)
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Excluir anúncio"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Anúncio
        </Button>
      )}

      {/* Custom Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Excluir Anúncio?</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Você tem certeza que deseja excluir o anúncio <span className="font-semibold text-gray-900">"{adTitle}"</span>? 
              Esta ação é permanente e não pode ser desfeita.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setError("")
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Sim, Excluir Permanente"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
