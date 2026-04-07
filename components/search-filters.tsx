"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface SearchFiltersProps {
  categories: Category[]
}

export function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category) params.set("category", category)
    if (city) params.set("city", city)
    router.push(`/anuncios?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("")
    setCity("")
    router.push("/anuncios")
  }

  const hasFilters = search || category || city

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Buscar anúncios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="bg-[#F97316] hover:bg-[#EA580C]">
          🔍 Buscar
        </Button>
        {hasFilters && (
          <Button type="button" variant="outline" onClick={clearFilters}>
            Limpar
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        {/* City */}
        <Input
          placeholder="Cidade..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-40"
        />

        {/* Price Range */}
        <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Qualquer preço</option>
          <option value="0-30">Até $30</option>
          <option value="30-100">$30 - $100</option>
          <option value="100+">Mais de $100</option>
        </select>
      </div>
    </form>
  )
}