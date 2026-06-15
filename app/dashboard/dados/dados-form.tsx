"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type UserData = {
  fullName: string
  businessName: string
  email: string
  whatsapp: string
  instagram: string | null
  website: string | null
  city: string
  state: string
  country: string
  zelleCode: string | null
}

export function DadosForm({ user }: { user: UserData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const formData = new FormData(e.currentTarget)
    const data = {
      fullName: formData.get("fullName"),
      businessName: formData.get("businessName"),
      whatsapp: formData.get("whatsapp"),
      instagram: formData.get("instagram"),
      website: formData.get("website"),
      city: formData.get("city"),
      state: formData.get("state"),
      country: formData.get("country"),
      zelleCode: formData.get("zelleCode"),
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao salvar os dados")
      }

      setMessage({ type: "success", text: "Dados atualizados com sucesso!" })
      router.refresh()
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    setResetLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const res = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao enviar link de redefinição")
      }

      setMessage({ type: "success", text: "Link de redefinição enviado para o seu email!" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input name="fullName" defaultValue={user.fullName} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Negócio</label>
            <input name="businessName" defaultValue={user.businessName} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input name="whatsapp" defaultValue={user.whatsapp} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (opcional)</label>
            <input name="instagram" defaultValue={user.instagram || ""} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website (opcional)</label>
            <input name="website" defaultValue={user.website || ""} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input disabled defaultValue={user.email} className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none" />
          </div>
        </div>

        <div className="border-t pt-6 grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input name="city" defaultValue={user.city} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input name="state" defaultValue={user.state} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input name="country" defaultValue={user.country} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Pagamento</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código Zelle</label>
            <input name="zelleCode" defaultValue={user.zelleCode || ""} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none" placeholder="Email ou Telefone Zelle" />
            <p className="text-sm text-gray-500 mt-1">Informe seu código Zelle para receber as comissões de seus afiliados.</p>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-wrap gap-4 items-center justify-between">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {resetLoading ? "Enviando..." : "Redefinir Senha"}
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  )
}
