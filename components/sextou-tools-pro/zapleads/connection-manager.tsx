"use client"

import { useState, useEffect } from "react"
import { initiateWhatsAppConnection } from "@/app/sextou-tools-pro/zapleads/actions"

export function ZapLeadsConnectionManager({ initialStatus }: { initialStatus?: string }) {
  const [agreed, setAgreed] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [status, setStatus] = useState(initialStatus || "disconnected")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        // Bate no /qr: ele expõe status + qrCodeUrl assim que o puppeteer emitir o evento "qr"
        const res = await fetch("/api/zapleads/whatsapp/qr")
        const data = await res.json()

        if (!res.ok) {
          setErrorMsg(data.error || `Falha (${res.status}) ao consultar conexão.`)
          return
        }

        if (data.lastError) setErrorMsg(data.lastError)

        if (data.status === "CONNECTED") {
          setStatus("CONNECTED")
          setQrCodeUrl(null)
          setErrorMsg(null)
        } else if (data.status === "AWAITING_QR" && data.qrCodeUrl) {
          const QRCode = await import("qrcode")
          const url = await QRCode.default.toDataURL(data.qrCodeUrl)
          setQrCodeUrl(url)
          setErrorMsg(null)
        } else if (data.status === "DISCONNECTED" && status === "CONNECTED") {
          setStatus("DISCONNECTED")
          setQrCodeUrl(null)
        }
      } catch (err) {}
    }

    if (status === "AWAITING_QR" || status === "CONNECTED") {
      interval = setInterval(checkStatus, 3000)
    }

    return () => clearInterval(interval)
  }, [status])

  const handleDisconnect = async () => {
    if (!confirm("Desconectar a conta do WhatsApp? Será necessário escanear o QR Code novamente para reconectar.")) {
      return
    }
    setDisconnecting(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/zapleads/whatsapp/disconnect", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || "Falha ao desconectar.")
        return
      }
      setStatus("DISCONNECTED")
      setQrCodeUrl(null)
    } catch (err) {
      setErrorMsg("Erro ao desconectar.")
    } finally {
      setDisconnecting(false)
    }
  }

  const handleConnect = async () => {
    setConnecting(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/zapleads/whatsapp/qr")
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || `Falha (${res.status}) ao iniciar conexão.`)
        return
      }
      if (data.lastError) setErrorMsg(data.lastError)

      if (data.status === "AWAITING_QR" && data.qrCodeUrl) {
        import("qrcode").then((QRCode) => {
          QRCode.default.toDataURL(data.qrCodeUrl)
            .then((url) => {
              setQrCodeUrl(url)
              setStatus("AWAITING_QR")
            })
            .catch((err) => console.error(err))
        })
      } else if (data.status === "CONNECTED") {
        setStatus("CONNECTED")
      } else {
        setStatus("AWAITING_QR")
      }
    } catch (err) {
      console.error(err)
      alert("Erro ao iniciar conexao.")
    } finally {
      setConnecting(false)
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

      {status === "CONNECTED" ? (
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
      ) : !qrCodeUrl ? (
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
            onClick={handleConnect}
            disabled={!agreed || connecting}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? "Gerando QR Code..." : "Conectar via QR Code"}
          </button>
        </div>
      ) : (
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
              setStatus("disconnected")
            }}
            className="mt-6 h-10 px-4 text-sm font-semibold text-[#FF3D57] hover:underline"
          >
            Cancelar Conexao
          </button>
        </div>
      )}
    </div>
  )
}
