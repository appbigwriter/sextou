"use client"

import { useState } from "react"

type PlanSlug = "starter" | "pro" | "agency"

interface PagamentoStripeProps {
  /** Plano premium a ser assinado. */
  planSlug: PlanSlug
  /** Texto do botao (opcional). Padrao: "Assinar plano". */
  label?: string
  /**
   * Caminho relativo de retorno apos pagamento bem-sucedido (opcional).
   * Repassado a rota de checkout como `success_url`. Pode incluir o token
   * `{CHECKOUT_SESSION_ID}` que a Stripe substitui automaticamente.
   */
  returnTo?: string
  /** Classe CSS adicional para o botao (opcional). */
  className?: string
}

/**
 * Ponto unico de pagamento Premium da suite SextouTools PRO.
 *
 * Componente reutilizavel por QUALQUER app Premium: inicia uma Stripe
 * Checkout Session do tipo `subscription` (hosted checkout) e redireciona
 * o navegador para a pagina hospedada pela Stripe, onde o cliente preenche
 * os dados de cartao. Nenhum dado de cartao trafega pelo dominio proprio.
 *
 * O componente e "burro" quanto ao gate: ele apenas inicia o checkout. A
 * liberacao de acesso continua sendo decidida pelo helper central
 * `resolveSextouToolsProUser` apos o webhook ativar `is_premium`.
 *
 * Espelha o padrao de `components/payment-options.tsx` (loading/erro +
 * `window.location.href = data.url`).
 */
export function PagamentoStripe({
  planSlug,
  label = "Assinar plano",
  returnTo,
  className,
}: PagamentoStripeProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCheckout = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/stripe/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          returnTo: returnTo || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        setError(data.error || "Nao foi possivel iniciar a assinatura.")
        return
      }

      window.location.href = data.url
    } catch (_error) {
      setError("Nao foi possivel iniciar a assinatura.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={
          className ||
          "w-full rounded-lg bg-[#F97316] px-4 py-3 font-semibold text-white hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {loading ? "Redirecionando..." : label}
      </button>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}

export default PagamentoStripe
