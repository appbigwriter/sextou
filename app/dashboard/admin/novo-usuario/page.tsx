"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { PhoneInput } from "@/components/phone-input"

export default function NovoUsuarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    whatsapp: "",
    city: "",
    state: "",
    isAdmin: false,
    isVip: false,
    hasActiveAds: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao criar usuario")
        return
      }

      router.push("/dashboard/admin/usuarios")
    } catch {
      setError("Erro ao criar usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <LogoutButton />
            <Link href="/dashboard/admin/usuarios" className="text-sm text-gray-600 hover:text-[#F97316]">
              Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-heading font-bold text-gray-900">
          Novo Usuario
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-lg border px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full rounded-lg border px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Senha *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                WhatsApp
                <span className="ml-2 text-xs font-normal text-gray-500">(inclua o codigo do pais)</span>
              </label>
              <PhoneInput
                value={form.whatsapp}
                onChange={(val) => setForm({ ...form, whatsapp: val })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Cidade
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Estado
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-lg border px-4 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAdmin}
                onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">E administrador</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isVip}
                onChange={(e) => setForm({ ...form, isVip: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">E VIP</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.hasActiveAds}
                onChange={(e) => setForm({ ...form, hasActiveAds: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Tem anuncios ativos / PRO liberado</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#F97316] px-6 py-2 text-sm font-medium text-white hover:bg-[#EA580C] disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar Usuario"}
            </button>
            <Link
              href="/dashboard/admin/usuarios"
              className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
