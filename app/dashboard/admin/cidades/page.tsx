"use client"

import { useState, useEffect } from "react"

interface MasterTerritory {
  id: string
  city: string
  state: string
  country: string
  isActive: boolean
  createdAt: string
}

export default function CidadesAdminPage() {
  const [territories, setTerritories] = useState<MasterTerritory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/master-territories")
      if (res.ok) {
        const data = await res.json()
        setTerritories(data)
      }
    } catch (error) {
      console.error("Failed to fetch data", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta cidade? Isso pode afetar anunciantes e afiliados nela.")) return

    try {
      const res = await fetch(`/api/admin/master-territories/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setTerritories(territories.filter((t) => t.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || "Erro ao deletar")
      }
    } catch (error) {
      alert("Erro de conexão ao tentar deletar")
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/master-territories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (res.ok) {
        setTerritories(territories.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t))
      } else {
        alert("Erro ao alterar status")
      }
    } catch (error) {
      alert("Erro de conexão ao tentar alterar")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch("/api/admin/master-territories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        // Ordena a nova lista localmente para manter UX
        const newList = [data, ...territories].sort((a, b) => a.state.localeCompare(b.state) || a.city.localeCompare(b.city))
        setTerritories(newList)
        setFormData({ city: "", state: "", country: "" })
      } else {
        alert(data.error || "Erro ao salvar")
      }
    } catch (error) {
      alert("Erro ao tentar salvar")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900">Cidades de Atuação</h1>
        <p className="text-gray-600 mt-1">Cadastre as cidades onde a plataforma atua e possui afiliados.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Adicionar Cidade</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Orlando"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#F97316] focus:ring-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado (Sigla ou Nome)</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: FL ou Florida"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#F97316] focus:ring-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: United States"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#F97316] focus:ring-[#F97316]"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg disabled:opacity-50"
              >
                {isSaving ? "Adicionando..." : "Adicionar Cidade"}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b text-gray-900">
                  <tr>
                    <th className="px-6 py-4 font-semibold">País</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                    <th className="px-6 py-4 font-semibold">Cidade</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Carregando cidades...
                      </td>
                    </tr>
                  ) : territories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Nenhuma cidade cadastrada ainda.
                      </td>
                    </tr>
                  ) : (
                    territories.map((territory) => (
                      <tr key={territory.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{territory.country}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{territory.state}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{territory.city}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(territory.id, territory.isActive)}
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              territory.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {territory.isActive ? "Ativo" : "Inativo"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(territory.id)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
