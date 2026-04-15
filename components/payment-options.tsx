"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface PaymentOptionsProps {
  adId: string
  amount: number
}

export function PaymentOptions({ adId, amount }: PaymentOptionsProps) {
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [zelleCode, setZelleCode] = useState("")
  const [error, setError] = useState("")
  const [loadingMethod, setLoadingMethod] = useState<"card" | "zelle" | "">("")

  const handleCardCheckout = async () => {
    setLoadingMethod("card")
    setError("")

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId,
          couponCode: couponCode.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Nao foi possivel iniciar o pagamento com cartao.")
        return
      }

      window.location.href = data.url
    } catch (_error) {
      setError("Nao foi possivel iniciar o pagamento com cartao.")
    } finally {
      setLoadingMethod("")
    }
  }

  const handleZelleSubmit = async () => {
    setLoadingMethod("zelle")
    setError("")

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId,
          paymentMethod: "ZELLE",
          transactionId: zelleCode.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Nao foi possivel registrar o codigo Zelle.")
        return
      }

      router.push(`/dashboard/anuncios/${adId}?payment=zelle_submitted`)
      router.refresh()
    } catch (_error) {
      setError("Nao foi possivel registrar o codigo Zelle.")
    } finally {
      setLoadingMethod("")
    }
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
      <h2 className="text-xl font-bold text-gray-900">Pagamento necessario para prosseguir</h2>
      <p className="mt-2 text-sm text-gray-700">
        Seu anuncio foi salvo. Agora escolha como deseja pagar os <strong>US${amount.toFixed(2)}</strong> para
        enviar o anuncio para analise do admin.
      </p>

      <div className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-gray-700" htmlFor="couponCode">
          Cupom de desconto
        </label>
        <input
          id="couponCode"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
          placeholder="Opcional"
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">Cartao de credito</h3>
          <p className="mt-2 text-sm text-gray-600">
            Pague agora com seguranca e siga automaticamente para analise assim que o pagamento for confirmado.
          </p>
          <button
            type="button"
            onClick={handleCardCheckout}
            disabled={loadingMethod !== ""}
            className="mt-4 w-full rounded-lg bg-[#F97316] px-4 py-3 font-semibold text-white hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMethod === "card" ? "Redirecionando..." : "Pagar com cartao"}
          </button>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">Zelle</h3>
          <p className="mt-2 text-sm text-gray-600">
            Envie o pagamento para <strong>pagamento@sextadoempreendedor.com</strong> e informe abaixo o codigo da
            transacao para o admin confirmar.
          </p>
          <input
            value={zelleCode}
            onChange={(event) => setZelleCode(event.target.value)}
            placeholder="Codigo ou comprovante Zelle"
            className="mt-4 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
          />
          <button
            type="button"
            onClick={handleZelleSubmit}
            disabled={loadingMethod !== "" || zelleCode.trim().length < 4}
            className="mt-4 w-full rounded-lg border border-[#F97316] px-4 py-3 font-semibold text-[#F97316] hover:bg-[#F97316]/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMethod === "zelle" ? "Enviando codigo..." : "Informar codigo Zelle"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}
