"use client"

import { useState, useEffect } from "react"

interface Group {
  id: string
  name: string
}

export function ZapLeadsGroupExtractor({ connectionId }: { connectionId?: string }) {
  const [purpose, setPurpose] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const [result, setResult] = useState<{ imported: number, total: number } | null>(null)
  // Fonte de verdade da conexão é a engine em memória (por usuário), não o registro
  // do banco — por isso consultamos o status real em vez de depender do connectionId.
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let active = true

    const checkStatus = async () => {
      try {
        const res = await fetch("/api/zapleads/whatsapp/status")
        if (!res.ok) return
        const data = await res.json()
        if (active) setIsConnected(data.status === "CONNECTED")
      } catch {}
    }

    checkStatus()
    const interval = setInterval(checkStatus, 3000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const handleLoadGroups = async () => {
    if (!isConnected) {
      alert("Conecte o WhatsApp primeiro!")
      return
    }

    setIsLoadingGroups(true)
    try {
      const res = await fetch("/api/zapleads/whatsapp/groups")
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar grupos")
      }
      
      setGroups(data.groups)
      if (data.groups.length > 0) {
        setSelectedGroupId(data.groups[0].id)
      }
    } catch (err: any) {
      alert(err.message || "Erro desconhecido")
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const handleExtract = async () => {
    if (!isConnected) {
      alert("Conecte o WhatsApp primeiro!")
      return
    }

    if (!selectedGroupId) {
      alert("Selecione um grupo primeiro!")
      return
    }

    setIsExtracting(true)
    
    try {
      const res = await fetch("/api/zapleads/whatsapp/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, purpose, groupId: selectedGroupId })
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Erro ao extrair")
      }
      
      setResult({ imported: data.leadsExtracted, total: data.totalMembers || data.leadsExtracted })
      // Notifica o Kanban (componente irmão) para recarregar os leads recém-extraídos.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("zapleads:extracted"))
      }
    } catch (err: any) {
      alert(err.message || "Erro desconhecido")
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6 mt-6 max-w-xl">
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">
        Extracao de Grupos
      </p>

      {!result ? (
        <div className="mt-4">
          <p className="text-sm text-[#A09D97] mb-4">
            Carregue seus grupos do WhatsApp, selecione o alvo e inicie o aquecimento de leads.
          </p>
          
          {!isConnected && (
            <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200/80">
              Conecte o WhatsApp no painel ao lado para liberar a extração de grupos.
            </p>
          )}

          {groups.length === 0 ? (
            <button
              onClick={handleLoadGroups}
              disabled={isLoadingGroups || !isConnected}
              className="mt-2 mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingGroups ? "Buscando grupos no celular..." : "Carregar Lista de Grupos"}
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#F0EDE6] mb-2">
                  Selecione o Grupo
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-[#F0EDE6] focus:border-[#FF3D57] focus:outline-none focus:ring-1 focus:ring-[#FF3D57]"
                >
                  <option value="" disabled>Escolha um grupo...</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F0EDE6] mb-2">
                  Proposito da Abordagem
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Ex: Oferecer plano de mentoria VIP para quem participou do desafio."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-[#F0EDE6] placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:outline-none focus:ring-1 focus:ring-[#FF3D57]"
                  rows={3}
                />
              </div>
              
              <button
                onClick={handleExtract}
                disabled={isExtracting || !selectedGroupId}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExtracting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                    Extraindo do celular...
                  </span>
                ) : "Extrair Grupo Selecionado"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-[22px] border border-[#25D366]/20 bg-[#25D366]/10 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#25D366]">
            Extracao Concluida
          </p>
          <p className="mt-2 text-sm leading-6 text-[#F0EDE6]">
            Foram identificados <strong>{result.total} membros</strong> no grupo.
            <br/>
            Desses, <strong>{result.imported} leads</strong> foram importados com sucesso para o seu funil de CRM (esquenta).
          </p>
          <button
            onClick={() => {
              setPurpose("")
              setResult(null)
            }}
            className="mt-4 text-sm font-semibold text-[#25D366] hover:underline"
          >
            Realizar nova extracao
          </button>
        </div>
      )}
    </div>
  )
}
