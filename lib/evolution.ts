/**
 * Client da Evolution API v2 (WhatsApp via serviço externo, sem Chromium/puppeteer).
 *
 * O app NÃO mantém sessão nem browser em memória: ele apenas fala REST com um
 * serviço Evolution dedicado e recebe mensagens recebidas via webhook. Cada
 * usuário do ZapLeads tem uma instância isolada chamada `zapleads-{userId}`.
 *
 * Autenticação: a chave global (AUTHENTICATION_API_KEY na Evolution) autoriza
 * todas as operações, então usamos sempre o header `apikey` com essa chave —
 * dispensa persistir um token por instância.
 *
 * Doc: https://doc.evolution-api.com (v2).
 */

const BASE_URL = (process.env.EVOLUTION_API_URL || "").replace(/\/$/, "")
const API_KEY = process.env.EVOLUTION_API_KEY || ""
const WEBHOOK_URL = process.env.EVOLUTION_WEBHOOK_URL || ""
const WEBHOOK_TOKEN = process.env.EVOLUTION_WEBHOOK_TOKEN || ""

export const INSTANCE_PREFIX = "zapleads-"

export type WhatsAppStatus = "CONNECTED" | "AWAITING_QR" | "DISCONNECTED"

export class EvolutionConfigError extends Error {
  constructor() {
    super("Evolution API não configurada. Defina EVOLUTION_API_URL e EVOLUTION_API_KEY.")
    this.name = "EvolutionConfigError"
  }
}

export class EvolutionRequestError extends Error {
  status: number
  body: string
  constructor(status: number, body: string) {
    super(`Evolution API respondeu ${status}: ${body}`)
    this.name = "EvolutionRequestError"
    this.status = status
    this.body = body
  }
}

export function instanceNameFor(userId: string): string {
  return INSTANCE_PREFIX + userId
}

export function userIdFromInstance(instance: string): string | null {
  return instance.startsWith(INSTANCE_PREFIX) ? instance.slice(INSTANCE_PREFIX.length) : null
}

export function isConfigured(): boolean {
  return Boolean(BASE_URL && API_KEY)
}

/** Mapeia o `state` da Evolution ("open"|"connecting"|"close") para o status interno. */
export function mapState(state?: string | null): WhatsAppStatus {
  if (state === "open") return "CONNECTED"
  if (state === "connecting") return "AWAITING_QR"
  return "DISCONNECTED"
}

interface EvoFetchOptions {
  method?: string
  body?: unknown
  /** Trata estes status HTTP como sucesso e devolve a Response sem lançar. */
  allowStatuses?: number[]
}

async function evoFetch(path: string, opts: EvoFetchOptions = {}): Promise<Response> {
  if (!isConfigured()) throw new EvolutionConfigError()

  const res = await fetch(`${BASE_URL}${path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: API_KEY,
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  })

  if (!res.ok && !(opts.allowStatuses || []).includes(res.status)) {
    const text = await res.text().catch(() => "")
    throw new EvolutionRequestError(res.status, text)
  }

  return res
}

// ── Instâncias ───────────────────────────────────────────────────────────────

export interface ConnectionStateResult {
  exists: boolean
  status: WhatsAppStatus
  rawState: string | null
}

/** Lê o estado da conexão. Instância inexistente → exists:false / DISCONNECTED. */
export async function getConnectionState(instance: string): Promise<ConnectionStateResult> {
  const res = await evoFetch(`/instance/connectionState/${instance}`, { allowStatuses: [404] })
  if (res.status === 404) {
    return { exists: false, status: "DISCONNECTED", rawState: null }
  }
  const data = await res.json().catch(() => ({}))
  const state: string | null = data?.instance?.state ?? null
  return { exists: true, status: mapState(state), rawState: state }
}

export interface QrResult {
  /** String raw do QR (para gerar a imagem no frontend com a lib `qrcode`). */
  code: string | null
  /** Imagem PNG já pronta em data-URL base64 (alternativa ao `code`). */
  base64: string | null
  pairingCode: string | null
}

/** Cria a instância (Baileys). O QR é obtido depois via connectInstance. */
export async function createInstance(instance: string): Promise<void> {
  await evoFetch(`/instance/create`, {
    method: "POST",
    body: {
      instanceName: instance,
      integration: "WHATSAPP-BAILEYS",
      qrcode: true,
      groupsIgnore: false,
    },
  })
}

/**
 * Configura (ou reconfigura) o webhook da instância — idempotente.
 * Chamado a cada conexão para garantir que o inbound (Auto-Heat) sempre chegue,
 * independentemente de quando/onde a instância foi criada.
 */
export async function setWebhook(instance: string): Promise<void> {
  if (!WEBHOOK_URL) return
  await evoFetch(`/webhook/set/${instance}`, {
    method: "POST",
    body: {
      webhook: {
        enabled: true,
        url: WEBHOOK_URL,
        byEvents: false,
        base64: false,
        headers: WEBHOOK_TOKEN ? { Authorization: `Bearer ${WEBHOOK_TOKEN}` } : undefined,
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
      },
    },
  })
}

/** Best-effort: falha de webhook não deve impedir a conexão/QR. */
async function safeSetWebhook(instance: string): Promise<void> {
  try {
    await setWebhook(instance)
  } catch (err) {
    console.error(`[zapleads] setWebhook falhou para ${instance}:`, err)
  }
}

/** Solicita (ou renova) o QR de uma instância existente. */
export async function connectInstance(instance: string): Promise<QrResult> {
  const res = await evoFetch(`/instance/connect/${instance}`)
  const data = await res.json().catch(() => ({}))
  return {
    code: data?.code ?? null,
    base64: data?.base64 ?? null,
    pairingCode: data?.pairingCode ?? null,
  }
}

export async function logoutInstance(instance: string): Promise<void> {
  await evoFetch(`/instance/logout/${instance}`, { method: "DELETE", allowStatuses: [404] }).catch(() => {})
  await evoFetch(`/instance/delete/${instance}`, { method: "DELETE", allowStatuses: [404] }).catch(() => {})
}

export async function deleteInstance(instance: string): Promise<void> {
  await evoFetch(`/instance/delete/${instance}`, { method: "DELETE", allowStatuses: [404] })
}

// ── Grupos ───────────────────────────────────────────────────────────────────

export interface EvoParticipant {
  /** Pode ser um LID anônimo ("...@lid") em grupos novos — NÃO é confiável como telefone. */
  id: string
  /** Telefone real resolvido ("5521999999999@s.whatsapp.net"), quando disponível. */
  phoneNumber?: string | null
  admin: string | null
}

/**
 * Extrai o telefone E.164 de um participante.
 * Prefere `phoneNumber` (número real); `id` só serve quando já é @s.whatsapp.net
 * (grupos antigos). Participantes que só têm LID, sem telefone, retornam null.
 */
export function participantPhoneE164(p: EvoParticipant): string | null {
  const source =
    p.phoneNumber && p.phoneNumber.includes("@s.whatsapp.net")
      ? p.phoneNumber
      : p.id && p.id.includes("@s.whatsapp.net")
        ? p.id
        : null
  if (!source) return null
  const raw = source.split("@")[0].replace(/\D/g, "")
  return raw ? "+" + raw : null
}

export interface EvoGroup {
  id: string // ex.: "1203...@g.us"
  subject: string | null
  size: number | null
  participants?: EvoParticipant[]
}

export async function fetchAllGroups(instance: string, withParticipants = true): Promise<EvoGroup[]> {
  const res = await evoFetch(
    `/group/fetchAllGroups/${instance}?getParticipants=${withParticipants ? "true" : "false"}`
  )
  const data = await res.json().catch(() => [])
  if (!Array.isArray(data)) return []
  return data as EvoGroup[]
}

// ── Mensagens ────────────────────────────────────────────────────────────────

/** Envia texto. `number` deve vir só com dígitos (DDI+DDD+número), sem `+` nem sufixo. */
export async function sendText(instance: string, number: string, text: string): Promise<void> {
  await evoFetch(`/message/sendText/${instance}`, {
    method: "POST",
    body: { number, text },
  })
}

// ── Helpers de alto nível ─────────────────────────────────────────────────────

export interface EnsureQrResult {
  status: WhatsAppStatus
  /** Raw QR para o frontend renderizar (null quando já conectado). */
  qrCode: string | null
  base64: string | null
}

/**
 * Garante que a instância do usuário exista e devolve o estado + QR quando aplicável.
 * - Já conectada → status CONNECTED, sem QR.
 * - Inexistente → cria (com webhook) e devolve o QR.
 * - Existente porém desconectada → renova o QR via connect.
 */
export async function ensureInstanceAndQr(userId: string): Promise<EnsureQrResult> {
  const instance = instanceNameFor(userId)
  const state = await getConnectionState(instance)

  if (state.status === "CONNECTED") {
    await safeSetWebhook(instance) // mantém o webhook sincronizado mesmo já conectado
    return { status: "CONNECTED", qrCode: null, base64: null }
  }

  if (!state.exists) {
    await createInstance(instance)
  }
  await safeSetWebhook(instance)

  const qr = await connectInstance(instance)
  const status: WhatsAppStatus = qr.code || qr.base64 ? "AWAITING_QR" : state.status
  return { status, qrCode: qr.code, base64: qr.base64 }
}

/** Diagnóstico do subsistema (sem efeitos colaterais de criação). */
export async function getDiagnostics(userId: string) {
  const instance = instanceNameFor(userId)
  const base = {
    configured: isConfigured(),
    baseUrl: BASE_URL || null,
    hasApiKey: Boolean(API_KEY),
    webhookUrl: WEBHOOK_URL || null,
    hasWebhookToken: Boolean(WEBHOOK_TOKEN),
    instance,
  }

  if (!isConfigured()) {
    return { ok: false, reason: "EVOLUTION_NOT_CONFIGURED", ...base }
  }

  try {
    const state = await getConnectionState(instance)
    return {
      ok: true,
      reason: "OK",
      ...base,
      instanceExists: state.exists,
      status: state.status,
      rawState: state.rawState,
    }
  } catch (err: any) {
    return {
      ok: false,
      reason: "EVOLUTION_UNREACHABLE",
      ...base,
      error: err?.message || String(err),
    }
  }
}

export function getWebhookToken(): string {
  return WEBHOOK_TOKEN
}
