"use client"

import { useEffect, useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface LeadsManagerToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

interface LeadRecord {
  id: string
  name: string
  companyName?: string | null
  email?: string | null
  phone?: string | null
  source: string
  status: string
  estimatedValue?: number | null
  createdAt: string
}

const initialForm = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  source: "indicacao",
  status: "NEW",
  estimatedValue: "0",
  notes: "",
  tags: "",
}

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

export function LeadsManagerTool({ historyItems }: LeadsManagerToolProps) {
  const [form, setForm] = useState(initialForm)
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [localHistory, setLocalHistory] = useState(historyItems)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Cadastre e acompanhe suas oportunidades comerciais.")

  useEffect(() => {
    async function loadLeads() {
      const response = await fetch("/api/sextou-tools/leads")

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setLeads(data.leads ?? [])
    }

    void loadLeads()
  }, [])

  const pipeline = useMemo(() => {
    const total = leads.length
    const open = leads.filter((lead) => lead.status !== "WON" && lead.status !== "LOST").length
    const won = leads.filter((lead) => lead.status === "WON").length
    const estimated = leads.reduce((sum, lead) => sum + (lead.estimatedValue ?? 0), 0)

    return { total, open, won, estimated }
  }, [leads])

  async function handleSave() {
    setIsSaving(true)
    try {
      const response = await fetch("/api/sextou-tools/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          companyName: form.companyName,
          email: form.email,
          phone: form.phone,
          source: form.source,
          status: form.status,
          estimatedValue: parseNumber(form.estimatedValue),
          notes: form.notes,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) {
        throw new Error("lead-save-failed")
      }

      const data = await response.json()
      const summary = `${form.name} · ${form.status}`

      await fetch("/api/sextou-tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: "gerenciador-oportunidades-leads",
          input: {
            name: form.name,
            source: form.source,
            status: form.status,
          },
          output: {
            leadId: data.lead.id,
            estimatedValue: parseNumber(form.estimatedValue),
          },
          metadata: {
            summary,
          },
        }),
      })

      setLeads((current) => [data.lead, ...current].slice(0, 12))
      setLocalHistory((current) => [
        {
          title: "gerenciador oportunidades leads",
          subtitle: summary,
          timestamp: new Date().toLocaleString("pt-BR"),
        },
        ...current,
      ].slice(0, 8))
      setForm(initialForm)
      setStatusMessage("Lead salvo com sucesso.")
    } catch {
      setStatusMessage("Nao foi possivel salvar o lead agora.")
    } finally {
      setIsSaving(false)
    }
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
      <section className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nome</label>
            <input className={fieldClass} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Empresa</label>
            <input className={fieldClass} value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input className={fieldClass} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Telefone</label>
            <input className={fieldClass} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Origem</label>
            <select className={fieldClass} value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}>
              <option value="indicacao">Indicacao</option>
              <option value="instagram">Instagram</option>
              <option value="google">Google</option>
              <option value="evento">Evento</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={fieldClass} value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
              <option value="NEW">Novo</option>
              <option value="QUALIFIED">Qualificado</option>
              <option value="PROPOSAL">Proposta enviada</option>
              <option value="WON">Fechado</option>
              <option value="LOST">Perdido</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Valor estimado</label>
            <input className={fieldClass} value={form.estimatedValue} onChange={(event) => setForm((current) => ({ ...current, estimatedValue: event.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <input className={fieldClass} value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} placeholder="roofing, vip, follow-up" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Notas</label>
            <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleSave} disabled={isSaving} className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isSaving ? "Salvando..." : "Salvar lead"}
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">{statusMessage}</p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Pipeline</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Total de leads</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{pipeline.total}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Em aberto</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{pipeline.open}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Fechados</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{pipeline.won}</p></div>
            <div className="rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#FF3D57]">Valor estimado</p><p className="mt-2 font-toolkit text-4xl font-extrabold text-white">{formatUsd(pipeline.estimated)}</p></div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Leads recentes</p>
          <div className="mt-4 space-y-3">
            {leads.length === 0 ? (
              <p className="text-sm text-[#A09D97]">Nenhuma oportunidade salva ainda.</p>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-[#F0EDE6]">{lead.name}</p>
                  <p className="text-sm text-[#A09D97]">{lead.source} · {lead.status}</p>
                  <p className="mt-1 text-sm text-[#A09D97]">{lead.estimatedValue ? formatUsd(lead.estimatedValue) : "Sem valor estimado"}</p>
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
