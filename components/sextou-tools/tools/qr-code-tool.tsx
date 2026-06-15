"use client"

import { useEffect, useMemo, useState } from "react"
import QRCode from "qrcode"
import { HistoryList } from "@/components/sextou-tools/history-list"

type QrType =
  | "url"
  | "whatsapp"
  | "instagram"
  | "google-review"
  | "email"
  | "phone"
  | "sms"
  | "vcard"
  | "location"
  | "wifi"
  | "text"

interface QrCodeToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

const sizeMap = {
  small: 192,
  medium: 256,
  large: 320,
} as const

const initialForm = {
  url: "",
  whatsappPhone: "",
  whatsappMessage: "",
  instagramHandle: "",
  googleReviewUrl: "",
  emailAddress: "",
  emailSubject: "",
  emailBody: "",
  phoneNumber: "",
  smsNumber: "",
  smsMessage: "",
  vcardName: "",
  vcardCompany: "",
  vcardRole: "",
  vcardPhone: "",
  vcardEmail: "",
  vcardWebsite: "",
  vcardAddress: "",
  latitude: "",
  longitude: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiSecurity: "WPA",
  freeText: "",
  label: "",
}

function normalizePhone(raw: string) {
  const cleaned = raw.replace(/[^\d+]/g, "")
  if (cleaned.startsWith("+")) return cleaned
  if (cleaned.startsWith("1")) return `+${cleaned}`
  return `+1${cleaned}`
}

function buildQrPayload(type: QrType, form: typeof initialForm) {
  switch (type) {
    case "url":
      return form.url.trim()
    case "whatsapp": {
      const phone = normalizePhone(form.whatsappPhone)
      const digits = phone.replace(/[^\d]/g, "")
      const text = encodeURIComponent(form.whatsappMessage.trim())
      return `https://wa.me/${digits}${text ? `?text=${text}` : ""}`
    }
    case "instagram":
      return `https://instagram.com/${form.instagramHandle.trim().replace(/^@/, "")}`
    case "google-review":
      return form.googleReviewUrl.trim()
    case "email": {
      const subject = encodeURIComponent(form.emailSubject.trim())
      const body = encodeURIComponent(form.emailBody.trim())
      const query = [subject ? `subject=${subject}` : "", body ? `body=${body}` : ""]
        .filter(Boolean)
        .join("&")
      return `mailto:${form.emailAddress.trim()}${query ? `?${query}` : ""}`
    }
    case "phone":
      return `tel:${normalizePhone(form.phoneNumber)}`
    case "sms": {
      const body = encodeURIComponent(form.smsMessage.trim())
      return `sms:${normalizePhone(form.smsNumber)}${body ? `?body=${body}` : ""}`
    }
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${form.vcardName.trim()}`,
        form.vcardCompany.trim() ? `ORG:${form.vcardCompany.trim()}` : "",
        form.vcardRole.trim() ? `TITLE:${form.vcardRole.trim()}` : "",
        form.vcardPhone.trim() ? `TEL:${normalizePhone(form.vcardPhone)}` : "",
        form.vcardEmail.trim() ? `EMAIL:${form.vcardEmail.trim()}` : "",
        form.vcardWebsite.trim() ? `URL:${form.vcardWebsite.trim()}` : "",
        form.vcardAddress.trim() ? `ADR:;;${form.vcardAddress.trim()};;;;` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n")
    case "location":
      return `geo:${form.latitude.trim()},${form.longitude.trim()}`
    case "wifi":
      return `WIFI:T:${form.wifiSecurity};S:${form.wifiSsid.trim()};P:${form.wifiPassword.trim()};;`
    case "text":
      return form.freeText.trim()
    default:
      return ""
  }
}

function getSummary(type: QrType, form: typeof initialForm) {
  switch (type) {
    case "url":
      return form.url || "Link"
    case "whatsapp":
      return normalizePhone(form.whatsappPhone)
    case "instagram":
      return form.instagramHandle || "Instagram"
    case "google-review":
      return "Google Review"
    case "email":
      return form.emailAddress || "E-mail"
    case "phone":
      return normalizePhone(form.phoneNumber)
    case "sms":
      return normalizePhone(form.smsNumber)
    case "vcard":
      return form.vcardName || "Contato"
    case "location":
      return `${form.latitude || "lat"}, ${form.longitude || "lng"}`
    case "wifi":
      return form.wifiSsid || "Wi-Fi"
    case "text":
      return form.freeText.slice(0, 48) || "Texto livre"
    default:
      return "QR"
  }
}

export function QrCodeTool({ historyItems }: QrCodeToolProps) {
  const [qrType, setQrType] = useState<QrType>("url")
  const [form, setForm] = useState(initialForm)
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [qrSvg, setQrSvg] = useState("")
  const [size, setSize] = useState<keyof typeof sizeMap>("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Configure um QR e gere o preview.")
  const [localHistory, setLocalHistory] = useState(historyItems)

  const payload = useMemo(() => buildQrPayload(qrType, form), [form, qrType])

  useEffect(() => {
    let ignore = false

    async function generatePreview() {
      if (!payload) {
        setQrDataUrl("")
        setQrSvg("")
        return
      }

      try {
        const [dataUrl, svg] = await Promise.all([
          QRCode.toDataURL(payload, { width: sizeMap[size], margin: 1 }),
          QRCode.toString(payload, { type: "svg", width: sizeMap[size], margin: 1 }),
        ])

        if (!ignore) {
          setQrDataUrl(dataUrl)
          setQrSvg(svg)
        }
      } catch {
        if (!ignore) {
          setQrDataUrl("")
          setQrSvg("")
        }
      }
    }

    generatePreview()
    return () => {
      ignore = true
    }
  }, [payload, size])

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function saveExecution() {
    await fetch("/api/sextou-tools/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "gerador-qr-code",
        input: { qrType, size, label: form.label, summary: getSummary(qrType, form) },
        output: { payload, size: sizeMap[size] },
        metadata: {
          summary: getSummary(qrType, form),
          label: form.label || null,
        },
      }),
    })

    setLocalHistory((current) => [
      {
        title: "gerador qr code",
        subtitle: getSummary(qrType, form),
        timestamp: new Date().toLocaleString("pt-BR"),
      },
      ...current,
    ].slice(0, 8))
  }

  async function handleGenerate() {
    if (!payload) {
      setStatusMessage("Preencha os campos obrigatorios para gerar o QR Code.")
      return
    }

    setIsGenerating(true)
    try {
      await saveExecution()
      setStatusMessage("QR Code gerado e salvo no historico da sua conta.")
    } catch {
      setStatusMessage("QR Code gerado, mas nao foi possivel salvar no historico agora.")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopyPayload() {
    if (!payload) return
    await navigator.clipboard.writeText(payload)
    setStatusMessage("Conteudo copiado para a area de transferencia.")
  }

  function handleDownloadPng() {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = "sextou-tools-qr-code.png"
    link.click()
  }

  function handleDownloadSvg() {
    if (!qrSvg) return
    const blob = new Blob([qrSvg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sextou-tools-qr-code.svg"
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleClear() {
    setForm(initialForm)
    setQrType("url")
    setSize("medium")
    setStatusMessage("Formulario limpo.")
  }

  const commonFieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
      <section className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Tipo de QR Code</label>
            <select
              value={qrType}
              onChange={(event) => setQrType(event.target.value as QrType)}
              className={commonFieldClass}
            >
              <option value="url">URL</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="google-review">Google Review</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefone</option>
              <option value="sms">SMS</option>
              <option value="vcard">vCard</option>
              <option value="location">Localizacao</option>
              <option value="wifi">Wi-Fi</option>
              <option value="text">Texto livre</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Tamanho do QR</label>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as keyof typeof sizeMap)}
              className={commonFieldClass}
            >
              <option value="small">Pequeno</option>
              <option value="medium">Medio</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {qrType === "url" ? (
            <div className="md:col-span-2">
              <label className={labelClass}>Link</label>
              <input className={commonFieldClass} value={form.url} onChange={(e) => updateField("url", e.target.value)} placeholder="https://seusite.com" />
            </div>
          ) : null}

          {qrType === "whatsapp" ? (
            <>
              <div>
                <label className={labelClass}>Numero com codigo do pais</label>
                <input className={commonFieldClass} value={form.whatsappPhone} onChange={(e) => updateField("whatsappPhone", e.target.value)} placeholder="+1 407 555 0199" />
              </div>
              <div>
                <label className={labelClass}>Mensagem padrao</label>
                <input className={commonFieldClass} value={form.whatsappMessage} onChange={(e) => updateField("whatsappMessage", e.target.value)} placeholder="Oi, vim pelo Sextou Tools" />
              </div>
            </>
          ) : null}

          {qrType === "instagram" ? (
            <div className="md:col-span-2">
              <label className={labelClass}>Usuario do Instagram</label>
              <input className={commonFieldClass} value={form.instagramHandle} onChange={(e) => updateField("instagramHandle", e.target.value)} placeholder="@seuperfil" />
            </div>
          ) : null}

          {qrType === "google-review" ? (
            <div className="md:col-span-2">
              <label className={labelClass}>Link do Google Review</label>
              <input className={commonFieldClass} value={form.googleReviewUrl} onChange={(e) => updateField("googleReviewUrl", e.target.value)} placeholder="https://g.page/r/..." />
            </div>
          ) : null}

          {qrType === "email" ? (
            <>
              <div>
                <label className={labelClass}>E-mail</label>
                <input className={commonFieldClass} value={form.emailAddress} onChange={(e) => updateField("emailAddress", e.target.value)} placeholder="contato@empresa.com" />
              </div>
              <div>
                <label className={labelClass}>Assunto</label>
                <input className={commonFieldClass} value={form.emailSubject} onChange={(e) => updateField("emailSubject", e.target.value)} placeholder="Quero saber mais" />
              </div>
            </>
          ) : null}

          {qrType === "email" ? (
            <div className="md:col-span-2">
              <label className={labelClass}>Mensagem</label>
              <textarea className="min-h-[120px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.emailBody} onChange={(e) => updateField("emailBody", e.target.value)} placeholder="Mensagem padrao do e-mail" />
            </div>
          ) : null}

          {qrType === "phone" ? (
            <div className="md:col-span-2">
              <label className={labelClass}>Telefone</label>
              <input className={commonFieldClass} value={form.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} placeholder="+1 407 555 0199" />
            </div>
          ) : null}

          {qrType === "sms" ? (
            <>
              <div>
                <label className={labelClass}>Numero</label>
                <input className={commonFieldClass} value={form.smsNumber} onChange={(e) => updateField("smsNumber", e.target.value)} placeholder="+1 407 555 0199" />
              </div>
              <div>
                <label className={labelClass}>Mensagem</label>
                <input className={commonFieldClass} value={form.smsMessage} onChange={(e) => updateField("smsMessage", e.target.value)} placeholder="Quero um orcamento" />
              </div>
            </>
          ) : null}

          {qrType === "vcard" ? (
            <>
              <div><label className={labelClass}>Nome</label><input className={commonFieldClass} value={form.vcardName} onChange={(e) => updateField("vcardName", e.target.value)} /></div>
              <div><label className={labelClass}>Empresa</label><input className={commonFieldClass} value={form.vcardCompany} onChange={(e) => updateField("vcardCompany", e.target.value)} /></div>
              <div><label className={labelClass}>Cargo</label><input className={commonFieldClass} value={form.vcardRole} onChange={(e) => updateField("vcardRole", e.target.value)} /></div>
              <div><label className={labelClass}>Telefone</label><input className={commonFieldClass} value={form.vcardPhone} onChange={(e) => updateField("vcardPhone", e.target.value)} /></div>
              <div><label className={labelClass}>E-mail</label><input className={commonFieldClass} value={form.vcardEmail} onChange={(e) => updateField("vcardEmail", e.target.value)} /></div>
              <div><label className={labelClass}>Website</label><input className={commonFieldClass} value={form.vcardWebsite} onChange={(e) => updateField("vcardWebsite", e.target.value)} /></div>
              <div className="md:col-span-2"><label className={labelClass}>Endereco</label><input className={commonFieldClass} value={form.vcardAddress} onChange={(e) => updateField("vcardAddress", e.target.value)} /></div>
            </>
          ) : null}

          {qrType === "location" ? (
            <>
              <div><label className={labelClass}>Latitude</label><input className={commonFieldClass} value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} placeholder="28.5383" /></div>
              <div><label className={labelClass}>Longitude</label><input className={commonFieldClass} value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} placeholder="-81.3792" /></div>
            </>
          ) : null}

          {qrType === "wifi" ? (
            <>
              <div><label className={labelClass}>Nome da rede</label><input className={commonFieldClass} value={form.wifiSsid} onChange={(e) => updateField("wifiSsid", e.target.value)} /></div>
              <div><label className={labelClass}>Senha</label><input className={commonFieldClass} value={form.wifiPassword} onChange={(e) => updateField("wifiPassword", e.target.value)} /></div>
              <div className="md:col-span-2">
                <label className={labelClass}>Seguranca</label>
                <select className={commonFieldClass} value={form.wifiSecurity} onChange={(e) => updateField("wifiSecurity", e.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Sem senha</option>
                </select>
              </div>
            </>
          ) : null}

          {qrType === "text" ? (
            <div className="md:col-span-2">
              <label className={labelClass}>Texto livre</label>
              <textarea className="min-h-[120px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={form.freeText} onChange={(e) => updateField("freeText", e.target.value)} placeholder="Digite o texto que o QR deve carregar" />
            </div>
          ) : null}

          <div className="md:col-span-2">
            <label className={labelClass}>Label abaixo do QR</label>
            <input className={commonFieldClass} value={form.label} onChange={(e) => updateField("label", e.target.value)} placeholder="Ex.: Fale conosco no WhatsApp" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleGenerate} disabled={isGenerating} className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isGenerating ? "Salvando..." : "Gerar QR Code"}
          </button>
          <button type="button" onClick={handleDownloadPng} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10">
            Baixar PNG
          </button>
          <button type="button" onClick={handleDownloadSvg} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10">
            Baixar SVG
          </button>
          <button type="button" onClick={handleCopyPayload} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10">
            Copiar conteudo
          </button>
          <button type="button" onClick={handleClear} className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6]">
            Limpar
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">
          {statusMessage}
        </p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Preview em tempo real</p>
          <div className="mt-5 rounded-[22px] border border-white/10 bg-white p-6 text-center">
            {qrDataUrl ? (
              <>
                <img src={qrDataUrl} alt="QR Code preview" className="mx-auto h-auto max-w-full" />
                {form.label ? (
                  <p className="mt-4 text-sm font-semibold text-[#171717]">{form.label}</p>
                ) : null}
              </>
            ) : (
              <div className="rounded-[16px] border-2 border-dashed border-slate-200 p-8 text-sm text-slate-500">
                O preview aparece assim que o conteudo do QR ficar valido.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Historico recente</p>
          <div className="mt-4">
            <HistoryList items={localHistory} />
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6 text-sm leading-7 text-[#A09D97]">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Aviso</p>
          <p className="mt-4">
            QR de Wi-Fi incorpora a senha no codigo. Use apenas em redes destinadas ao compartilhamento.
          </p>
        </div>
      </aside>
    </div>
  )
}
