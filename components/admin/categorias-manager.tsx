"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  isActive: boolean
  order: number
}

interface Props {
  categories: Category[]
}

export function CategoriasManager({ categories: initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", icon: "" })

  const handleCreate = async () => {
    if (!newCategory.name || !newCategory.slug) return

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      })

      if (res.ok) {
        const created = await res.json()
        setCategories([...categories, created])
        setNewCategory({ name: "", slug: "", icon: "" })
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (res.ok) {
        setCategories(categories.map(cat => 
          cat.id === id ? { ...cat, isActive: !currentStatus } : cat
        ))
      }
    } catch (error) {
      console.error("Error toggling category:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        setCategories(categories.filter(cat => cat.id !== id))
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create New */}
      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Nome"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              />
              <Input
                placeholder="Slug"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              />
              <Input
                placeholder="Ícone (emoji)"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-[#F97316] hover:bg-[#EA580C]">Salvar</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsCreating(true)} className="bg-[#F97316] hover:bg-[#EA580C]">
          + Nova Categoria
        </Button>
      )}

      {/* List */}
      <div className="grid gap-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{cat.icon || "📁"}</span>
                <div>
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-sm text-gray-500">/{cat.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {cat.isActive ? "Ativa" : "Inativa"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(cat.id, cat.isActive)}
                >
                  {cat.isActive ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(cat.id)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}