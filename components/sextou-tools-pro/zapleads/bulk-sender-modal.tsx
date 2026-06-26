"use client"

import { useState, useEffect, useRef } from "react"
import { Lead } from "./kanban-board"

type BulkSenderModalProps = {
  isOpen: boolean
  onClose: () => void
  leads: Lead[]
  onLeadsUpdated: () => void
}

export function BulkSenderModal({ isOpen, onClose, leads, onLeadsUpdated }: BulkSenderModalProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("frio")
  const [messageTemplate, setMessageTemplate] = useState("Olá {{nome}}, tudo bem?")
  const [presetOption, setPresetOption] = useState<"none" | "new_account" | "safe_margins">("safe_margins")
  const [delayOption, setDelayOption] = useState<"risco-alto" | "seguro" | "ultra-seguro">("seguro")
  const [volumeOption, setVolumeOption] = useState<"50" | "150" | "200">("150")

  // Execution state
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [nextShotIn, setNextShotIn] = useState<number | null>(null)
  
  const [activePhone, setActivePhone] = useState<string | null>(null)

  const [showSafetyManual, setShowSafetyManual] = useState(false)

  // Refs for background execution stability
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(isRunning)
  const isPausedRef = useRef(isPaused)
  
  // Derived data
  const groups = Array.from(new Set(leads.map(l => l.contact.sourceGroup?.name).filter(Boolean))) as string[]
  const batches = Array.from(new Set(leads.map(l => l.contact.batch).filter(Boolean))) as string[]
  const targetLeads = leads.filter(l => {
    const matchStatus = selectedStatus === "all" || l.status === selectedStatus
    const matchGroup = selectedGroup === "all" || l.contact.sourceGroup?.name === selectedGroup
    const matchBatch = selectedBatch === "all" || l.contact.batch === selectedBatch
    return matchStatus && matchGroup && matchBatch
  })

  const finalLeads = targetLeads.slice(0, Number(volumeOption))

  const handlePresetChange = (preset: "none" | "new_account" | "safe_margins") => {
    setPresetOption(preset)
    if (preset === "new_account") {
      setDelayOption("ultra-seguro")
      setVolumeOption("50")
    } else if (preset === "safe_margins") {
      setDelayOption("seguro")
      setVolumeOption("150")
    }
  }

  useEffect(() => {
    isRunningRef.current = isRunning
    isPausedRef.current = isPaused
  }, [isRunning, isPaused])

  useEffect(() => {
    if (isOpen) {
      fetchWhatsAppStatus()
      setShowSafetyManual(false)
    } else {
      stopCampaign()
    }
  }, [isOpen])

  const fetchWhatsAppStatus = async () => {
    try {
      const res = await fetch("/api/zapleads/whatsapp/status")
      const data = await res.json()
      if (data.connectedPhone) setActivePhone("+" + data.connectedPhone)
    } catch (err) {}
  }

  const startCampaign = () => {
    if (finalLeads.length === 0) return alert("Nenhum lead encontrado com esses filtros.")
    if (!messageTemplate.trim()) return alert("Digite uma mensagem.")
    if (!activePhone) return alert("WhatsApp não está conectado.")
    
    setIsRunning(true)
    setIsPaused(false)
    setCurrentIndex(0)
    setSuccessCount(0)
    setErrorCount(0)
    
    processNextLead(0)
  }

  const stopCampaign = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsRunning(false)
    setIsPaused(false)
    setNextShotIn(null)
  }

  const pauseCampaign = () => {
    setIsPaused(true)
  }

  const resumeCampaign = () => {
    setIsPaused(false)
    processNextLead(currentIndex)
  }

  const processNextLead = async (index: number) => {
    if (!isRunningRef.current) return
    if (index >= finalLeads.length) {
      setIsRunning(false)
      alert("Campanha finalizada!")
      onLeadsUpdated()
      return
    }

    // Check pause loop
    if (isPausedRef.current) {
      // Poll every second until unpaused or stopped
      timerRef.current = setTimeout(() => processNextLead(index), 1000)
      return
    }

    const lead = finalLeads[index]
    const name = lead.contact.displayName || "amigo"
    const parsedMessage = messageTemplate.replace(/\{\{nome\}\}/gi, name)

    try {
      const res = await fetch("/api/zapleads/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          message: parsedMessage,
          phoneE164: lead.contact.phoneE164
        })
      })
      const data = await res.json()
      if (data.success) {
        setSuccessCount(prev => prev + 1)
      } else {
        setErrorCount(prev => prev + 1)
      }
    } catch (err) {
      setErrorCount(prev => prev + 1)
    }

    setCurrentIndex(index + 1)
    onLeadsUpdated() // Refresh list lightly

    // Calculate next delay if not last lead
    if (index + 1 < finalLeads.length) {
      let minDelay = 30
      let maxDelay = 60
      if (delayOption === "risco-alto") { minDelay = 5; maxDelay = 15 }
      else if (delayOption === "ultra-seguro") { minDelay = 60; maxDelay = 120 }

      const delaySecs = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay)
      setNextShotIn(delaySecs)
      
      // Countdown timer UI update
      let remaining = delaySecs
      const countdownInterval = setInterval(() => {
        remaining -= 1
        setNextShotIn(remaining)
        if (remaining <= 0 || !isRunningRef.current) {
          clearInterval(countdownInterval)
        }
      }, 1000)

      timerRef.current = setTimeout(() => {
        clearInterval(countdownInterval)
        processNextLead(index + 1)
      }, delaySecs * 1000)
    } else {
      setIsRunning(false)
      alert("Campanha finalizada!")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-[#F0EDE6] flex items-center gap-2">
              🚀 Campanha de Disparo em Massa
            </h2>
            <p className="text-sm text-[#A09D97] mt-1">Envie mensagens sequenciais com segurança Anti-Ban.</p>
          </div>
          <button onClick={onClose} disabled={isRunning && !isPaused} className="text-white hover:bg-white/10 p-2 rounded-full disabled:opacity-30">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {showSafetyManual ? (
            /* SAFETY MANUAL VIEW */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 p-5 rounded-2xl">
                <h3 className="text-lg font-bold text-[#25D366] mb-2 flex items-center gap-2">
                  🛡️ Manual de Segurança Anti-Ban
                </h3>
                <p className="text-sm text-[#F0EDE6] mb-4">
                  O WhatsApp monitora contas buscando padrões de robôs (Spam). Siga estas diretrizes para proteger seu número de ataque.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-bold text-[#F0EDE6] mb-1">1. Tempo de Espera (Delays) ⏱️</h4>
                    <ul className="text-sm text-[#A09D97] list-disc pl-5 space-y-1">
                      <li><strong className="text-red-400">Risco Alto (Menos de 15s):</strong> Detecção instantânea de bot. Evite.</li>
                      <li><strong className="text-[#25D366]">Seguro (30 a 60s):</strong> O sistema vai simular um ser humano digitando.</li>
                      <li><strong className="text-[#9d4edd]">Ultra Seguro (60 a 120s):</strong> Ideal se o chip for novo ou se não houver pressa.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-md font-bold text-[#F0EDE6] mb-1">2. Volume Diário 📊</h4>
                    <ul className="text-sm text-[#A09D97] list-disc pl-5 space-y-1">
                      <li><strong className="text-[#F0EDE6]">Semana 1 (Chip Novo/Morno):</strong> Máximo de 30 a 50 mensagens/dia em blocos.</li>
                      <li><strong className="text-[#F0EDE6]">Semana 2+ (Chip Quente):</strong> Suba para 100 a 150 envios/dia.</li>
                      <li><strong className="text-red-400">Limite:</strong> Nunca passe de 200 envios frios por dia no mesmo chip.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-md font-bold text-[#F0EDE6] mb-1">3. A Regra do "Botão de Bloqueio" 🛑</h4>
                    <p className="text-sm text-[#A09D97] pl-5">
                      O maior gatilho de banimento não é a velocidade, mas sim as pessoas clicarem em <strong>Denunciar</strong>. A sua mensagem precisa ser tão natural (ex: "Opa, vi você no grupo X...") que o cliente apenas responda um "Sim" ou "Não, obrigado". Qualquer resposta tira o botão de Spam da tela dele.
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowSafetyManual(false)}
                className="w-full py-4 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition"
              >
                Voltar para Configuração da Campanha
              </button>
            </div>
          ) : !isRunning ? (
            /* CONFIGURATION VIEW */
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <button 
                onClick={() => setShowSafetyManual(true)}
                className="w-full py-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#25D366] font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                🛡️ Ler Manual e Parâmetros Seguros Anti-Ban
              </button>

              {!activePhone && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-sm text-red-500 font-bold">⚠️ Atenção: WhatsApp não conectado.</p>
                  <p className="text-xs text-red-400 mt-1">Por favor, conecte o seu celular na tela principal antes de iniciar o disparo.</p>
                </div>
              )}

              {/* Filtros */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#5A5755] uppercase block mb-2">Escopo do Status</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] outline-none"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="frio">❄️ Apenas Frios</option>
                    <option value="contatado">📱 Apenas Contatados</option>
                    <option value="quente">🔥 Apenas Quentes</option>
                    <option value="negociacao">🤝 Apenas em Negociação</option>
                    <option value="fechado">✅ Apenas Fechados</option>
                    <option value="perdido">❌ Apenas Perdidos</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A5755] uppercase block mb-2">Escopo do Grupo</label>
                  <select 
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] outline-none"
                  >
                    <option value="all">Todos os Grupos/Bases</option>
                    {groups.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A5755] uppercase block mb-2">Escopo do Lote</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] outline-none"
                >
                  <option value="all">Todos os Lotes</option>
                  {batches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white/5 rounded-xl p-3 flex justify-between items-center border border-white/10">
                <span className="text-sm font-semibold text-[#A09D97]">Público Alvo Filtrado:</span>
                <span className="text-sm font-semibold text-[#F0EDE6]">{targetLeads.length} leads</span>
              </div>

              {/* Travar Opções Seguras (Checkmarks) */}
              <div className="bg-[#171717] rounded-xl border border-white/10 p-4 space-y-3">
                <p className="text-xs font-bold text-[#A09D97] uppercase mb-2">Pré-Definições de Segurança</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="preset" 
                    checked={presetOption === "new_account"} 
                    onChange={() => handlePresetChange("new_account")}
                    className="w-4 h-4 accent-[#9d4edd]"
                  />
                  <div>
                    <p className="text-sm text-[#F0EDE6] font-semibold">Vou usar uma conta nova</p>
                    <p className="text-xs text-[#5A5755]">Trava em Ultra Seguro + Limite 50/dia</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="preset" 
                    checked={presetOption === "safe_margins"} 
                    onChange={() => handlePresetChange("safe_margins")}
                    className="w-4 h-4 accent-[#25D366]"
                  />
                  <div>
                    <p className="text-sm text-[#F0EDE6] font-semibold">Quero manter margens seguras (Recomendado)</p>
                    <p className="text-xs text-[#5A5755]">Trava em Seguro + Limite 150/dia</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="preset" 
                    checked={presetOption === "none"} 
                    onChange={() => handlePresetChange("none")}
                    className="w-4 h-4 accent-[#FF3D57]"
                  />
                  <div>
                    <p className="text-sm text-[#F0EDE6] font-semibold">Avançado (Customizar)</p>
                    <p className="text-xs text-[#5A5755]">Permite alterar manualmente os limites de segurança.</p>
                  </div>
                </label>
              </div>

              {/* Mensagem */}
              <div>
                <label className="text-xs font-semibold text-[#5A5755] uppercase flex justify-between mb-2">
                  <span>Mensagem (Template)</span>
                  <span className="text-[#A09D97] lowercase">Use {'{{nome}}'} para inserir o nome</span>
                </label>
                <textarea 
                  value={messageTemplate}
                  onChange={e => setMessageTemplate(e.target.value)}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] outline-none resize-none"
                  placeholder="Ex: Olá {{nome}}, vi que você também participa do grupo X..."
                />
              </div>

              {/* Dropdowns (Delay e Volume) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#5A5755] uppercase block mb-2">Tempo de Espera</label>
                  <select 
                    value={delayOption}
                    onChange={e => setDelayOption(e.target.value as any)}
                    disabled={presetOption !== "none"}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] outline-none disabled:opacity-50"
                  >
                    <option value="risco-alto">Risco Alto (5 a 15s)</option>
                    <option value="seguro">Seguro (30 a 60s)</option>
                    <option value="ultra-seguro">Ultra Seguro (60 a 120s)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A5755] uppercase block mb-2">Volume Diário (Fila)</label>
                  <select 
                    value={volumeOption}
                    onChange={e => setVolumeOption(e.target.value as any)}
                    disabled={presetOption !== "none"}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-[#F0EDE6] focus:border-[#FF3D57] outline-none disabled:opacity-50"
                  >
                    <option value="50">Semana 1 (Máx 50/dia)</option>
                    <option value="150">Semana 2 (Máx 150/dia)</option>
                    <option value="200">Limite Crítico (Máx 200/dia)</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-[#A09D97]">
                💡 O sistema selecionará os primeiros <strong>{finalLeads.length} leads</strong> do escopo filtrado baseado no seu limite de volume diário.
              </p>

              {/* Actions */}
              <button 
                onClick={startCampaign}
                disabled={finalLeads.length === 0 || !activePhone}
                className="w-full py-4 rounded-xl font-bold bg-[#FF3D57] text-white hover:bg-[#FF3D57]/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                🚀 Iniciar Campanha para {finalLeads.length} Leads
              </button>
            </div>
          ) : (
            /* EXECUTION VIEW */
            <div className="space-y-6 text-center py-6">
              
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 w-32">
                  <div className="text-3xl font-black text-[#25D366]">{successCount}</div>
                  <div className="text-xs text-[#A09D97] mt-1 uppercase font-semibold">Sucesso</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 w-32">
                  <div className="text-3xl font-black text-[#F0EDE6]">{currentIndex} / {finalLeads.length}</div>
                  <div className="text-xs text-[#A09D97] mt-1 uppercase font-semibold">Processado</div>
                </div>
                <div className="bg-black/40 border border-[#FF3D57]/30 rounded-2xl p-6 w-32">
                  <div className="text-3xl font-black text-[#FF3D57]">{errorCount}</div>
                  <div className="text-xs text-[#FF3D57]/70 mt-1 uppercase font-semibold">Falhas</div>
                </div>
              </div>

              {isPaused ? (
                <div className="py-8">
                  <h3 className="text-xl font-bold text-[#F0EDE6] mb-2">Campanha Pausada ⏸️</h3>
                  <p className="text-sm text-[#A09D97]">O envio está congelado. Você pode retomar a qualquer momento.</p>
                </div>
              ) : (
                <div className="py-8">
                  <h3 className="text-xl font-bold text-[#F0EDE6] mb-2">Disparando Mensagens 🚀</h3>
                  <div className="w-full bg-white/10 rounded-full h-2 max-w-md mx-auto mb-4 overflow-hidden">
                    <div 
                      className="bg-[#25D366] h-2 transition-all duration-500 ease-out" 
                      style={{ width: `${(currentIndex / finalLeads.length) * 100}%` }}
                    ></div>
                  </div>
                  {nextShotIn !== null && (
                    <p className="text-sm text-[#A09D97]">
                      Próximo disparo em: <strong className="text-white text-lg">{nextShotIn}s</strong>
                    </p>
                  )}
                  {currentIndex < finalLeads.length && nextShotIn === null && (
                    <p className="text-sm text-[#A09D97] animate-pulse">Enviando agora...</p>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-4 border-t border-white/10 pt-8">
                {isPaused ? (
                  <button onClick={resumeCampaign} className="px-8 py-3 rounded-xl font-bold bg-[#25D366] text-black hover:bg-[#25D366]/90 transition">
                    ▶️ Retomar Disparos
                  </button>
                ) : (
                  <button onClick={pauseCampaign} className="px-8 py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition">
                    ⏸️ Pausar Campanha
                  </button>
                )}
                <button onClick={stopCampaign} className="px-8 py-3 rounded-xl font-bold border border-[#FF3D57] text-[#FF3D57] hover:bg-[#FF3D57]/10 transition">
                  ⏹️ Cancelar / Sair
                </button>
              </div>

              <p className="text-xs text-yellow-500 mt-6">
                ⚠️ IMPORTANTE: Não feche esta aba. O disparo é interrompido se a janela for fechada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
