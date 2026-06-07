"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"

interface Category {
  id: string
  name: string
  slug: string
}

interface MasterTerritory {
  id: string
  city: string
  state: string
}



const initialFormData = {
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
  imageOrientation: "VERTICAL" as "VERTICAL" | "HORIZONTAL",
}

export default function CriarAnuncioPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [territories, setTerritories] = useState<MasterTerritory[]>([])
  const [error, setError] = useState("")
  const [formData, setFormData] = useState(initialFormData)
  const [showCustomCity, setShowCustomCity] = useState(false)
  const [customCity, setCustomCity] = useState("")
  const [customState, setCustomState] = useState("")
  const [savingCity, setSavingCity] = useState(false)
  const [citySaved, setCitySaved] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, terRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/territories", { cache: "no-store" })
        ])
        
        const catData = await catRes.json()
        const terData = await terRes.json()

        if (!catRes.ok) throw new Error(catData.error || "Erro ao carregar categorias")

        setCategories(
          catData
            .filter((category: { isActive?: boolean }) => category.isActive !== false)
            .map((category: Category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
            }))
        )
        
        if (terRes.ok) {
          setTerritories(terData)
        }

        if (Array.isArray(catData) && catData.length === 0) {
          setError("Nenhuma categoria ativa disponivel. Ative ao menos uma categoria no painel admin.")
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao carregar dados"
        setError(message)
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadData()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.categoryId) return "Selecione uma categoria"
      if (formData.title.trim().length < 3) return "Informe um titulo com pelo menos 3 caracteres"
      if (formData.shortDescription.trim().length < 10) {
        return "Informe uma descricao curta com pelo menos 10 caracteres"
      }
    }

    if (step === 2) {
      if (formData.fullDescription.trim().length < 20) {
        return "Informe uma descricao completa com pelo menos 20 caracteres"
      }
      if (formData.externalLink && !/^https?:\/\//i.test(formData.externalLink.trim())) {
        return "O link externo precisa comecar com http:// ou https://"
      }
    }

    if (step === 3) {
      if (formData.whatsappContact.trim().length < 10) return "Informe um WhatsApp valido"
      if (!formData.city || !formData.state) {
        if (showCustomCity) {
          if (!citySaved) return "Clique em \"Confirmar Cidade\" antes de continuar"
        } else {
          return "Selecione a sua cidade na lista"
        }
      }
    }

    return ""
  }

  const nextStep = () => {
    const validationError = validateCurrentStep()
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setStep((current) => current + 1)
  }

  const prevStep = () => {
    setError("")
    setStep((current) => current - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      nextStep()
      return
    }

    const validationError = validateCurrentStep()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          shortDescription: formData.shortDescription.trim(),
          fullDescription: formData.fullDescription.trim(),
          promotionText: formData.promotionText.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          externalLink: formData.externalLink.trim(),
          whatsappContact: formData.whatsappContact.trim(),
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const detailMessage = Array.isArray(data.details)
          ? data.details.map((item: { message: string }) => item.message).join(" | ")
          : ""

        setError(detailMessage || data.error || "Erro ao criar anuncio")
        return
      }

      setFormData(initialFormData)
      router.push(`/dashboard/anuncios/${data.id}?payment=required`)
    } catch (_err) {
      setError("Erro ao criar anuncio")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            SEXTOU.biz
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden md:block text-sm text-gray-600 hover:text-[#F97316]">
              Voltar ao Dashboard
            </Link>
            <MobileMenu links={[
              { href: "/", label: "Home" },
              { href: "/anuncios", label: "Ver Vitrine" },
              { href: "/dashboard", label: "Meu Dashboard" },
              { href: "/dashboard/configuracoes", label: "Configurações" },
              { href: "/dashboard/anunciar", label: "+ Novo Anúncio", isAction: true },
            ]} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 leading-tight">Criar Novo Anuncio</h1>
          <p className="text-sm sm:text-base text-gray-600">Passo {step} de 3</p>

          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((progressStep) => (
              <div
                key={progressStep}
                className={`h-2 flex-1 rounded-full ${
                  progressStep <= step ? "bg-[#F97316]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Informacoes do Anuncio"}
              {step === 2 && "Detalhes e Preco"}
              {step === 3 && "Contato e Localizacao"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Escolha a categoria e titulo"}
              {step === 2 && "Descreva seu produto ou servico"}
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

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="categoryId" className="text-sm font-medium">
                      Categoria
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      disabled={categoriesLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">
                        {categoriesLoading ? "Carregando categorias..." : "Selecione uma categoria"}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Titulo do Anuncio
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Ex: Pizza Italiana Artesanal"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="shortDescription" className="text-sm font-medium">
                      Descricao Curta
                    </label>
                    <Input
                      id="shortDescription"
                      name="shortDescription"
                      placeholder="Ex: Massas caseiras com ingredientes frescos"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                  </div>

                  <ImageUpload
                    images={formData.images}
                    onChange={(images) => setFormData({ ...formData, images })}
                    maxImages={5}
                  />

                  {/* Seletor de orientação */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium block">
                      Formato do Anúncio
                    </label>
                    <p className="text-xs text-gray-500">
                      Escolha o formato com base na sua imagem principal
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Vertical */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageOrientation: "VERTICAL" })}
                        className={`relative border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
                          formData.imageOrientation === "VERTICAL"
                            ? "border-[#F97316] bg-orange-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* Preview 9:16 */}
                        <div className="flex gap-2 items-start w-full">
                          <div
                            style={{ aspectRatio: "9/16", width: "36px" }}
                            className={`rounded-md flex-shrink-0 ${
                              formData.imageOrientation === "VERTICAL"
                                ? "bg-[#F97316]"
                                : "bg-gray-300"
                            }`}
                          />
                          <div className="flex flex-col gap-1 flex-1 pt-1">
                            <div className={`h-2 rounded-full ${ formData.imageOrientation === "VERTICAL" ? "bg-[#F97316]/60" : "bg-gray-200" }`} />
                            <div className={`h-1.5 rounded-full w-3/4 ${ formData.imageOrientation === "VERTICAL" ? "bg-[#F97316]/40" : "bg-gray-200" }`} />
                            <div className={`h-1.5 rounded-full w-1/2 ${ formData.imageOrientation === "VERTICAL" ? "bg-[#F97316]/40" : "bg-gray-200" }`} />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-semibold ${ formData.imageOrientation === "VERTICAL" ? "text-[#F97316]" : "text-gray-700" }`}>
                            Vertical
                          </p>
                          <p className="text-xs text-gray-500">9:16 · Stories/Reels</p>
                        </div>
                        {formData.imageOrientation === "VERTICAL" && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>

                      {/* Horizontal */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageOrientation: "HORIZONTAL" })}
                        className={`relative border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
                          formData.imageOrientation === "HORIZONTAL"
                            ? "border-[#F97316] bg-orange-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* Preview 16:9 */}
                        <div className="flex flex-col gap-2 w-full">
                          <div
                            style={{ aspectRatio: "16/9", width: "100%" }}
                            className={`rounded-md ${
                              formData.imageOrientation === "HORIZONTAL"
                                ? "bg-[#F97316]"
                                : "bg-gray-300"
                            }`}
                          />
                          <div className="flex flex-col gap-1">
                            <div className={`h-2 rounded-full ${ formData.imageOrientation === "HORIZONTAL" ? "bg-[#F97316]/60" : "bg-gray-200" }`} />
                            <div className={`h-1.5 rounded-full w-2/3 ${ formData.imageOrientation === "HORIZONTAL" ? "bg-[#F97316]/40" : "bg-gray-200" }`} />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-semibold ${ formData.imageOrientation === "HORIZONTAL" ? "text-[#F97316]" : "text-gray-700" }`}>
                            Horizontal
                          </p>
                          <p className="text-xs text-gray-500">16:9 · Paisagem</p>
                        </div>
                        {formData.imageOrientation === "HORIZONTAL" && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="fullDescription" className="text-sm font-medium">
                      Descricao Completa
                    </label>
                    <textarea
                      id="fullDescription"
                      name="fullDescription"
                      placeholder="Descreva todos os detalhes do seu produto ou servico..."
                      value={formData.fullDescription}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="offerType" className="text-sm font-medium">
                        Tipo
                      </label>
                      <select
                        id="offerType"
                        name="offerType"
                        value={formData.offerType}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="PRODUCT">Produto</option>
                        <option value="SERVICE">Servico</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="price" className="text-sm font-medium">
                        Preco (USD)
                      </label>
                      <Input
                        id="price"
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
                    <label htmlFor="promotionText" className="text-sm font-medium">
                      Texto da Promocao (opcional)
                    </label>
                    <Input
                      id="promotionText"
                      name="promotionText"
                      placeholder="Ex: Leve 2 pagues 1"
                      value={formData.promotionText}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="externalLink" className="text-sm font-medium">
                      Link Externo (opcional)
                    </label>
                    <Input
                      id="externalLink"
                      name="externalLink"
                      type="url"
                      placeholder="https://seusite.com/produto"
                      value={formData.externalLink}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="whatsappContact" className="text-sm font-medium">
                      WhatsApp para Contato
                    </label>
                    <Input
                      id="whatsappContact"
                      name="whatsappContact"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.whatsappContact}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="territorySelect" className="text-sm font-medium">
                      Sua Localização (Cidade - Estado)
                    </label>

                    {!showCustomCity ? (
                      <>
                        <select
                          id="territorySelect"
                          required
                          value={formData.city ? `${formData.city}|${formData.state}` : ""}
                          onChange={(e) => {
                            if (!e.target.value) {
                              setFormData({ ...formData, city: "", state: "" })
                              return
                            }
                            if (e.target.value === "OUTRA") {
                              setShowCustomCity(true)
                              setFormData({ ...formData, city: "", state: "" })
                              setCitySaved(false)
                              return
                            }
                            const [c, s] = e.target.value.split("|")
                            setFormData({ ...formData, city: c, state: s })
                          }}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Selecione sua cidade...</option>
                          {territories.map((t) => (
                            <option key={t.id} value={`${t.city}|${t.state}`}>
                              {t.city} - {t.state}
                            </option>
                          ))}
                          <option value="OUTRA">➕ Outra cidade (não listada)</option>
                        </select>
                        {territories.length === 0 && (
                          <p className="text-xs text-orange-500 mt-1">Carregando cidades disponíveis...</p>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3 rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-orange-700">📍 Cadastrar nova cidade</p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomCity(false)
                              setCustomCity("")
                              setCustomState("")
                              setCitySaved(false)
                              setFormData({ ...formData, city: "", state: "" })
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                          >
                            ← Voltar à lista
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Cidade</label>
                            <Input
                              id="customCity"
                              placeholder="Ex: Miami"
                              value={customCity}
                              onChange={(e) => {
                                setCustomCity(e.target.value)
                                setCitySaved(false)
                              }}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Estado (sigla)</label>
                            <Input
                              id="customState"
                              placeholder="Ex: FL"
                              value={customState}
                              maxLength={3}
                              onChange={(e) => {
                                setCustomState(e.target.value.toUpperCase())
                                setCitySaved(false)
                              }}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {citySaved ? (
                          <div className="flex items-center gap-2 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700 font-medium">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {formData.city} - {formData.state} confirmada!
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={savingCity || customCity.trim().length < 2 || customState.trim().length < 2}
                            onClick={async () => {
                              setSavingCity(true)
                              setError("")
                              try {
                                const res = await fetch("/api/territories/suggest", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    city: customCity.trim(),
                                    state: customState.trim(),
                                  }),
                                })
                                const data = await res.json()
                                if (!res.ok) throw new Error(data.error || "Erro ao salvar cidade")
                                setFormData({ ...formData, city: data.city, state: data.state })
                                setCitySaved(true)
                                // Adiciona à lista local para reutilização
                                setTerritories((prev) => {
                                  const exists = prev.some((t) => t.id === data.id)
                                  return exists ? prev : [...prev, { id: data.id, city: data.city, state: data.state }]
                                })
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Erro ao salvar cidade")
                              } finally {
                                setSavingCity(false)
                              }
                            }}
                            className="w-full rounded-lg bg-[#F97316] py-2.5 text-sm font-bold text-white transition hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {savingCity ? "Salvando..." : "Confirmar Cidade"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="deliveryType" className="text-sm font-medium">
                      Tipo de Entrega
                    </label>
                    <select
                      id="deliveryType"
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
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#F97316] hover:bg-[#EA580C]"
                  disabled={categoriesLoading && step === 1}
                >
                  Proximo
                </Button>
              ) : (
                <Button type="submit" className="bg-[#F97316] hover:bg-[#EA580C]" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar para Analise"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
