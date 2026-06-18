"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ZapLeadDrawer } from "./lead-drawer"
import { BulkSenderModal } from "./bulk-sender-modal"

type Contact = {
  id: string
  displayName: string | null
  phoneE164: string
  sourceGroup?: {
    name: string | null
  } | null
}

export type Lead = {
  id: string
  status: string
  heatScore: number
  contact: Contact
  createdAt: string
}

const COLUMNS = [
  { id: "frio", title: "❄️ Frio" },
  { id: "contatado", title: "📱 Contatado" },
  { id: "quente", title: "🔥 Quente" },
  { id: "qualificado", title: "🎯 Qualificado" },
  { id: "negociacao", title: "💬 Negociação" },
  { id: "ganho", title: "✅ Ganho" },
  { id: "perdido", title: "❌ Perdido" },
]

export function ZapLeadsKanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isBulkSenderOpen, setIsBulkSenderOpen] = useState(false)
  
  // Need this to prevent hydration errors with drag and drop
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/zapleads/leads")
      const data = await res.json()
      if (res.ok) {
        setLeads(data.leads || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Optimistic UI update
    const movedLead = leads.find(l => l.id === draggableId)
    if (!movedLead) return

    const prevStatus = movedLead.status
    const newStatus = destination.droppableId

    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStatus } : l))

    // Backend sync
    try {
      const res = await fetch("/api/zapleads/leads/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: draggableId,
          fromStatus: prevStatus,
          toStatus: newStatus
        })
      })
      if (!res.ok) {
        // Revert on error
        setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: prevStatus } : l))
      }
    } catch (e) {
      setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: prevStatus } : l))
    }
  }

  const getLeadsByStatus = (status: string) => leads.filter(l => l.status === status)

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("Não há leads para exportar.")
      return
    }

    const headers = ["Nome", "Telefone", "Status", "Temperatura", "Data de Entrada", "ID"]
    const rows = leads.map(l => [
      `"${l.contact.displayName || ''}"`,
      l.contact.phoneE164,
      l.status,
      l.heatScore.toString(),
      new Date(l.createdAt).toLocaleDateString("pt-BR"),
      l.id
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `zapleads_export_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearAll = async () => {
    if (!confirm("Tem certeza que deseja apagar TODOS os leads do Kanban? Isso limpará o seu CRM atual, mas manterá as conexões com o WhatsApp.")) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/zapleads/leads", {
        method: "DELETE"
      })
      if (res.ok) {
        setLeads([])
      } else {
        alert("Erro ao limpar CRM.")
      }
    } catch (err) {
      console.error(err)
      alert("Erro ao limpar CRM.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      if (!text) return

      // Parsing de CSV mais resiliente
      const lines = text.split("\\n")
      const parsedContacts: { name: string, phone: string }[] = []
      
      let nameIdx = 0
      let phoneIdx = 1

      lines.forEach((line, index) => {
        if (!line.trim()) return

        // Lidando com vírgulas dentro de aspas usando RegEx básico
        const cols = line.match(/(".*?"|[^",\\s]+)(?=\\s*,|\\s*$)/g) || line.split(",")
        const cleanCols = cols.map(c => c.replace(/^"|"$/g, "").trim())

        // Verifica o Cabeçalho
        if (index === 0 && line.toLowerCase().includes("telefone")) {
          const lowerCols = cleanCols.map(c => c.toLowerCase())
          const nI = lowerCols.findIndex(c => c.includes("nome"))
          const pI = lowerCols.findIndex(c => c.includes("telefone") || c.includes("phone") || c.includes("celular"))
          
          if (nI !== -1) nameIdx = nI
          if (pI !== -1) phoneIdx = pI
          return
        }
        
        if (cleanCols.length > Math.max(nameIdx, phoneIdx)) {
          let name = cleanCols[nameIdx]
          let phone = cleanCols[phoneIdx]
          
          if (!phone) return

          // Força DDI BR +55 se o número não tiver
          let cleanPhone = phone.replace(/\\D/g, "")
          if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
            cleanPhone = "55" + cleanPhone
          }
          if (!cleanPhone.startsWith("+")) cleanPhone = "+" + cleanPhone

          parsedContacts.push({ name, phone: cleanPhone })
        }
      })

      if (parsedContacts.length === 0) {
        alert("Não foi possível encontrar dados válidos no CSV. Use o formato: Nome,Telefone")
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch("/api/zapleads/leads/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contacts: parsedContacts })
        })
        const data = await res.json()
        if (res.ok) {
          alert(`Importação concluída! ${data.count} novos leads adicionados.`)
          fetchLeads()
        } else {
          alert(data.error || "Erro ao importar.")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
        if (e.target) e.target.value = '' // reseta input
      }
    }
    reader.readAsText(file)
  }

  if (!isMounted) return null

  return (
    <div className="mt-12 w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F0EDE6]">CRM Kanban</h2>
          <p className="text-sm text-[#A09D97]">Gerencie seus leads extraídos movendo os cartões</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsBulkSenderOpen(true)}
            className="rounded-xl bg-[#9d4edd] px-4 py-2 text-sm text-white font-bold hover:bg-[#9d4edd]/90 transition shadow-lg shadow-[#9d4edd]/20 flex items-center gap-2"
          >
            🚀 Disparo em Massa
          </button>
          <label className="cursor-pointer rounded-xl border border-[#25D366]/30 bg-black/40 px-4 py-2 text-sm text-[#25D366] font-semibold hover:bg-white/5 transition flex items-center gap-2">
            📥 Importar CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
          </label>
          <button 
            onClick={handleClearAll} 
            className="rounded-xl border border-[#FF3D57]/30 bg-[#FF3D57]/10 px-4 py-2 text-sm text-[#FF3D57] font-semibold hover:bg-[#FF3D57]/20 transition flex items-center gap-2"
          >
            🗑️ Limpar CRM
          </button>
          <button 
            onClick={handleExportCSV} 
            className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 text-sm text-[#25D366] font-semibold hover:bg-[#25D366]/20 transition flex items-center gap-2"
          >
            📊 Exportar CSV
          </button>
          <button 
            onClick={fetchLeads} 
            disabled={isLoading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#F0EDE6] hover:bg-white/10 transition"
          >
            {isLoading ? "Carregando..." : "Atualizar"}
          </button>
        </div>
      </div>

      <div className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <DragDropContext onDragEnd={handleDragEnd}>
          {COLUMNS.map(col => {
            const colLeads = getLeadsByStatus(col.id)
            return (
              <div key={col.id} className="min-w-[280px] w-[280px] shrink-0 rounded-2xl border border-white/5 bg-[#0D0D0D] p-4 flex flex-col max-h-[700px]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-[#F0EDE6] text-sm">{col.title}</h3>
                  <span className="flex h-5 items-center justify-center rounded-full bg-white/10 px-2 text-[10px] font-bold text-[#A09D97]">
                    {colLeads.length}
                  </span>
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto min-h-[150px] space-y-3 transition-colors ${snapshot.isDraggingOver ? "bg-white/5 rounded-xl" : ""}`}
                    >
                      {colLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedLead(lead)}
                              className={`cursor-pointer rounded-xl border border-white/10 bg-[#171717] p-4 shadow-lg transition-transform hover:border-white/20 hover:-translate-y-1 ${snapshot.isDragging ? "rotate-2 border-[#FF3D57]/50" : ""}`}
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm text-[#F0EDE6] truncate">
                                  {lead.contact.displayName || lead.contact.phoneE164}
                                </p>
                                {lead.heatScore > 0 && (
                                  <span className="text-xs text-[#FF3D57] font-bold flex items-center">
                                    🔥 {lead.heatScore}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-[#A09D97]">
                                {lead.contact.displayName ? lead.contact.phoneE164 : "Sem nome"}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </DragDropContext>
      </div>

      <ZapLeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
      
      <BulkSenderModal 
        isOpen={isBulkSenderOpen} 
        onClose={() => setIsBulkSenderOpen(false)} 
        leads={leads}
        onLeadsUpdated={fetchLeads}
      />
    </div>
  )
}
