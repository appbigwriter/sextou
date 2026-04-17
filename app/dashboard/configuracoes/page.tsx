"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const formData = new FormData(e.currentTarget)
    const data = {
      whatsapp: formData.get("whatsapp"),
      instagram: formData.get("instagram"),
      website: formData.get("website"),
      city: formData.get("city"),
      state: formData.get("state"),
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })
      } else {
        setMessage({ type: "error", text: "Erro ao atualizar perfil" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao atualizar perfil" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            SEXTOU.biz
          </a>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-600 hover:text-[#F97316]">Dashboard</a>
            <a href="/dashboard/perfil" className="text-gray-600 hover:text-[#F97316]">Perfil</a>
            <a href="/dashboard/configuracoes" className="text-[#F97316] font-medium">Configurações</a>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {/* Atualizar Perfil */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Atualizar Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input name="whatsapp" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instagram</label>
                  <Input name="instagram" placeholder="@seuinstagram" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input name="website" placeholder="https://seusite.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cidade</label>
                  <Input name="city" placeholder="Miami" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Input name="state" placeholder="FL" />
                </div>
              </div>
              <Button type="submit" className="bg-[#F97316] hover:bg-[#EA580C]" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha Atual</label>
                <Input type="password" name="currentPassword" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nova Senha</label>
                <Input type="password" name="newPassword" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Nova Senha</label>
                <Input type="password" name="confirmPassword" />
              </div>
              <Button type="submit" className="bg-[#F97316] hover:bg-[#EA580C]">
                Alterar Senha
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Sair da conta</p>
                <p className="text-sm text-gray-500">Você será desconectado do sistema</p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}