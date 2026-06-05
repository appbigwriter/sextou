"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface User {
  id: string
  fullName: string
  email: string
}

interface MasterTerritory {
  id: string
  city: string
  state: string
}

interface Territory {
  id: string
  affiliateId: string
  territoryId: string
  createdAt: string
  affiliate: User
  territory: MasterTerritory
}

export default function TerritoriosAdminPage() {
  const [territories, setTerritories] = useState<Territory[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [masterTerritories, setMasterTerritories] = useState<MasterTerritory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    affiliateId: "",
    territoryId: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [territoriesRes, usersRes, masterRes] = await Promise.all([
        fetch("/api/admin/territories"),
        fetch("/api/admin/users"),
        fetch("/api/admin/master-territories"),
      ])

      if (territoriesRes.ok && usersRes.ok && masterRes.ok) {
        const territoriesData = await territoriesRes.json()
        const usersData = await usersRes.json()
        const masterData = await masterRes.json()
        
        setTerritories(territoriesData)
        setUsers(usersData)
        // Apenas territórios ativos para o cadastro
        setMasterTerritories(masterData.filter((t: any) => t.isActive))
      }
    } catch (error) {
      console.error("Failed to fetch data", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta área geográfica deste afiliado?")) return

    try {
      const res = await fetch(`/api/admin/territories/${id}`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch("/api/admin/territories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setTerritories([data, ...territories])
        setIsModalOpen(false)
        setFormData({ affiliateId: "", territoryId: "" })
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">Territórios de Afiliados</h1>
          <p className="text-gray-600 mt-1">Gerencie quais cidades pertencem a cada afiliado.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
        >
          + Atribuir Nova Área
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b text-gray-900">
              <tr>
                <th className="px-6 py-4 font-semibold">Afiliado</th>
                <th className="px-6 py-4 font-semibold">Cidade</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Data Atribuição</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Carregando territórios...
                  </td>
                </tr>
              ) : territories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma área atribuída ainda.
                  </td>
                </tr>
              ) : (
                territories.map((territory) => (
                  <tr key={territory.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{territory.affiliate.fullName}</div>
                      <div className="text-xs text-gray-500">{territory.affiliate.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{territory.territory.city}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {territory.territory.state}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(territory.createdAt).toLocaleDateString("pt-BR")}
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Nova Atribuição Geográfica</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Afiliado</label>
                <select
                  required
                  value={formData.affiliateId}
                  onChange={(e) => setFormData({ ...formData, affiliateId: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#F97316] focus:ring-[#F97316]"
                >
                  <option value="">-- Escolha um usuário --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Cidade (Território)</label>
                <select
                  required
                  value={formData.territoryId}
                  onChange={(e) => setFormData({ ...formData, territoryId: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#F97316] focus:ring-[#F97316]"
                >
                  <option value="">-- Escolha uma cidade pré-cadastrada --</option>
                  {masterTerritories.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.city} - {t.state}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Não achou a cidade? Adicione primeiro em "Cidades de Atuação".
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg disabled:opacity-50"
                >
                  {isSaving ? "Salvando..." : "Salvar Atribuição"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
