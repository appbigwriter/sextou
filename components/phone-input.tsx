"use client"

import { useState, useEffect } from "react"

// Códigos de país mais comuns para brasileiros nos EUA e Brasil
const COUNTRY_CODES = [
  { code: "+1",   flag: "🇺🇸", label: "EUA / Canadá",     country: "US" },
  { code: "+55",  flag: "🇧🇷", label: "Brasil",            country: "BR" },
  { code: "+52",  flag: "🇲🇽", label: "México",            country: "MX" },
  { code: "+54",  flag: "🇦🇷", label: "Argentina",         country: "AR" },
  { code: "+351", flag: "🇵🇹", label: "Portugal",          country: "PT" },
  { code: "+44",  flag: "🇬🇧", label: "Reino Unido",       country: "GB" },
  { code: "+34",  flag: "🇪🇸", label: "Espanha",           country: "ES" },
  { code: "+49",  flag: "🇩🇪", label: "Alemanha",          country: "DE" },
  { code: "+33",  flag: "🇫🇷", label: "França",            country: "FR" },
  { code: "+39",  flag: "🇮🇹", label: "Itália",            country: "IT" },
  { code: "+61",  flag: "🇦🇺", label: "Austrália",         country: "AU" },
  { code: "+81",  flag: "🇯🇵", label: "Japão",             country: "JP" },
]

interface PhoneInputProps {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  defaultCountryCode?: string
  className?: string
}

/**
 * Input de telefone com seletor de código de país obrigatório.
 * O valor emitido pelo onChange já inclui o código de país (ex: "+1 (555) 123-4567").
 * Se o valor inicial já começar com "+", tenta identificar o código automaticamente.
 */
export function PhoneInput({
  id,
  name,
  value,
  onChange,
  required,
  placeholder,
  defaultCountryCode = "+1",
  className,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState(defaultCountryCode)
  const [localNumber, setLocalNumber] = useState("")

  // Parse inicial: separa código do número se o value já vier preenchido
  useEffect(() => {
    if (!value) {
      setLocalNumber("")
      return
    }
    const matched = COUNTRY_CODES.find((c) => value.startsWith(c.code))
    if (matched) {
      setCountryCode(matched.code)
      setLocalNumber(value.slice(matched.code.length).trim())
    } else if (value.startsWith("+")) {
      // Código não listado — mantém como está no localNumber
      setLocalNumber(value)
    } else {
      setLocalNumber(value)
    }
    // Só roda no mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setLocalNumber(raw)
    onChange(raw ? `${countryCode} ${raw}`.trim() : "")
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value
    setCountryCode(newCode)
    onChange(localNumber ? `${newCode} ${localNumber}`.trim() : "")
  }

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode)

  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      {/* Seletor de código de país */}
      <div className="relative flex-shrink-0">
        <select
          value={countryCode}
          onChange={handleCodeChange}
          required={required}
          aria-label="Código do país"
          className="h-10 appearance-none rounded-md border border-input bg-background pl-2 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316] cursor-pointer"
          style={{ minWidth: "90px" }}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        {/* Seta customizada */}
        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
      </div>

      {/* Campo do número */}
      <div className="flex-1 relative">
        <input
          id={id}
          name={name}
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          required={required}
          placeholder={placeholder ?? (selectedCountry?.country === "BR" ? "(11) 91234-5678" : "(555) 123-4567")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  )
}
