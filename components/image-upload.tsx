"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      setError(`Máximo de ${maxImages} imagens`)
      return
    }

    setUploading(true)
    setError("")

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Erro ao fazer upload")
          continue
        }

        onChange([...images, data.url])
      } catch (err) {
        setError("Erro ao fazer upload")
      }
    }

    setUploading(false)
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const triggerFileSelect = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Imagens do Anúncio</label>
        <span className="text-xs text-gray-500">{images.length}/{maxImages}</span>
      </div>

      {/* Grid de imagens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={url}
              alt={`Imagem ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Botão adicionar */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs">Adicionar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Arraste ou clique para adicionar imagens. Máximo 5MB por arquivo.
        Formatos: JPEG, PNG, GIF, WebP
      </p>
    </div>
  )
}