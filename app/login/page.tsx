"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha incorretos")
      } else {
        router.push("/dashboard")
      }
    } catch (_err) {
      setError("Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A] p-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center">
          <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-12 w-auto object-contain" />
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">Bem-vindo de Volta</CardTitle>
          <CardDescription>Entre para acessar seu dashboard e acompanhar seus anuncios</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#EA580C]"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              Depois do login, voce vai direto para o seu dashboard para ver anuncios enviados,
              acompanhar a analise e acessar novos envios.
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Nao tem conta?{" "}
              <Link href="/cadastro" className="text-[#F97316] hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
