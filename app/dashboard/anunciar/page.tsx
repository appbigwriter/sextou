"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"

const categories = [
  { id: "1", name: "Alimentação", slug: "alimentacao" },
  { id: "2", name: "Beleza e Cosméticos", slug: "beleza" },
  { id: "3", name: "Moda e Acessórios", slug: "moda" },
  { id: "4", name: "Serviços Profissionais", slug: "servicos" },
  { id: "5", name: "Saúde e Bem-estar", slug: "saude" },
  { id: "6", name: "Educação e Cursos", slug: "educacao" },
  { id: "7", name: "Automotivo", slug: "automotivo" },
  { id: "8", name: "Casa e Decoração", slug: "casa" },
  { id: "9", name: "Tecnologia", slug: "tecnologia" },
  { id: "10", name: "Outros", slug: "outros" },
]

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

export default function CriarAnuncioPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    shortDescription: "",
    fullDescription: "",
    offerType: "PRODUCT",
    price: "",
    promotionText: "",
    city: "",
    state: "",
    deliveryType: "LOCAL",
    externalLink: "",
    whatsappContact: "",
    images: [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao criar anúncio")
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError("Erro ao criar anúncio")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            Sexta do Empreendedor
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-[#F97316]">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900">Criar Novo Anúncio</h1>
          <p className="text-gray-600">Passo {step} de 3</p>
          
          {/* Progress */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? "bg-[#F97316]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Informações do Anúncio"}
              {step === 2 && "Detalhes e Preço"}
              {step === 3 && "Contato e Localização"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Escolha a categoria e título"}
              {step === 2 && "Descreva seu produto ou serviço"}
              {step === 3 && "Informe como os clientes podem entrar em contato"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <ImageUpload
                    images={formData.images}
                    onChange={(images) => setFormData({ ...formData, images })}
                    maxImages={5}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título do Anúncio</label>
                    <Input
                      name="title"
                      placeholder="Ex: Pizza Italiana Artesanal"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição Curta</label>
                    <Input
                      name="shortDescription"
                      placeholder="Ex: Massas caseiras com ingredientes frescos"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição Completa</label>
                    <textarea
                      name="fullDescription"
                      placeholder="Descreva todos os detalhes do seu produto ou serviço..."
                      value={formData.fullDescription}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo</label>
                      <select
                        name="offerType"
                        value={formData.offerType}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="PRODUCT">Produto</option>
                        <option value="SERVICE">Serviço</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preço (USD)</label>
                      <Input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 29.99"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Texto da Promoção (opcional)</label>
                    <Input
                      name="promotionText"
                      placeholder="Ex: Leve 2 pagues 1"
                      value={formData.promotionText}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Link Externo (opcional)</label>
                    <Input
                      name="externalLink"
                      type="url"
                      placeholder="https://seusite.com/produto"
                      value={formData.externalLink}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">WhatsApp para Contato</label>
                    <Input
                      name="whatsappContact"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.whatsappContact}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cidade</label>
                      <Input
                        name="city"
                        placeholder="Miami"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estado</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Selecione</option>
                        {states.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Entrega</label>
                    <select
                      name="deliveryType"
                      value={formData.deliveryType}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="LOCAL">Entrega Local</option>
                      <option value="ONLINE">Online</option>
                      <option value="BOTH">Ambos</option>
                    </select>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="bg-[#F97316] hover:bg-[#EA580C]">
                  Próximo
                </Button>
              ) : (
                <Button type="submit" className="bg-[#F97316] hover:bg-[#EA580C]" disabled={loading}>
                  {loading ? "Criando..." : "Criar Anúncio"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
