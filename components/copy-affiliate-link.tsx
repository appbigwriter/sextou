"use client"

import { useState } from "react"

interface CopyAffiliateLinkProps {
  link: string
}

export function CopyAffiliateLink({ link }: CopyAffiliateLinkProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback para navegadores sem suporte à Clipboard API
      const textarea = document.createElement("textarea")
      textarea.value = link
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        type="text"
        readOnly
        value={link}
        className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700 truncate"
      />
      <button
        type="button"
        onClick={handleCopy}
        title="Copiar link"
        className={`flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
          copied
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 hover:bg-[#F97316]/20"
        }`}
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copiado!
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copiar
          </>
        )}
      </button>
    </div>
  )
}
