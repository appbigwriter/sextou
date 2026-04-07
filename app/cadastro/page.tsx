"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CadastroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    businessName: "",
    whatsapp: "",
    city: "",
    state: "",
    instagram: "",
    website: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      let data: any = {}
      try {
        data = await res.json()
      } catch {
        // resposta não é JSON (ex: Next.js error page)
        setError(`Servidor retornou ${res.status} - resposta não é JSON`)
        return
      }

      if (!res.ok) {
        // Mostrar erro real do servidor para diagnóstico
        const msg = data.detail
          ? `${data.error} | Detalhe: ${data.detail} | Código: ${data.code}`
          : data.error || `Erro ${res.status}`
        setError(msg)
        return
      }

      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError("Conta criada, mas erro ao entrar: " + signInResult.error)
        return
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError("Erro de conexão: " + (err?.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A] p-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">Crie sua Conta</CardTitle>
          <CardDescription>Comece a publicar seus anúncios hoje</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">Nome Completo</label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="João Silva"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="businessName" className="text-sm font-medium">Nome da Empresa</label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Silva Empreendimentos"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.whatsapp}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">Cidade</label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Miami"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">Estado</label>
                <Input
                  id="state"
                  name="state"
                  placeholder="FL"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="instagram" className="text-sm font-medium">Instagram (opcional)</label>
                <Input
                  id="instagram"
                  name="instagram"
                  placeholder="@seuinstagram"
                  value={formData.instagram}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">Website (opcional)</label>
                <Input
                  id="website"
                  name="website"
                  placeholder="https://seusite.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#F97316] hover:bg-[#EA580C]"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Já tem conta?{" "}
              <Link href="/login" className="text-[#F97316] hover:underline font-medium">
                Entre
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
