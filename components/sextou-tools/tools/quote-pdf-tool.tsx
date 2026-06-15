"use client"

import { useEffect, useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface QuotePdfToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

interface LeadOption {
  id: string
  name: string
  companyName?: string | null
  email?: string | null
  phone?: string | null
}

interface QuoteRecord {
  id: string
  quoteNumber: string
  title: string
  clientName: string
  total: number
  status: string
  createdAt: string
}

const initialForm = {
  leadId: "",
  title: "Orcamento de servico",
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  clientPhone: "",
  issueDate: new Date().toISOString().slice(0, 10),
  validUntil: "",
  taxPercent: "0",
  discountAmount: "0",
  notes: "",
}

const initialItem = { description: "", quantity: "1", unitPrice: "0" }

function parseNumber(value: string) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function QuotePdfTool({ historyItems }: QuotePdfToolProps) {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([initialItem])
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [quotes, setQuotes] = useState<QuoteRecord[]>([])
  const [localHistory, setLocalHistory] = useState(historyItems)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Monte o orcamento e gere o PDF profissional.")

  useEffect(() => {
    async function loadData() {
      const [leadsResponse, quotesResponse] = await Promise.all([
        fetch("/api/sextou-tools/leads"),
        fetch("/api/sextou-tools/quotes"),
      ])

      if (leadsResponse.ok) {
        const data = await leadsResponse.json()
        setLeads(data.leads ?? [])
      }

      if (quotesResponse.ok) {
        const data = await quotesResponse.json()
        setQuotes(data.quotes ?? [])
      }
    }

    void loadData()
  }, [])

  const totals = useMemo(() => {
    const normalizedItems = items.map((item) => {
      const quantity = parseNumber(item.quantity)
      const unitPrice = parseNumber(item.unitPrice)
      return {
        description: item.description.trim() || "Item",
        quantity,
        unitPrice,
        total: quantity * unitPrice,
      }
    })

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0)
    const taxPercent = parseNumber(form.taxPercent)
    const taxAmount = subtotal * (taxPercent / 100)
    const discountAmount = parseNumber(form.discountAmount)
    const total = Math.max(subtotal + taxAmount - discountAmount, 0)

    return {
      normalizedItems,
      subtotal,
      taxPercent,
      taxAmount,
      discountAmount,
      total,
    }
  }, [form.discountAmount, form.taxPercent, items])

  const summary = useMemo(() => {
    return `${form.clientName || "Cliente"} · ${formatUsd(totals.total)}`
  }, [form.clientName, totals.total])

  function updateForm(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateItem(index: number, field: keyof typeof initialItem, value: string) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)))
  }

  function addItem() {
    setItems((current) => [...current, initialItem])
  }

  function removeItem(index: number) {
    setItems((current) => (current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : current))
  }

  function handleLeadChange(leadId: string) {
    updateForm("leadId", leadId)
    const lead = leads.find((entry) => entry.id === leadId)

    if (!lead) {
      return
    }

    setForm((current) => ({
      ...current,
      leadId,
      clientName: lead.name || current.clientName,
      clientCompany: lead.companyName || current.clientCompany,
      clientEmail: lead.email || current.clientEmail,
      clientPhone: lead.phone || current.clientPhone,
    }))
  }

  async function saveExecution() {
    const quoteResponse = await fetch("/api/sextou-tools/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        leadId: form.leadId || null,
        validUntil: form.validUntil || null,
        taxPercent: totals.taxPercent,
        discountAmount: totals.discountAmount,
        lineItems: totals.normalizedItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }),
    })

    if (!quoteResponse.ok) {
      throw new Error("quote-save-failed")
    }

    const quoteData = await quoteResponse.json()

    await fetch("/api/sextou-tools/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "gerador-orcamento-pdf",
        input: {
          title: form.title,
          clientName: form.clientName,
          totalItems: totals.normalizedItems.length,
        },
        output: {
          quoteId: quoteData.quote.id,
          quoteNumber: quoteData.quote.quoteNumber,
          total: totals.total,
        },
        metadata: {
          summary,
        },
      }),
    })

    setQuotes((current) => [quoteData.quote, ...current].slice(0, 12))
    setLocalHistory((current) => [
      {
        title: "gerador orcamento pdf",
        subtitle: summary,
        timestamp: new Date().toLocaleString("pt-BR"),
      },
      ...current,
    ].slice(0, 8))

    window.open(`/api/sextou-tools/quotes/${quoteData.quote.id}/pdf`, "_blank")
  }

  async function handleGenerate() {
    setIsSaving(true)
    try {
      await saveExecution()
      setStatusMessage("Orcamento salvo e PDF aberto em nova aba.")
    } catch {
      setStatusMessage("Nao foi possivel gerar o orcamento agora.")
    } finally {
      setIsSaving(false)
    }
  }

  function clearForm() {
    setForm(initialForm)
    setItems([initialItem])
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
            <label className={labelClass}>Lead vinculado</label>
            <select className={fieldClass} value={form.leadId} onChange={(event) => handleLeadChange(event.target.value)}>
              <option value="">Sem lead vinculado</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Titulo do orcamento</label>
            <input className={fieldClass} value={form.title} onChange={(event) => updateForm("title", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Nome do cliente</label>
            <input className={fieldClass} value={form.clientName} onChange={(event) => updateForm("clientName", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Empresa</label>
            <input className={fieldClass} value={form.clientCompany} onChange={(event) => updateForm("clientCompany", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input className={fieldClass} value={form.clientEmail} onChange={(event) => updateForm("clientEmail", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Telefone</label>
            <input className={fieldClass} value={form.clientPhone} onChange={(event) => updateForm("clientPhone", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Data de emissao</label>
            <input type="date" className={fieldClass} value={form.issueDate} onChange={(event) => updateForm("issueDate", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Valido ate</label>
            <input type="date" className={fieldClass} value={form.validUntil} onChange={(event) => updateForm("validUntil", event.target.value)} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Itens</p>
            <button type="button" onClick={addItem} className="text-sm font-semibold text-[#F0EDE6]">
              Adicionar item
            </button>
          </div>
          {items.map((item, index) => (
            <div key={`${index}-${item.description}`} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1.5fr_0.6fr_0.8fr_auto]">
              <input className={fieldClass} value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} placeholder="Descricao" />
              <input className={fieldClass} value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} placeholder="Qtd" />
              <input className={fieldClass} value={item.unitPrice} onChange={(event) => updateItem(index, "unitPrice", event.target.value)} placeholder="Unitario" />
              <button type="button" onClick={() => removeItem(index)} className="h-12 rounded-2xl border border-white/10 px-4 text-sm text-[#A09D97]">
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Imposto %</label>
            <input className={fieldClass} value={form.taxPercent} onChange={(event) => updateForm("taxPercent", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Desconto</label>
            <input className={fieldClass} value={form.discountAmount} onChange={(event) => updateForm("discountAmount", event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Observacoes</label>
            <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleGenerate} disabled={isSaving} className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isSaving ? "Gerando..." : "Gerar PDF"}
          </button>
          <button type="button" onClick={clearForm} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6]">
            Limpar
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">{statusMessage}</p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Resumo</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Subtotal</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(totals.subtotal)}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Imposto</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(totals.taxAmount)}</p></div>
            <div className="rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#FF3D57]">Total</p><p className="mt-2 font-toolkit text-4xl font-extrabold text-white">{formatUsd(totals.total)}</p></div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Orcamentos recentes</p>
          <div className="mt-4 space-y-3">
            {quotes.length === 0 ? (
              <p className="text-sm text-[#A09D97]">Nenhum orcamento salvo ainda.</p>
            ) : (
              quotes.map((quote) => (
                <div key={quote.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-[#F0EDE6]">{quote.quoteNumber}</p>
                  <p className="text-sm text-[#A09D97]">{quote.clientName} · {formatUsd(quote.total)}</p>
                  <button type="button" onClick={() => window.open(`/api/sextou-tools/quotes/${quote.id}/pdf`, "_blank")} className="mt-3 text-sm font-semibold text-[#FF8C00]">
                    Baixar PDF
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Historico recente</p>
          <div className="mt-4">
            <HistoryList items={localHistory} />
          </div>
        </div>
      </aside>
    </div>
  )
}
