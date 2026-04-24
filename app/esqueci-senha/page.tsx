"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [debugResetUrl, setDebugResetUrl] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setDebugResetUrl("")

    try {
      const response = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Nao foi possivel enviar o link de recuperacao.")
        return
      }

      setSuccess(data.message || "Se o email existir, enviaremos o link de recuperacao.")
      setDebugResetUrl(data.debugResetUrl || "")
    } catch (_error) {
      setError("Nao foi possivel enviar o link de recuperacao.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">Esqueci minha senha</CardTitle>
          <CardDescription>Informe seu email para receber um link de recuperacao.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}
            {debugResetUrl && (
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-medium">Link de teste:</p>
                <a href={debugResetUrl} className="break-all text-[#F97316] hover:underline">
                  {debugResetUrl}
                </a>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-[#F97316] hover:bg-[#EA580C]" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperacao"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Lembrou da senha?{" "}
              <Link href="/login" className="font-medium text-[#F97316] hover:underline">
                Voltar ao login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
