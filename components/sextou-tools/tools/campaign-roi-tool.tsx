"use client"

import { useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface CampaignRoiToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

const initialForm = {
  campaignName: "",
  channel: "google",
  investment: "0",
  leads: "0",
  sales: "0",
  averageTicket: "250",
  profitMarginPercent: "30",
}

function parseValue(value: string) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

export function CampaignRoiTool({ historyItems }: CampaignRoiToolProps) {
  const [form, setForm] = useState(initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Preencha os dados da campanha para gerar o diagnostico.")
  const [localHistory, setLocalHistory] = useState(historyItems)

  const metrics = useMemo(() => {
    const investment = parseValue(form.investment)
    const leads = parseValue(form.leads)
    const sales = parseValue(form.sales)
    const averageTicket = parseValue(form.averageTicket)
    const profitMarginPercent = Math.min(parseValue(form.profitMarginPercent), 100) / 100

    const costPerLead = leads > 0 ? investment / leads : null
    const conversionRate = leads > 0 ? (sales / leads) * 100 : null
    const revenue = sales * averageTicket
    const estimatedProfit = revenue * profitMarginPercent
    const roi = investment > 0 ? ((estimatedProfit - investment) / investment) * 100 : null
    const roas = investment > 0 ? revenue / investment : null

    let diagnosis = "Informe mais dados para avaliar a campanha."
    if (roi !== null) {
      if (roi > 0) diagnosis = "Campanha lucrativa"
      else if (roi === 0) diagnosis = "Campanha no zero a zero"
      else diagnosis = "Campanha com prejuizo"
    }

    return {
      investment,
      leads,
      sales,
      averageTicket,
      profitMarginPercent,
      costPerLead,
      conversionRate,
      revenue,
      estimatedProfit,
      roi,
      roas,
      diagnosis,
    }
  }, [form])

  const summary = useMemo(() => {
    const name = form.campaignName.trim() || "Campanha"
    return `${name} · ${metrics.roi !== null ? formatPercent(metrics.roi) : "ROI n/a"}`
  }, [form.campaignName, metrics.roi])

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function saveExecution() {
    const response = await fetch("/api/sextou-tools/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "calculadora-roi-campanha",
        input: {
          campaignName: form.campaignName,
          channel: form.channel,
          investment: metrics.investment,
          leads: metrics.leads,
          sales: metrics.sales,
          averageTicket: metrics.averageTicket,
          profitMarginPercent: metrics.profitMarginPercent * 100,
        },
        output: {
          costPerLead: metrics.costPerLead,
          conversionRate: metrics.conversionRate,
          revenue: metrics.revenue,
          estimatedProfit: metrics.estimatedProfit,
          roi: metrics.roi,
          roas: metrics.roas,
          diagnosis: metrics.diagnosis,
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
        title: "calculadora roi campanha",
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
      setStatusMessage("Diagnostico salvo no historico da sua conta.")
    } catch {
      setStatusMessage("Diagnostico gerado, mas nao foi possivel salvar no historico agora.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCopy() {
    const text = [
      `Campanha: ${form.campaignName || "Campanha"}`,
      `Canal: ${form.channel}`,
      `Investimento: ${formatUsd(metrics.investment)}`,
      `Receita: ${formatUsd(metrics.revenue)}`,
      `Lucro estimado: ${formatUsd(metrics.estimatedProfit)}`,
      `ROI: ${metrics.roi !== null ? formatPercent(metrics.roi) : "n/a"}`,
      `ROAS: ${metrics.roas !== null ? metrics.roas.toFixed(2) : "n/a"}`,
      `Diagnostico: ${metrics.diagnosis}`,
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
            <label className={labelClass}>Nome da campanha</label>
            <input
              className={fieldClass}
              value={form.campaignName}
              onChange={(event) => updateField("campaignName", event.target.value)}
              placeholder="Ex.: Google Ads Orlando"
            />
          </div>

          <div>
            <label className={labelClass}>Canal</label>
            <select className={fieldClass} value={form.channel} onChange={(e) => updateField("channel", e.target.value)}>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="revista">Revista</option>
              <option value="evento">Evento</option>
              <option value="radio">Radio</option>
              <option value="indicacao">Indicacao</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Investimento total</label>
            <input className={fieldClass} value={form.investment} onChange={(e) => updateField("investment", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Leads gerados</label>
            <input className={fieldClass} value={form.leads} onChange={(e) => updateField("leads", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Vendas fechadas</label>
            <input className={fieldClass} value={form.sales} onChange={(e) => updateField("sales", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Ticket medio</label>
            <input className={fieldClass} value={form.averageTicket} onChange={(e) => updateField("averageTicket", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Margem de lucro estimada %</label>
            <input className={fieldClass} value={form.profitMarginPercent} onChange={(e) => updateField("profitMarginPercent", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={isSaving}
            className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Calcular ROI"}
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
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Diagnostico</p>
          <div className="mt-4 rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[#FF3D57]">Veredito</p>
            <p className="mt-2 font-toolkit text-3xl font-extrabold text-white">{metrics.diagnosis}</p>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Metricas principais</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Custo por lead</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{metrics.costPerLead !== null ? formatUsd(metrics.costPerLead) : "n/a"}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Taxa de conversao</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{metrics.conversionRate !== null ? formatPercent(metrics.conversionRate) : "n/a"}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Receita</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(metrics.revenue)}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Lucro estimado</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(metrics.estimatedProfit)}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">ROI</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{metrics.roi !== null ? formatPercent(metrics.roi) : "n/a"}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">ROAS</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{metrics.roas !== null ? metrics.roas.toFixed(2) : "n/a"}</p></div>
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
