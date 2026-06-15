"use client"

import { useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface BusinessChecklistToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

type ChecklistMode = "from-scratch" | "organize-existing"

const checklistStages = [
  { id: "business-type", title: "Definir tipo de negocio", description: "Clarifique o que voce vai vender e para quem." },
  { id: "business-name", title: "Escolher nome comercial", description: "Verifique disponibilidade e consistencia da marca." },
  { id: "business-structure", title: "Escolher estrutura juridica", description: "Avalie Sole Proprietor, LLC ou Corporation." },
  { id: "registration", title: "Registrar empresa", description: "Formalize a entidade quando aplicavel." },
  { id: "ein", title: "Solicitar EIN", description: "Garanta o identificador fiscal para o negocio." },
  { id: "bank-account", title: "Abrir conta bancaria", description: "Separe financas pessoais e empresariais." },
  { id: "licenses", title: "Verificar licencas locais", description: "Cheque exigencias por cidade, county ou estado." },
  { id: "sales-tax", title: "Verificar sales tax", description: "Entenda se o negocio precisa recolher imposto sobre vendas." },
  { id: "insurance", title: "Contratar seguro", description: "Avalie cobertura de responsabilidade, carro comercial ou workers comp." },
  { id: "accounting", title: "Organizar contabilidade", description: "Defina rotina de registros, recibos e acompanhamento." },
  { id: "proposal-invoice", title: "Criar orcamento e invoice", description: "Padronize como o negocio vai cobrar clientes." },
  { id: "digital-presence", title: "Criar presenca digital", description: "Garanta site, Instagram ou outra vitrine minima." },
  { id: "google-business", title: "Criar Google Business Profile", description: "Aumente visibilidade local e reputacao." },
  { id: "payments", title: "Definir formas de pagamento", description: "Escolha Zelle, cartao, transferencias ou plataformas." },
  { id: "financial-routine", title: "Criar rotina financeira", description: "Monitore caixa, impostos e margem toda semana." },
] as const

type StageId = (typeof checklistStages)[number]["id"]

type ChecklistState = Record<StageId, { completed: boolean; note: string }>

function createInitialState(): ChecklistState {
  return checklistStages.reduce((acc, stage) => {
    acc[stage.id] = { completed: false, note: "" }
    return acc
  }, {} as ChecklistState)
}

export function BusinessChecklistTool({ historyItems }: BusinessChecklistToolProps) {
  const [mode, setMode] = useState<ChecklistMode>("from-scratch")
  const [state, setState] = useState<ChecklistState>(() => createInitialState())
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Marque os passos concluidos e registre observacoes por etapa.")
  const [localHistory, setLocalHistory] = useState(historyItems)

  const completedCount = useMemo(
    () => checklistStages.filter((stage) => state[stage.id].completed).length,
    [state]
  )
  const progressPercent = Math.round((completedCount / checklistStages.length) * 100)
  const summary = `${mode === "from-scratch" ? "Comecando do zero" : "Organizando empresa"} · ${progressPercent}% concluido`

  function toggleStage(stageId: StageId) {
    setState((current) => ({
      ...current,
      [stageId]: {
        ...current[stageId],
        completed: !current[stageId].completed,
      },
    }))
  }

  function updateNote(stageId: StageId, value: string) {
    setState((current) => ({
      ...current,
      [stageId]: {
        ...current[stageId],
        note: value,
      },
    }))
  }

  async function saveExecution() {
    const response = await fetch("/api/sextou-tools/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "checklist-abertura-empresa",
        input: {
          mode,
          progressPercent,
        },
        output: {
          completedCount,
          totalStages: checklistStages.length,
        },
        metadata: {
          summary,
          checklistState: state,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("save-failed")
    }

    setLocalHistory((current) => [
      {
        title: "checklist abertura empresa",
        subtitle: summary,
        timestamp: new Date().toLocaleString("pt-BR"),
      },
      ...current,
    ].slice(0, 8))
  }

  async function handleSaveProgress() {
    setIsSaving(true)
    try {
      await saveExecution()
      setStatusMessage("Progresso salvo no historico da sua conta.")
    } catch {
      setStatusMessage("Progresso atualizado, mas nao foi possivel salvar no historico agora.")
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    setState(createInitialState())
    setMode("from-scratch")
    setStatusMessage("Checklist reiniciado.")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
      <section className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMode("from-scratch")}
            className={`inline-flex h-12 items-center justify-center rounded-[16px] px-4 text-sm font-semibold transition ${
              mode === "from-scratch"
                ? "bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)]"
                : "border border-white/10 bg-white/5 text-[#F0EDE6] hover:bg-white/10"
            }`}
          >
            Comecando do zero
          </button>
          <button
            type="button"
            onClick={() => setMode("organize-existing")}
            className={`inline-flex h-12 items-center justify-center rounded-[16px] px-4 text-sm font-semibold transition ${
              mode === "organize-existing"
                ? "bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)]"
                : "border border-white/10 bg-white/5 text-[#F0EDE6] hover:bg-white/10"
            }`}
          >
            Ja tenho empresa
          </button>
        </div>

        <div className="space-y-4">
          {checklistStages.map((stage, index) => (
            <div key={stage.id} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleStage(stage.id)}
                  className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${
                    state[stage.id].completed
                      ? "border-transparent bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] text-white"
                      : "border-white/10 bg-[#2A2A2A] text-[#A09D97]"
                  }`}
                >
                  {state[stage.id].completed ? "OK" : index + 1}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-toolkit text-xl font-extrabold text-[#F0EDE6]">{stage.title}</h3>
                    {state[stage.id].completed ? (
                      <span className="rounded-full border border-[#1FBA7A]/30 bg-[#1FBA7A]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1FBA7A]">
                        Concluido
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#A09D97]">{stage.description}</p>
                  <textarea
                    value={state[stage.id].note}
                    onChange={(event) => updateNote(stage.id, event.target.value)}
                    className="mt-3 min-h-[88px] w-full rounded-[18px] border border-white/10 bg-[#171717] px-4 py-3 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
                    placeholder="Observacao pessoal para esta etapa"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveProgress}
            disabled={isSaving}
            className="inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar progresso"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-12 items-center justify-center rounded-[16px] border border-white/10 bg-transparent px-4 text-sm font-semibold text-[#A09D97] transition hover:bg-white/5 hover:text-[#F0EDE6]"
          >
            Reiniciar checklist
          </button>
        </div>

        <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">
          {statusMessage}
        </p>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Progresso</p>
          <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#F0EDE6]">{summary}</p>
              <p className="font-mono text-sm text-[#A09D97]">{progressPercent}%</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#2A2A2A]">
              <div
                className="h-full rounded-full bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[#A09D97]">
              {completedCount} de {checklistStages.length} etapas concluidas.
            </p>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6 text-sm leading-7 text-[#A09D97]">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Nota importante</p>
          <p className="mt-4">
            Esta ferramenta e educativa e nao substitui contador, advogado ou consultor licenciado.
          </p>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Historico recente</p>
          <div className="mt-4">
            <HistoryList items={localHistory} />
          </div>
        </div>
      </aside>
    </div>
  )
}
