"use client"

import { useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface ServicePriceToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

const initialForm = {
  serviceName: "",
  materialCost: "0",
  otherExpenses: "0",
  estimatedHours: "1",
  hourlyRate: "75",
  travelCost: "0",
  cardFeePercent: "3.5",
  commissionPercent: "0",
  taxPercent: "0",
  desiredMarginPercent: "25",
}

function parseCurrency(value: string) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0
}

function parsePercent(value: string) {
  const parsed = Number(value.replace(",", "."))
  if (!Number.isFinite(parsed)) return 0
  return Math.min(Math.max(parsed, 0), 90)
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function ServicePriceTool({ historyItems }: ServicePriceToolProps) {
  const [form, setForm] = useState(initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Preencha os custos e gere um preco sugerido.")
  const [localHistory, setLocalHistory] = useState(historyItems)

  const values = useMemo(() => {
    const materialCost = parseCurrency(form.materialCost)
    const otherExpenses = parseCurrency(form.otherExpenses)
    const estimatedHours = parseCurrency(form.estimatedHours)
    const hourlyRate = parseCurrency(form.hourlyRate)
    const travelCost = parseCurrency(form.travelCost)
    const cardFeePercent = parsePercent(form.cardFeePercent) / 100
    const commissionPercent = parsePercent(form.commissionPercent) / 100
    const taxPercent = parsePercent(form.taxPercent) / 100
    const desiredMarginPercent = parsePercent(form.desiredMarginPercent) / 100

    const laborCost = estimatedHours * hourlyRate
    const costBase = materialCost + otherExpenses + travelCost + laborCost
    const marginProtected = 1 - desiredMarginPercent
    const priceBeforeFees = marginProtected > 0 ? costBase / marginProtected : costBase
    const combinedFees = cardFeePercent + commissionPercent + taxPercent
    const feeProtected = 1 - combinedFees
    const finalPrice = feeProtected > 0 ? priceBeforeFees / feeProtected : priceBeforeFees
    const estimatedFees = finalPrice - priceBeforeFees
    const grossProfit = Math.max(finalPrice - costBase - estimatedFees, 0)

    return {
      materialCost,
      otherExpenses,
      estimatedHours,
      hourlyRate,
      travelCost,
      cardFeePercent,
      commissionPercent,
      taxPercent,
      desiredMarginPercent,
      laborCost,
      costBase,
      priceBeforeFees,
      finalPrice,
      estimatedFees,
      grossProfit,
    }
  }, [form])

  const summary = useMemo(() => {
    const name = form.serviceName.trim() || "Servico"
    return `${name} · ${formatUsd(values.finalPrice)}`
  }, [form.serviceName, values.finalPrice])

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function saveExecution() {
    const response = await fetch("/api/sextou-tools/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "calculadora-preco-servico",
        input: {
          serviceName: form.serviceName,
          materialCost: values.materialCost,
          otherExpenses: values.otherExpenses,
          estimatedHours: values.estimatedHours,
          hourlyRate: values.hourlyRate,
          travelCost: values.travelCost,
          cardFeePercent: values.cardFeePercent * 100,
          commissionPercent: values.commissionPercent * 100,
          taxPercent: values.taxPercent * 100,
          desiredMarginPercent: values.desiredMarginPercent * 100,
        },
        output: {
          laborCost: values.laborCost,
          costBase: values.costBase,
          priceBeforeFees: values.priceBeforeFees,
          finalPrice: values.finalPrice,
          estimatedFees: values.estimatedFees,
          grossProfit: values.grossProfit,
        },
        metadata: {
          summary,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("save-failed")
    }

    setLocalHistory((current) => [
      {
        title: "calculadora preco servico",
        subtitle: summary,
        timestamp: new Date().toLocaleString("pt-BR"),
      },
      ...current,
    ].slice(0, 8))
  }

  async function handleCalculate() {
    setIsSaving(true)
    try {
      await saveExecution()
      setStatusMessage("Calculo salvo no historico da sua conta.")
    } catch {
      setStatusMessage("Calculo atualizado, mas nao foi possivel salvar no historico agora.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCopy() {
    const text = [
      `Servico: ${form.serviceName || "Servico"}`,
      `Custo base: ${formatUsd(values.costBase)}`,
      `Preco antes das taxas: ${formatUsd(values.priceBeforeFees)}`,
      `Preco ideal sugerido: ${formatUsd(values.finalPrice)}`,
      `Taxas estimadas: ${formatUsd(values.estimatedFees)}`,
      `Lucro bruto: ${formatUsd(values.grossProfit)}`,
    ].join("\n")

    await navigator.clipboard.writeText(text)
    setStatusMessage("Resumo copiado para a area de transferencia.")
  }

  function handleClear() {
    setForm(initialForm)
    setStatusMessage("Formulario limpo.")
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Nome do servico</label>
            <input
              className={fieldClass}
              value={form.serviceName}
              onChange={(event) => updateField("serviceName", event.target.value)}
              placeholder="Ex.: Limpeza pos-obra"
            />
          </div>

          <div>
            <label className={labelClass}>Custo de material</label>
            <input className={fieldClass} value={form.materialCost} onChange={(e) => updateField("materialCost", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Outras despesas</label>
            <input className={fieldClass} value={form.otherExpenses} onChange={(e) => updateField("otherExpenses", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Horas estimadas</label>
            <input className={fieldClass} value={form.estimatedHours} onChange={(e) => updateField("estimatedHours", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Valor da hora</label>
            <input className={fieldClass} value={form.hourlyRate} onChange={(e) => updateField("hourlyRate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Deslocamento</label>
            <input className={fieldClass} value={form.travelCost} onChange={(e) => updateField("travelCost", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Taxa de cartao %</label>
            <input className={fieldClass} value={form.cardFeePercent} onChange={(e) => updateField("cardFeePercent", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Comissao %</label>
            <input className={fieldClass} value={form.commissionPercent} onChange={(e) => updateField("commissionPercent", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Imposto estimado %</label>
            <input className={fieldClass} value={form.taxPercent} onChange={(e) => updateField("taxPercent", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Margem de lucro desejada %</label>
            <input className={fieldClass} value={form.desiredMarginPercent} onChange={(e) => updateField("desiredMarginPercent", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={isSaving}
            className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Calcular preco"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
          >
            Copiar resumo
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6]"
          >
            Limpar
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">
          {statusMessage}
        </p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Resultado financeiro</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Custo base</p>
              <p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(values.costBase)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Preco antes das taxas</p>
              <p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(values.priceBeforeFees)}</p>
            </div>
            <div className="rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#FF3D57]">Preco ideal sugerido</p>
              <p className="mt-2 font-toolkit text-4xl font-extrabold text-white">{formatUsd(values.finalPrice)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Memoria de calculo</p>
          <div className="mt-4 space-y-3 text-sm text-[#A09D97]">
            <div className="flex justify-between gap-4"><span>Material + extras + deslocamento</span><span>{formatUsd(values.materialCost + values.otherExpenses + values.travelCost)}</span></div>
            <div className="flex justify-between gap-4"><span>Trabalho ({values.estimatedHours}h x {formatUsd(values.hourlyRate)})</span><span>{formatUsd(values.laborCost)}</span></div>
            <div className="flex justify-between gap-4"><span>Taxas estimadas</span><span>{formatUsd(values.estimatedFees)}</span></div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3"><span>Lucro bruto estimado</span><span>{formatUsd(values.grossProfit)}</span></div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Historico recente</p>
          <div className="mt-4">
            <HistoryList items={localHistory} />
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6 text-sm leading-7 text-[#A09D97]">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Aviso</p>
          <p className="mt-4">
            Esta ferramenta e educativa e nao substitui contador, advogado ou consultor licenciado.
          </p>
        </div>
      </aside>
    </div>
  )
}
