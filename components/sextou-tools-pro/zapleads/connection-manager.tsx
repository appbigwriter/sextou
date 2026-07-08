"use client"

import { useState, useEffect, useRef } from "react"

type ConnStatus = "checking" | "DISCONNECTED" | "AWAITING_QR" | "CONNECTED"

export function ZapLeadsConnectionManager() {
  const [agreed, setAgreed] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<ConnStatus>("checking")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)

  // Refs para evitar closures obsoletas dentro dos timers.
  const statusRef = useRef<ConnStatus>("checking")
  const qrRef = useRef<string | null>(null)
  useEffect(() => {
    statusRef.current = status
    qrRef.current = qrCodeUrl
  }, [status, qrCodeUrl])

  // Converte o code raw do WhatsApp em imagem (data-URL) para exibir.
  const renderQr = async (code: string): Promise<string> => {
    const QRCode = await import("qrcode")
    return QRCode.default.toDataURL(code)
  }

  // ── Poll de estado REAL (endpoint somente-leitura, não mexe na instância) ──
  // Roda o tempo todo enquanto o componente está montado: detecta conexão
  // (durante o scan do QR) e também quedas (enquanto conectado).
  useEffect(() => {
    let mounted = true

    const tick = async () => {
      try {
        const res = await fetch("/api/zapleads/whatsapp/status")
        if (!mounted) return
        const data = await res.json()
        if (!res.ok) return

        const s: string = data.status
        if (s === "CONNECTED") {
          setStatus("CONNECTED")
          setQrCodeUrl(null)
          setErrorMsg(null)
        } else if (s === "AWAITING_QR") {
          // Instância em "connecting". Só exibimos o QR se o usuário iniciou o
          // fluxo (temos um QR na tela). Caso contrário, tratamos como pronto
          // para conectar — nunca reabrimos um QR sozinho, respeitando o Termo.
          setStatus((prev) => (prev === "AWAITING_QR" && qrRef.current ? prev : "DISCONNECTED"))
        } else {
          // DISCONNECTED: não derruba um QR ativo que o usuário está escaneando.
          setStatus((prev) => (prev === "AWAITING_QR" && qrRef.current ? prev : "DISCONNECTED"))
        }
      } catch {
        // Evolution/rede indisponível: não altera a tela abruptamente.
      }
    }

    tick()
    const id = setInterval(tick, 4000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  // ── Renovação do QR ──
  // O QR do WhatsApp expira em ~20s. Enquanto aguardando scan, renovamos a cada
  // 25s (e NÃO a cada 3s como antes, que invalidava o código antes do scan e
  // esgotava o QRCODE_LIMIT da Evolution).
  useEffect(() => {
    if (status !== "AWAITING_QR" || !qrCodeUrl) return
    const id = setInterval(() => {
      requestQr()
    }, 25000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, qrCodeUrl])

  // Solicita (ou renova) o QR — única rota que cria/reconecta a instância.
  const requestQr = async () => {
    setConnecting(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/zapleads/whatsapp/qr")
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.lastError || data.error || `Falha (${res.status}) ao iniciar conexão.`)
        return
      }
      if (data.lastError) setErrorMsg(data.lastError)

      if (data.status === "CONNECTED") {
        setStatus("CONNECTED")
        setQrCodeUrl(null)
        return
      }

      if (data.qrCodeUrl) {
        const img = await renderQr(data.qrCodeUrl)
        setQrCodeUrl(img)
        setStatus("AWAITING_QR")
      } else {
        // Instância criada, mas a Evolution ainda não emitiu o QR: o poll de
        // status cuidará de trazê-lo/atualizar a tela.
        setStatus("AWAITING_QR")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Erro ao iniciar conexão.")
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm("Desconectar a conta do WhatsApp? Será necessário escanear o QR Code novamente para reconectar.")) {
      return
    }
    setDisconnecting(true)
    setErrorMsg(null)
    // Otimista: reflete a desconexão na hora, sem esperar a Evolution.
    setStatus("DISCONNECTED")
    setQrCodeUrl(null)
    try {
      const res = await fetch("/api/zapleads/whatsapp/disconnect", { method: "POST" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || "Falha ao desconectar.")
      }
    } catch (err) {
      setErrorMsg("Erro ao desconectar.")
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6 max-w-xl">
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5A5755]">
        Conexao WhatsApp
      </p>

      {errorMsg && (
        <div className="mt-4 rounded-xl border border-[#FF3D57]/30 bg-[#FF3D57]/10 p-3">
          <p className="text-sm font-semibold text-[#FF3D57]">Falha na conexão</p>
          <p className="mt-1 break-words text-xs text-[#FF3D57]/80">{errorMsg}</p>
          <p className="mt-2 text-[11px] text-[#A09D97]">
            Diagnóstico completo:{" "}
            <a href="/api/zapleads/whatsapp/diag" target="_blank" rel="noreferrer" className="underline">
              /api/zapleads/whatsapp/diag
            </a>
          </p>
        </div>
      )}

      {status === "checking" ? (
        <div className="mt-6 flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#25D366]"></span>
          <p className="text-sm text-[#A09D97]">Verificando conexão...</p>
        </div>
      ) : status === "CONNECTED" ? (
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/20">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <p className="font-semibold text-[#F0EDE6]">WhatsApp Conectado</p>
              <p className="text-sm text-[#A09D97]">Sessao ativa e pronta para operacao.</p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="mt-6 flex h-10 w-full items-center justify-center rounded-2xl border border-[#FF3D57]/30 bg-[#FF3D57]/10 px-4 text-sm font-semibold text-[#FF3D57] transition hover:bg-[#FF3D57]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {disconnecting ? "Desconectando..." : "Desconectar WhatsApp"}
          </button>
        </div>
      ) : status === "AWAITING_QR" && qrCodeUrl ? (
        <div className="mt-6 flex flex-col items-center">
          <div className="rounded-[22px] border border-white/10 bg-white/5 p-6 flex flex-col items-center gap-4">
            <img src={qrCodeUrl} alt="WhatsApp QR Code" className="h-[200px] w-[200px] rounded-lg bg-white p-2" />
            <p className="text-center text-sm text-[#A09D97]">
              Abra o WhatsApp no seu celular, va em Dispositivos Conectados e escaneie o codigo acima.
            </p>
          </div>
          <button
            onClick={() => {
              setQrCodeUrl(null)
              setStatus("DISCONNECTED")
            }}
            className="mt-6 h-10 px-4 text-sm font-semibold text-[#FF3D57] hover:underline"
          >
            Cancelar Conexao
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div className="rounded-[16px] border border-amber-500/20 bg-amber-500/10 p-4">
            <h3 className="text-sm font-bold text-amber-500">Termo de Risco e LGPD</h3>
            <p className="mt-2 text-xs leading-5 text-amber-200/80">
              A extracao de contatos via Modo Web (WhatsApp Web) pode gerar riscos de banimento temporario pelo Meta se utilizada com alta volumetria. Voce confirma que utilizara a ferramenta respeitando a LGPD, com o unico proposito de abordagem comercial etica?
            </p>
            <label className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-[#FF3D57]"
              />
              <span className="text-sm text-[#F0EDE6]">
                Li, compreendo o risco e aceito as politicas.
              </span>
            </label>
          </div>

          <button
            onClick={requestQr}
            disabled={!agreed || connecting}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? "Gerando QR Code..." : "Conectar via QR Code"}
          </button>
        </div>
      )}
    </div>
  )
}
