"use client"

import { useEffect, useState } from "react"
import { Lead } from "./kanban-board"

export function ZapLeadDrawer({ lead: initialLead, onClose }: { lead: Lead | null, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"perfil" | "interacoes" | "outreach">("perfil")
  const [fullLead, setFullLead] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newInteraction, setNewInteraction] = useState("")
  
  // IA Outreach State
  const [activePhone, setActivePhone] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    displayName: "",
    phoneE164: "",
    email: "",
    company: "",
    batch: "",
    estimatedValue: "",
    nextFollowupAt: "",
    notes: ""
  })

  useEffect(() => {
    if (initialLead) {
      fetchFullLeadData()
      fetchWhatsAppStatus()
      setActiveTab("perfil") // Reseta a aba
      setGeneratedMessage("")
    } else {
      setFullLead(null)
    }
  }, [initialLead])

  const fetchWhatsAppStatus = async () => {
    try {
      const res = await fetch("/api/zapleads/whatsapp/status")
      const data = await res.json()
      if (data.connectedPhone) {
        setActivePhone("+" + data.connectedPhone)
      } else {
        setActivePhone(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFullLeadData = async () => {
    if (!initialLead) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/zapleads/leads/${initialLead.id}`)
      const data = await res.json()
      if (res.ok && data.lead) {
        setFullLead(data.lead)
        setFormData({
          displayName: data.lead.contact.displayName || "",
          phoneE164: data.lead.contact.phoneE164 || "",
          email: data.lead.contact.email || "",
          company: data.lead.contact.company || "",
          batch: data.lead.contact.batch || "",
          estimatedValue: data.lead.estimatedValue?.toString() || "",
          nextFollowupAt: data.lead.nextFollowupAt ? new Date(data.lead.nextFollowupAt).toISOString().slice(0, 10) : "",
          notes: data.lead.contact.notes || ""
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!fullLead) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/zapleads/leads/${fullLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimatedValue: formData.estimatedValue || null,
          nextFollowupAt: formData.nextFollowupAt || null,
          contact: {
            displayName: formData.displayName,
            phoneE164: formData.phoneE164,
            email: formData.email,
            company: formData.company,
            batch: formData.batch,
            notes: formData.notes
          }
        })
      })
      if (res.ok) {
        alert("Perfil atualizado!")
        fetchFullLeadData()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddInteraction = async () => {
    if (!newInteraction.trim() || !fullLead) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/zapleads/leads/${fullLead.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newInteraction })
      })
      if (res.ok) {
        setNewInteraction("")
        fetchFullLeadData() // Atualiza a lista
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!fullLead) return
    setIsGenerating(true)
    try {
      const res = await fetch("/api/zapleads/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadName: formData.displayName || fullLead.contact.displayName || "Contato",
          groupPurpose: fullLead.contact.sourceGroup?.name || "Networking",
          notes: formData.notes
        })
      })
      const data = await res.json()
      if (data.message) {
        setGeneratedMessage(data.message)
      } else {
        alert(data.error || "Erro ao gerar")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendWhatsApp = async () => {
    if (!fullLead || !generatedMessage) return
    setIsSending(true)
    try {
      const res = await fetch("/api/zapleads/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: fullLead.id,
          message: generatedMessage,
          phoneE164: formData.phoneE164 || fullLead.contact.phoneE164
        })
      })
      const data = await res.json()
      if (data.success) {
        alert("Enviado com sucesso!")
        fetchFullLeadData() // Para atualizar timeline e status
        setGeneratedMessage("")
        setActiveTab("interacoes") // Pula pra ver a timeline
      } else {
        alert("Falha no disparo: " + data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  if (!initialLead) return null

  return (
    <>
      {/* Overlay background */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Sliding Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[500px] bg-[#0D0D0D] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 p-6 bg-[#171717]">
          <div>
            <h3 className="font-bold text-lg text-[#F0EDE6] truncate">
              {formData.displayName || "Desconhecido"}
            </h3>
            <p className="text-sm text-[#A09D97]">{formData.phoneE164}</p>
          </div>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-6">
          <button 
            onClick={() => setActiveTab("perfil")}
            className={`py-4 px-4 text-sm font-semibold transition border-b-2 ${activeTab === "perfil" ? "border-[#FF3D57] text-[#F0EDE6]" : "border-transparent text-[#5A5755] hover:text-[#A09D97]"}`}
          >
            📋 Cadastro
          </button>
          <button 
            onClick={() => setActiveTab("interacoes")}
            className={`py-4 px-4 text-sm font-semibold transition border-b-2 ${activeTab === "interacoes" ? "border-[#FF3D57] text-[#F0EDE6]" : "border-transparent text-[#5A5755] hover:text-[#A09D97]"}`}
          >
            💬 Interações
          </button>
          <button 
            onClick={() => setActiveTab("outreach")}
            className={`py-4 px-4 text-sm font-semibold transition border-b-2 ${activeTab === "outreach" ? "border-[#9d4edd] text-[#F0EDE6]" : "border-transparent text-[#5A5755] hover:text-[#A09D97]"}`}
          >
            🤖 IA Quebra-Gelo
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#FF3D57]"></div>
            </div>
          ) : activeTab === "perfil" ? (
            /* TAB: CADASTRO */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Nome</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Telefone</label>
                  <input 
                    type="text" 
                    value={formData.phoneE164}
                    onChange={(e) => setFormData({...formData, phoneE164: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">E-mail</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@empresa.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Empresa</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Nome do Negócio"
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Lote</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                    placeholder="ex: pizzarias"
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Grupo de Origem</label>
                  <input
                    type="text"
                    value={fullLead?.contact?.sourceGroup?.name || "—"}
                    readOnly
                    title="Grupo de onde o contato foi extraído"
                    className="w-full cursor-default rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-[#A09D97] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Valor Estimado (R$)</label>
                  <input 
                    type="number" 
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                    placeholder="Ex: 5000"
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Próximo Contato</label>
                  <input 
                    type="date" 
                    value={formData.nextFollowupAt}
                    onChange={(e) => setFormData({...formData, nextFollowupAt: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5755] uppercase">Anotações / Notas Livres</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  placeholder="Resumo do cliente, dores principais, objeções..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-[#F0EDE6] placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:outline-none resize-none"
                />
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full rounded-xl bg-[#FF3D57] p-3 text-sm font-bold text-white transition hover:bg-[#FF3D57]/90 disabled:opacity-50"
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          ) : activeTab === "interacoes" ? (
            /* TAB: INTERAÇÕES */
            <div className="space-y-6">
              {/* Novo Registro */}
              <div className="rounded-xl border border-white/10 bg-[#171717] p-4">
                <textarea 
                  value={newInteraction}
                  onChange={(e) => setNewInteraction(e.target.value)}
                  placeholder="Registre uma reunião, envio de e-mail ou WhatsApp manual..."
                  rows={2}
                  className="w-full rounded-lg bg-black/40 p-3 text-sm text-[#F0EDE6] placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:outline-none resize-none mb-3"
                />
                <div className="flex justify-between items-center">
                  <a 
                    href={`https://wa.me/${formData.phoneE164.replace(/\\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#25D366] hover:underline flex items-center gap-1"
                  >
                    💬 Abrir WhatsApp
                  </a>
                  <button 
                    onClick={handleAddInteraction}
                    disabled={isSaving || !newInteraction.trim()}
                    className="rounded-lg bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition disabled:opacity-50"
                  >
                    Registrar Log
                  </button>
                </div>
              </div>

              {/* Timeline de Histórico (Mensagens + Status) */}
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10">
                {fullLead && [
                  ...(fullLead.messages || []).map((m: any) => ({ ...m, type: 'message', date: new Date(m.createdAt) })),
                  ...(fullLead.statusHistory || []).map((h: any) => ({ ...h, type: 'status', date: new Date(h.createdAt) }))
                ]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((item, idx) => (
                    <div key={idx} className="relative pl-8">
                      {item.type === 'message' ? (
                        <>
                          <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-[#171717] border border-white/20 flex items-center justify-center text-[10px]">
                            {item.aiGenerated ? '🤖' : '📝'}
                          </div>
                          <div className={`rounded-lg border bg-[#171717] p-3 shadow-sm ${item.aiGenerated ? 'border-[#9d4edd]/30' : 'border-white/5'}`}>
                            <p className="text-xs font-bold text-[#A09D97] mb-1">
                              {item.date.toLocaleString('pt-BR')} • {item.aiGenerated ? 'Disparo IA' : 'Registro Manual'}
                            </p>
                            <p className="text-sm text-[#F0EDE6] whitespace-pre-wrap">{item.body}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-[#FF3D57]/20 border border-[#FF3D57]/40 flex items-center justify-center text-[10px]">
                            🔄
                          </div>
                          <div>
                            <p className="text-sm text-[#F0EDE6]">
                              Moveu para <span className="font-bold text-[#FF3D57] uppercase">{item.toStatus}</span>
                            </p>
                            <p className="text-xs text-[#5A5755]">{item.date.toLocaleString('pt-BR')}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : activeTab === "outreach" ? (
            /* TAB: IA OUTREACH */
            <div className="space-y-6">
              <div className="rounded-xl border border-[#9d4edd]/30 bg-[#9d4edd]/5 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#9d4edd] text-white p-2 rounded-lg">🤖</div>
                  <div>
                    <h4 className="font-bold text-[#F0EDE6]">Assistente de Quebra-Gelo</h4>
                    <p className="text-xs text-[#A09D97]">A IA analisará os dados do cliente e gerará a melhor abordagem.</p>
                  </div>
                </div>

                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full rounded-xl bg-white/10 p-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-50 border border-white/20 mb-4"
                >
                  {isGenerating ? "Pensando e Escrevendo..." : "⚡ Gerar Mensagem com IA"}
                </button>

                {generatedMessage && (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <div>
                      <label className="text-xs font-semibold text-[#9d4edd] uppercase mb-2 block">Mensagem (Edite se quiser):</label>
                      <textarea 
                        value={generatedMessage}
                        onChange={(e) => setGeneratedMessage(e.target.value)}
                        rows={6}
                        className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-[#F0EDE6] focus:border-[#9d4edd] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="rounded-lg bg-black/60 p-4 border border-[#25D366]/30">
                      <p className="text-xs text-[#A09D97] mb-2 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${activePhone ? 'bg-[#25D366]' : 'bg-red-500 animate-pulse'}`}></span>
                        Status do Disparo
                      </p>
                      {activePhone ? (
                        <>
                          <p className="text-sm text-[#F0EDE6] mb-4">
                            Você está prestes a enviar usando o número: <br />
                            <strong className="text-[#25D366] text-lg tracking-wider">{activePhone}</strong>
                          </p>
                          <button 
                            onClick={handleSendWhatsApp}
                            disabled={isSending || !generatedMessage}
                            className="w-full rounded-xl bg-[#25D366] p-3 text-sm font-bold text-black transition hover:bg-[#25D366]/90 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSending ? "Disparando..." : "🚀 Disparar via WhatsApp"}
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-[#FF3D57] font-semibold mb-2">WhatsApp Desconectado</p>
                          <p className="text-xs text-[#A09D97]">Feche o card, vá para o painel principal e escaneie o QR Code com o chip que fará os disparos.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
