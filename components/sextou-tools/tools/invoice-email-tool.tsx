"use client"

import { useEffect, useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface InvoiceEmailToolProps {
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

interface QuoteOption {
  id: string
  quoteNumber: string
  clientName: string
  clientEmail?: string | null
  total: number
}

interface InvoiceRecord {
  id: string
  invoiceNumber: string
  title: string
  clientName: string
  clientEmail?: string | null
  total: number
  status: string
}

const initialForm = {
  leadId: "",
  quoteId: "",
  title: "Invoice de servico",
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  clientPhone: "",
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  taxPercent: "0",
  discountAmount: "0",
  emailSubject: "",
  emailMessage: "",
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

export function InvoiceEmailTool({ historyItems }: InvoiceEmailToolProps) {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([initialItem])
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [quotes, setQuotes] = useState<QuoteOption[]>([])
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [localHistory, setLocalHistory] = useState(historyItems)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Crie a invoice, baixe o PDF e envie por e-mail.")

  useEffect(() => {
    async function loadData() {
      const [leadsResponse, quotesResponse, invoicesResponse] = await Promise.all([
        fetch("/api/sextou-tools/leads"),
        fetch("/api/sextou-tools/quotes"),
        fetch("/api/sextou-tools/invoices"),
      ])

      if (leadsResponse.ok) {
        const data = await leadsResponse.json()
        setLeads(data.leads ?? [])
      }

      if (quotesResponse.ok) {
        const data = await quotesResponse.json()
        setQuotes(data.quotes ?? [])
      }

      if (invoicesResponse.ok) {
        const data = await invoicesResponse.json()
        setInvoices(data.invoices ?? [])
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

    return { normalizedItems, subtotal, taxPercent, taxAmount, discountAmount, total }
  }, [form.discountAmount, form.taxPercent, items])

  const summary = useMemo(() => `${form.clientName || "Cliente"} · ${formatUsd(totals.total)}`, [form.clientName, totals.total])

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
    if (!lead) return
    setForm((current) => ({
      ...current,
      leadId,
      clientName: lead.name || current.clientName,
      clientCompany: lead.companyName || current.clientCompany,
      clientEmail: lead.email || current.clientEmail,
      clientPhone: lead.phone || current.clientPhone,
    }))
  }

  function handleQuoteChange(quoteId: string) {
    updateForm("quoteId", quoteId)
    const quote = quotes.find((entry) => entry.id === quoteId)
    if (!quote) return
    setForm((current) => ({
      ...current,
      quoteId,
      clientName: quote.clientName || current.clientName,
      clientEmail: quote.clientEmail || current.clientEmail,
      emailSubject: current.emailSubject || `Invoice referente a ${quote.quoteNumber}`,
    }))
  }

  async function createInvoice() {
    const response = await fetch("/api/sextou-tools/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        leadId: form.leadId || null,
        quoteId: form.quoteId || null,
        dueDate: form.dueDate || null,
        taxPercent: totals.taxPercent,
        discountAmount: totals.discountAmount,
        lineItems: totals.normalizedItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error("invoice-save-failed")
    }

    const data = await response.json()

    await fetch("/api/sextou-tools/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "gerador-invoice-email",
        input: {
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          lineItems: totals.normalizedItems.length,
        },
        output: {
          invoiceId: data.invoice.id,
          invoiceNumber: data.invoice.invoiceNumber,
          total: totals.total,
        },
        metadata: {
          summary,
        },
      }),
    })

    setInvoices((current) => [data.invoice, ...current].slice(0, 12))
    setLocalHistory((current) => [
      {
        title: "gerador invoice email",
        subtitle: summary,
        timestamp: new Date().toLocaleString("pt-BR"),
      },
      ...current,
    ].slice(0, 8))

    return data.invoice as InvoiceRecord
  }

  async function handleCreate() {
    setIsSaving(true)
    try {
      const invoice = await createInvoice()
      setStatusMessage("Invoice salva. Use os atalhos para baixar PDF ou enviar e-mail.")
      window.open(`/api/sextou-tools/invoices/${invoice.id}/pdf`, "_blank")
    } catch {
      setStatusMessage("Nao foi possivel criar a invoice agora.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSend(invoiceId: string) {
    setStatusMessage("Enviando invoice por e-mail...")
    const response = await fetch(`/api/sextou-tools/invoices/${invoiceId}/send`, {
      method: "POST",
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      const detail = errorBody?.error ? `: ${errorBody.error}` : ""
      setStatusMessage(`Falha ao enviar invoice por e-mail${detail}`)
      return
    }

    setInvoices((current) => current.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status: "SENT" } : invoice)))
    setStatusMessage("Invoice enviada com sucesso.")
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <section className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Lead</label>
            <select className={fieldClass} value={form.leadId} onChange={(event) => handleLeadChange(event.target.value)}>
              <option value="">Sem lead vinculado</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>{lead.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Quote base</label>
            <select className={fieldClass} value={form.quoteId} onChange={(event) => handleQuoteChange(event.target.value)}>
              <option value="">Sem quote vinculada</option>
              {quotes.map((quote) => (
                <option key={quote.id} value={quote.id}>{quote.quoteNumber}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Titulo</label>
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
            <label className={labelClass}>E-mail do cliente</label>
            <input className={fieldClass} value={form.clientEmail} onChange={(event) => updateForm("clientEmail", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Telefone</label>
            <input className={fieldClass} value={form.clientPhone} onChange={(event) => updateForm("clientPhone", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Emissao</label>
            <input type="date" className={fieldClass} value={form.issueDate} onChange={(event) => updateForm("issueDate", event.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Vencimento</label>
            <input type="date" className={fieldClass} value={form.dueDate} onChange={(event) => updateForm("dueDate", event.target.value)} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Itens faturados</p>
            <button type="button" onClick={addItem} className="text-sm font-semibold text-[#F0EDE6]">Adicionar item</button>
          </div>
          {items.map((item, index) => (
            <div key={`${index}-${item.description}`} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1.5fr_0.6fr_0.8fr_auto]">
              <input className={fieldClass} value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} placeholder="Descricao" />
              <input className={fieldClass} value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} placeholder="Qtd" />
              <input className={fieldClass} value={item.unitPrice} onChange={(event) => updateItem(index, "unitPrice", event.target.value)} placeholder="Unitario" />
              <button type="button" onClick={() => removeItem(index)} className="h-12 rounded-2xl border border-white/10 px-4 text-sm text-[#A09D97]">Remover</button>
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
            <label className={labelClass}>Assunto do e-mail</label>
            <input className={fieldClass} value={form.emailSubject} onChange={(event) => updateForm("emailSubject", event.target.value)} placeholder="Ex.: Invoice Junho" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Mensagem do e-mail</label>
            <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.emailMessage} onChange={(event) => updateForm("emailMessage", event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Notas internas</label>
            <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleCreate} disabled={isSaving} className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isSaving ? "Salvando..." : "Criar invoice"}
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">{statusMessage}</p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Total da invoice</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Subtotal</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(totals.subtotal)}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Impostos</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{formatUsd(totals.taxAmount)}</p></div>
            <div className="rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#FF3D57]">Total</p><p className="mt-2 font-toolkit text-4xl font-extrabold text-white">{formatUsd(totals.total)}</p></div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Invoices recentes</p>
          <div className="mt-4 space-y-3">
            {invoices.length === 0 ? (
              <p className="text-sm text-[#A09D97]">Nenhuma invoice salva ainda.</p>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-[#F0EDE6]">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-[#A09D97]">{invoice.clientName} · {formatUsd(invoice.total)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#A09D97]">{invoice.status}</p>
                  <div className="mt-3 flex gap-4 text-sm font-semibold">
                    <button type="button" onClick={() => window.open(`/api/sextou-tools/invoices/${invoice.id}/pdf`, "_blank")} className="text-[#FF8C00]">
                      PDF
                    </button>
                    <button type="button" onClick={() => void handleSend(invoice.id)} className="text-[#F0EDE6]">
                      Enviar e-mail
                    </button>
                  </div>
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
