"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Sparkles, Loader2, Check, Download, History, FileText, Mail, Send, ChevronRight, ArrowLeft } from "lucide-react"

interface BrandScriptData {
  id: string
  version: number
  heroWant: string
  problemExternal: string
  problemInternal: string
  problemPhilosophical: string
  villain: string | null
  empathy: string
  authority: any // JSON
  planProcess: any // JSON
  planAgreement: any // JSON
  ctaDirect: string
  ctaTransitional: string | null
  stakes: any // JSON
  success: any // JSON
  oneLiner: string
}

interface CollateralData {
  id: string
  wireframe: any // JSON
  leadGenerator: any // JSON
  nurtureEmails: any // JSON
  salesEmails: any // JSON
}

interface VersionItem {
  id: string
  version: number
  createdAt: Date
  isCurrent: boolean
}

export function StoryBrandResultClient({
  projectId,
  project,
  brandScript,
  collateral,
  versions
}: {
  projectId: string
  project: any
  brandScript: BrandScriptData
  collateral: CollateralData
  versions: VersionItem[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"brandscript" | "wireframe" | "lead" | "emails_sales" | "emails_nurture">("brandscript")
  const [copiedText, setCopiedText] = useState<string | null>(null)
  
  // States de refinamento parcial
  const [refineInstructions, setRefineInstructions] = useState<Record<string, string>>({})
  const [loadingSection, setLoadingSection] = useState<string | null>(null)
  
  // State de exportação e celebração (para Story 8)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(key)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleRefineSection = async (sectionKey: string) => {
    const instruction = refineInstructions[sectionKey]
    if (!instruction?.trim()) return

    setLoadingSection(sectionKey)
    try {
      const response = await fetch(`/api/storybrand-strategy-generator/projects/${projectId}/regenerate-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey, instruction })
      })

      if (!response.ok) {
        throw new Error("Erro ao refinar seção")
      }

      setRefineInstructions(prev => ({ ...prev, [sectionKey]: "" }))
      window.location.reload()
    } catch (err) {
      alert("Erro ao refinar a seção. Tente novamente.")
    } finally {
      setLoadingSection(null)
    }
  }

  const handleExport = async (format: "md" | "html" | "pdf" | "docx") => {
    setIsExporting(true)
    try {
      const response = await fetch(
        `/api/storybrand-strategy-generator/projects/${projectId}/export?format=${format}&version=${brandScript.version}`
      )

      if (!response.ok) {
        throw new Error("Erro ao gerar exportação")
      }

      if (format === "pdf" || format === "html") {
        window.open(`/api/storybrand-strategy-generator/projects/${projectId}/export?format=${format}&version=${brandScript.version}`, "_blank")
      } else {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const ext = format === "docx" ? "doc" : format
        a.download = `estrategia-sb7-${project.name.toLowerCase().replace(/\s+/g, "-")}.${ext}`
        a.click()
        URL.revokeObjectURL(url)
      }

      setShowCelebration(true)
    } catch (err) {
      alert("Erro ao realizar exportação. Tente novamente.")
    } finally {
      setIsExporting(false)
    }
  }

  // Parses de arrays seguros
  const planSteps = Array.isArray(brandScript.planProcess) ? brandScript.planProcess : []
  const planAgreements = Array.isArray(brandScript.planAgreement) ? brandScript.planAgreement : []
  const stakesList = Array.isArray(brandScript.stakes) ? brandScript.stakes : []
  const authList = Array.isArray(brandScript.authority) ? brandScript.authority : []
  const successData = typeof brandScript.success === "object" && brandScript.success ? brandScript.success as any : { concrete: "", identity: "" }
  
  const wireframeList = Array.isArray(collateral.wireframe) ? collateral.wireframe : []
  const leadGen = typeof collateral.leadGenerator === "object" && collateral.leadGenerator ? collateral.leadGenerator as any : { title: "", format: "", outline: [] }
  const nurtureEmails = Array.isArray(collateral.nurtureEmails) ? collateral.nurtureEmails : []
  const salesEmails = Array.isArray(collateral.salesEmails) ? collateral.salesEmails : []

  return (
    <div className="space-y-8 relative">
      
      {/* TELA DE CELEBRAÇÃO V2 (STORY 8) */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-filter backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="celebrate w-full max-w-lg rounded-[28px] p-8 text-center shadow-2xl relative bg-gradient-to-br from-[#FF3D57] via-[#9B6DFF] to-[#4A9EFF]">
            <div className="celebrate-emoji text-6xl mb-4">🎉</div>
            <h2 className="celebrate-title text-3xl font-extrabold text-white mb-2">Sua Estratégia está Pronta!</h2>
            <p className="celebrate-sub text-sm text-white/90 mb-8 max-w-sm mx-auto leading-relaxed">
              Parabéns! Exportamos o seu BrandScript de Donald Miller com sucesso. Salve o arquivo e comece a aplicar hoje no seu negócio.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowCelebration(false)}
                className="inline-flex h-[54px] w-full items-center justify-center rounded-2xl bg-white text-black font-bold text-sm shadow-md transition hover:bg-white/90"
              >
                Voltar à Estratégia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER DE AÇÕES */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6">
        <div>
          <span className="font-mono text-xs text-[#5A5755] uppercase tracking-wider">Resultado da IA Pro</span>
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-[#F0EDE6] mt-1">
            Estratégia: {project.name}
          </h1>
          <div className="text-xs text-[#A09D97] mt-1.5 flex flex-wrap items-center gap-2">
            <History className="h-4 w-4 text-[#FF3D57]" />
            <span>Versão:</span>
            <select
              value={brandScript.version}
              onChange={(e) => {
                const v = e.target.value
                router.push(`/sextou-tools-pro/storybrand-strategy-generator/${projectId}/result?version=${v}`)
              }}
              className="bg-[#171717] border border-white/10 rounded-lg px-2 py-1 text-xs text-[#F0EDE6] outline-none focus:border-[#FF3D57] cursor-pointer"
            >
              {versions.map(v => (
                <option key={v.id} value={v.version}>
                  v{v.version} ({new Date(v.createdAt).toLocaleDateString("pt-BR")}) {v.isCurrent ? " (Atual)" : ""}
                </option>
              ))}
            </select>
            <span className="text-white/10">|</span>
            <span>Idioma: {project.language} · Voz: {project.brandVoice}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => router.push("/sextou-tools-pro/storybrand-strategy-generator")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#171717] border border-white/5 px-4 h-[44px] text-xs font-bold text-[#F0EDE6] transition hover:bg-white/5"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#FF3D57]" /> Voltar ao Início
          </button>
          <button
            onClick={() => handleExport("md")}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#171717] border border-white/5 px-4 h-[44px] text-xs font-bold text-[#F0EDE6] transition hover:bg-white/5 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Markdown
          </button>
          <button
            onClick={() => handleExport("docx")}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#171717] border border-white/5 px-4 h-[44px] text-xs font-bold text-[#F0EDE6] transition hover:bg-white/5 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Word
          </button>
          <button
            onClick={() => handleExport("html")}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#171717] border border-white/5 px-4 h-[44px] text-xs font-bold text-[#F0EDE6] transition hover:bg-white/5 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Web (HTML)
          </button>
          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="btn-grad inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-4 h-[44px] text-xs font-bold text-white transition hover:opacity-95 shadow-md shadow-orange-500/10 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Imprimir / PDF
          </button>
        </div>
      </div>

      {/* ABAS DO SISTEMA V2 */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/5 pb-3 scrollbar-none">
        {[
          { id: "brandscript", label: "BrandScript SB7", icon: FileText },
          { id: "wireframe", label: "Homepage Site", icon: FileText },
          { id: "lead", label: "Isca Digital", icon: Sparkles },
          { id: "emails_sales", label: "E-mails Vendas", icon: Mail },
          { id: "emails_nurture", label: "E-mails Nutrição", icon: Mail },
        ].map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`h-11 px-5 rounded-full text-xs font-bold flex items-center gap-2 border whitespace-nowrap transition ${
                active
                  ? "bg-[#FF3D57] border-transparent text-white"
                  : "bg-[#171717] border-white/5 text-[#A09D97] hover:border-white/10"
              }`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* ABA 1: BRANDSCRIPT & ONE LINER */}
      {activeTab === "brandscript" && (
        <div className="space-y-6">
          {/* ONE LINER DE IMPACTO */}
          <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#FF8C00] font-semibold uppercase tracking-wider">One-Liner da Marca (SB7)</span>
              <button
                onClick={() => handleCopy(brandScript.oneLiner, "oneLiner")}
                className="text-xs text-[#A09D97] hover:text-white flex items-center gap-1 transition"
              >
                {copiedText === "oneLiner" ? <Check className="h-4 w-4 text-[#1FBA7A]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="font-display text-lg font-bold text-[#F0EDE6] leading-relaxed">
              "{brandScript.oneLiner}"
            </p>
            
            {/* REFINAR ONE-LINER */}
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
              <input
                type="text"
                className="flex-1 bg-[#1F1F1F] border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-[#FF3D57]"
                placeholder="Ex: Torne o One-liner mais curto ou focado em serviço..."
                value={refineInstructions.oneLiner || ""}
                onChange={(e) => setRefineInstructions(prev => ({ ...prev, oneLiner: e.target.value }))}
                disabled={loadingSection === "oneLiner"}
              />
              <button
                onClick={() => handleRefineSection("oneLiner")}
                disabled={loadingSection === "oneLiner"}
                className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition border border-white/10 disabled:opacity-50"
              >
                {loadingSection === "oneLiner" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#FFD600]" />} Refinar
              </button>
            </div>
          </div>

          {/* GRID COM OS 7 ELEMENTOS DO LIVRO */}
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: "1. O Herói (Desejo Único)", content: brandScript.heroWant },
              { title: "2. O Problema Externo", content: brandScript.problemExternal },
              { title: "2. O Problema Interno", content: brandScript.problemInternal },
              { title: "2. O Problema Filosófico", content: brandScript.problemPhilosophical },
              { title: "2. O Vilão", content: brandScript.villain || "Não definido" },
              { title: "3. O Guia (Empatia)", content: brandScript.empathy },
              { title: "3. O Guia (Autoridade)", content: authList.map((a: any) => `${a.type}: ${a.value}`).join(" | ") || "Sem dados de autoridade específicos" },
              { title: "4. O Plano (3 Passos)", content: planSteps.join(" → ") },
              { title: "4. O Acordo", content: planAgreements.join(" | ") || "Sem acordo ou promessa cadastrada" },
              { title: "5. CTA Direto", content: brandScript.ctaDirect },
              { title: "5. CTA Transicional", content: brandScript.ctaTransitional || "Não definido" },
              { title: "6. Apostas (Fracasso)", content: stakesList.join(" | ") },
              { title: "7. O Sucesso (Final Feliz)", content: `${successData.concrete} - Transição de Identidade: ${successData.identity}` }
            ].map((el, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-[#171717] p-5 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#5A5755]">{el.title}</h4>
                <p className="text-sm text-[#A09D97] leading-relaxed">{el.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: WIREFRAME HOMEPAGE SITE */}
      {activeTab === "wireframe" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#F0EDE6]">Homepage Wireframe Copy</h3>
                <p className="text-xs text-[#A09D97]">Estrutura e copy de conversão na sequência StoryBrand.</p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(wireframeList), "wireframe")}
                className="text-xs text-[#A09D97] hover:text-white flex items-center gap-1 transition"
              >
                {copiedText === "wireframe" ? <Check className="h-4 w-4 text-[#1FBA7A]" /> : <Copy className="h-4 w-4" />} Copiar Wireframe
              </button>
            </div>

            <div className="space-y-5">
              {wireframeList.map((sec: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF3D57] font-bold">
                    Seção: {sec.section}
                  </span>
                  <p className="text-sm text-[#F0EDE6] whitespace-pre-line leading-relaxed">{sec.copy}</p>
                </div>
              ))}
            </div>

            {/* REFINAR WIREFRAME */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <input
                type="text"
                className="flex-1 bg-[#1F1F1F] border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-[#FF3D57]"
                placeholder="Ex: Altere a copy do Header ou adicione detalhes..."
                value={refineInstructions.wireframe || ""}
                onChange={(e) => setRefineInstructions(prev => ({ ...prev, wireframe: e.target.value }))}
                disabled={loadingSection === "wireframe"}
              />
              <button
                onClick={() => handleRefineSection("wireframe")}
                disabled={loadingSection === "wireframe"}
                className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition border border-white/10 disabled:opacity-50"
              >
                {loadingSection === "wireframe" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#FFD600]" />} Refinar Seção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: ISCA DIGITAL */}
      {activeTab === "lead" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#F0EDE6]">Conceito de Isca Digital (Lead Generator)</h3>
                <p className="text-xs text-[#A09D97]">Oferta transicional para capturar leads.</p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(leadGen), "lead")}
                className="text-xs text-[#A09D97] hover:text-white flex items-center gap-1 transition"
              >
                {copiedText === "lead" ? <Check className="h-4 w-4 text-[#1FBA7A]" /> : <Copy className="h-4 w-4" />} Copiar Isca
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#5A5755] block">Título Sugerido</span>
                <p className="text-lg font-bold text-[#F0EDE6]">"{leadGen.title}"</p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[#5A5755] block">Formato</span>
                <p className="text-sm text-[#A09D97]">{leadGen.format}</p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[#5A5755] block mb-1">Outline dos Capítulos/Tópicos</span>
                <ul className="space-y-2">
                  {Array.isArray(leadGen.outline) && leadGen.outline.map((out: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#A09D97]">
                      <ChevronRight className="h-4 w-4 text-[#FF3D57]" /> {out}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* REFINAR ISCA */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <input
                type="text"
                className="flex-1 bg-[#1F1F1F] border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-[#FF3D57]"
                placeholder="Ex: Altere o título da isca digital ou o formato..."
                value={refineInstructions.leadGenerator || ""}
                onChange={(e) => setRefineInstructions(prev => ({ ...prev, leadGenerator: e.target.value }))}
                disabled={loadingSection === "leadGenerator"}
              />
              <button
                onClick={() => handleRefineSection("leadGenerator")}
                disabled={loadingSection === "leadGenerator"}
                className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition border border-white/10 disabled:opacity-50"
              >
                {loadingSection === "leadGenerator" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#FFD600]" />} Refinar Isca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: E-MAILS DE VENDAS */}
      {activeTab === "emails_sales" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#F0EDE6]">E-mails de Vendas Diretas</h3>
                <p className="text-xs text-[#A09D97]">Sequência com CTA claro para agendamento ou compra imediata.</p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(salesEmails), "sales")}
                className="text-xs text-[#A09D97] hover:text-white flex items-center gap-1 transition"
              >
                {copiedText === "sales" ? <Check className="h-4 w-4 text-[#1FBA7A]" /> : <Copy className="h-4 w-4" />} Copiar Todos
              </button>
            </div>

            <div className="space-y-6">
              {salesEmails.map((email: any, idx: number) => (
                <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF8C00] font-bold">
                      E-mail {idx + 1}
                    </span>
                    <button
                      onClick={() => handleCopy(`Assunto: ${email.subject}\n\n${email.body}`, `sales_${idx}`)}
                      className="text-xs text-[#5A5755] hover:text-white flex items-center gap-1 transition"
                    >
                      {copiedText === `sales_${idx}` ? <Check className="h-3.5 w-3.5 text-[#1FBA7A]" /> : <Copy className="h-3.5 w-3.5" />} Copiar E-mail
                    </button>
                  </div>
                  <p className="text-sm font-bold text-[#F0EDE6]">Assunto: {email.subject}</p>
                  <p className="text-sm text-[#A09D97] whitespace-pre-line leading-relaxed">{email.body}</p>
                </div>
              ))}
            </div>

            {/* REFINAR E-MAILS DE VENDAS */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <input
                type="text"
                className="flex-1 bg-[#1F1F1F] border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-[#FF3D57]"
                placeholder="Ex: Deixe os e-mails mais curtos ou mais agressivos no CTA..."
                value={refineInstructions.salesEmails || ""}
                onChange={(e) => setRefineInstructions(prev => ({ ...prev, salesEmails: e.target.value }))}
                disabled={loadingSection === "salesEmails"}
              />
              <button
                onClick={() => handleRefineSection("salesEmails")}
                disabled={loadingSection === "salesEmails"}
                className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition border border-white/10 disabled:opacity-50"
              >
                {loadingSection === "salesEmails" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#FFD600]" />} Refinar E-mails
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: E-MAILS DE NUTRIÇÃO */}
      {activeTab === "emails_nurture" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#F0EDE6]">E-mails de Nutrição e Relacionamento</h3>
                <p className="text-xs text-[#A09D97]">Sequência agregando valor ao lead que baixou a isca digital.</p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(nurtureEmails), "nurture")}
                className="text-xs text-[#A09D97] hover:text-white flex items-center gap-1 transition"
              >
                {copiedText === "nurture" ? <Check className="h-4 w-4 text-[#1FBA7A]" /> : <Copy className="h-4 w-4" />} Copiar Todos
              </button>
            </div>

            <div className="space-y-6">
              {nurtureEmails.map((email: any, idx: number) => (
                <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF8C00] font-bold">
                      E-mail {idx + 1}
                    </span>
                    <button
                      onClick={() => handleCopy(`Assunto: ${email.subject}\n\n${email.body}`, `nurture_${idx}`)}
                      className="text-xs text-[#5A5755] hover:text-white flex items-center gap-1 transition"
                    >
                      {copiedText === `nurture_${idx}` ? <Check className="h-3.5 w-3.5 text-[#1FBA7A]" /> : <Copy className="h-3.5 w-3.5" />} Copiar E-mail
                    </button>
                  </div>
                  <p className="text-sm font-bold text-[#F0EDE6]">Assunto: {email.subject}</p>
                  <p className="text-sm text-[#A09D97] whitespace-pre-line leading-relaxed">{email.body}</p>
                </div>
              ))}
            </div>

            {/* REFINAR E-MAILS DE NUTRIÇÃO */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <input
                type="text"
                className="flex-1 bg-[#1F1F1F] border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-[#FF3D57]"
                placeholder="Ex: Deixe os e-mails com mais histórias ou tom pessoal..."
                value={refineInstructions.nurtureEmails || ""}
                onChange={(e) => setRefineInstructions(prev => ({ ...prev, nurtureEmails: e.target.value }))}
                disabled={loadingSection === "nurtureEmails"}
              />
              <button
                onClick={() => handleRefineSection("nurtureEmails")}
                disabled={loadingSection === "nurtureEmails"}
                className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition border border-white/10 disabled:opacity-50"
              >
                {loadingSection === "nurtureEmails" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#FFD600]" />} Refinar E-mails
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
