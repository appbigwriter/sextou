"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function VideoForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    youtubeUrl: initialData?.youtubeUrl || "",
    description: initialData?.description || "",
    isFeatured: initialData?.isFeatured || false,
    isActive: initialData?.isActive ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = isEditing 
        ? `/api/admin/videos/${initialData.id}` 
        : `/api/admin/videos`
        
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar vídeo")
      }

      router.push("/admin/videos")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/videos/${initialData.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao excluir vídeo")
      }

      router.push("/admin/videos")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
          placeholder="Ex: Como anunciar no Sextou"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL do YouTube</label>
        <input
          type="url"
          required
          value={formData.youtubeUrl}
          onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
          placeholder="Ex: https://youtu.be/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
          placeholder="Breve descrição do vídeo..."
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-5 h-5 text-[#F97316] rounded focus:ring-[#F97316]"
          />
          <span className="text-gray-700">Destaque na Home</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 text-[#F97316] rounded focus:ring-[#F97316]"
          />
          <span className="text-gray-700">Ativo (Visível)</span>
        </label>
      </div>

      <div className="pt-6 border-t flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F97316] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#EA580C] transition disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Vídeo"}
        </button>
        
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-100 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50"
          >
            Excluir Vídeo
          </button>
        )}
      </div>
    </form>
  )
}
