"use client"

import { useEffect, useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface BrazilianDirectoryToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

interface DirectoryEntry {
  id: string
  businessName: string
  ownerName: string
  category: string
  city: string
  state: string
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  instagram?: string | null
  website?: string | null
  shortDescription: string
  servicesSummary?: string | null
  badgeLabel?: string | null
  status: string
  isPublic: boolean
  adminNotes?: string | null
}

const initialForm = {
  businessName: "",
  ownerName: "",
  category: "servicos",
  city: "",
  state: "",
  phone: "",
  whatsapp: "",
  email: "",
  instagram: "",
  website: "",
  shortDescription: "",
  servicesSummary: "",
  badgeLabel: "",
  isPublic: true,
}

export function BrazilianDirectoryTool({ historyItems }: BrazilianDirectoryToolProps) {
  const [entries, setEntries] = useState<DirectoryEntry[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [query, setQuery] = useState("")
  const [statusMessage, setStatusMessage] = useState("Cadastre sua empresa e acompanhe a moderacao do diretorio.")
  const [localHistory, setLocalHistory] = useState(historyItems)
  const [isSaving, setIsSaving] = useState(false)

  async function loadEntries() {
    const response = await fetch("/api/sextou-tools/directory")
    if (!response.ok) return
    const data = await response.json()
    setEntries(data.entries ?? [])
    setIsAdmin(Boolean(data.isAdmin))
  }

  useEffect(() => {
    void loadEntries()
  }, [])

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return entries
    return entries.filter((entry) =>
      [entry.businessName, entry.category, entry.city, entry.state, entry.shortDescription]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
  }, [entries, query])

  const overview = useMemo(() => {
    return {
      total: entries.length,
      approved: entries.filter((entry) => entry.status === "APPROVED").length,
      pending: entries.filter((entry) => entry.status === "PENDING").length,
      publicVisible: entries.filter((entry) => entry.isPublic && entry.status === "APPROVED").length,
    }
  }, [entries])

  async function handleSave() {
    setIsSaving(true)
    try {
      const response = await fetch("/api/sextou-tools/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("directory-save-failed")
      }

      await fetch("/api/sextou-tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: "diretorio-empresas-brasileiras",
          input: {
            businessName: form.businessName,
            category: form.category,
          },
          output: {
            submitted: true,
          },
          metadata: {
            summary: `${form.businessName} · aguardando moderacao`,
          },
        }),
      })

      setLocalHistory((current) => [
        {
          title: "diretorio empresas brasileiras",
          subtitle: `${form.businessName} · aguardando moderacao`,
          timestamp: new Date().toLocaleString("pt-BR"),
        },
        ...current,
      ].slice(0, 8))

      setForm(initialForm)
      await loadEntries()
      setStatusMessage("Empresa enviada para moderacao.")
    } catch {
      setStatusMessage("Nao foi possivel enviar a empresa agora.")
    } finally {
      setIsSaving(false)
    }
  }

  async function moderate(id: string, status: "APPROVED" | "REJECTED") {
    const response = await fetch(`/api/sextou-tools/directory/${id}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      setStatusMessage("Nao foi possivel moderar este cadastro.")
      return
    }

    await loadEntries()
    setStatusMessage(`Cadastro marcado como ${status}.`)
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_minmax(0,0.92fr)]">
      <section className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Nova empresa</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Nome do negocio</label>
              <input className={fieldClass} value={form.businessName} onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Responsavel</label>
              <input className={fieldClass} value={form.ownerName} onChange={(event) => setForm((current) => ({ ...current, ownerName: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <select className={fieldClass} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                <option value="servicos">Servicos</option>
                <option value="restaurante">Restaurante</option>
                <option value="construcao">Construcao</option>
                <option value="marketing">Marketing</option>
                <option value="saude">Saude</option>
                <option value="consultoria">Consultoria</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Cidade</label>
              <input className={fieldClass} value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <input className={fieldClass} value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Telefone</label>
              <input className={fieldClass} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input className={fieldClass} value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input className={fieldClass} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input className={fieldClass} value={form.instagram} onChange={(event) => setForm((current) => ({ ...current, instagram: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input className={fieldClass} value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Selo</label>
              <input className={fieldClass} value={form.badgeLabel} onChange={(event) => setForm((current) => ({ ...current, badgeLabel: event.target.value }))} placeholder="Ex.: VIP Member" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descricao curta</label>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.shortDescription} onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Resumo dos servicos</label>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.servicesSummary} onChange={(event) => setForm((current) => ({ ...current, servicesSummary: event.target.value }))} />
            </div>
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm text-[#F0EDE6]">
            <input type="checkbox" checked={form.isPublic} onChange={(event) => setForm((current) => ({ ...current, isPublic: event.target.checked }))} />
            Tornar perfil publico quando aprovado
          </label>
          <button type="button" onClick={handleSave} disabled={isSaving} className="mt-6 inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isSaving ? "Enviando..." : "Enviar para diretorio"}
          </button>
          <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">{statusMessage}</p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Painel do diretorio</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Cadastros</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{overview.total}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Aprovados</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{overview.approved}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Pendentes</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{overview.pending}</p></div>
            <div className="rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#FF3D57]">Publicos</p><p className="mt-2 font-toolkit text-4xl font-extrabold text-white">{overview.publicVisible}</p></div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Empresas</p>
            <input className="h-10 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar" />
          </div>
          <div className="mt-4 space-y-3">
            {filteredEntries.length === 0 ? (
              <p className="text-sm text-[#A09D97]">Nenhuma empresa encontrada.</p>
            ) : (
              filteredEntries.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#F0EDE6]">{entry.businessName}</p>
                      <p className="text-sm text-[#A09D97]">{entry.category} · {entry.city}, {entry.state}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#F0EDE6]">{entry.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#A09D97]">{entry.shortDescription}</p>
                  {entry.badgeLabel ? <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#FCD34D]">{entry.badgeLabel}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#F0EDE6]">
                    {entry.whatsapp ? <span>WhatsApp: {entry.whatsapp}</span> : null}
                    {entry.website ? <span>Site: {entry.website}</span> : null}
                  </div>
                  {isAdmin && entry.status === "PENDING" ? (
                    <div className="mt-4 flex gap-4 text-sm font-semibold">
                      <button type="button" onClick={() => void moderate(entry.id, "APPROVED")} className="text-[#FCD34D]">Aprovar</button>
                      <button type="button" onClick={() => void moderate(entry.id, "REJECTED")} className="text-[#F0EDE6]">Rejeitar</button>
                    </div>
                  ) : null}
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
