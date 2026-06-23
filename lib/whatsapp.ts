import { Client, LocalAuth } from "whatsapp-web.js"

export type WhatsAppStatus = "DISCONNECTED" | "AWAITING_QR" | "CONNECTED" | "INITIALIZING"

// ── Limites (configuráveis por env) ─────────────────────────────────────────
// Cada sessão conectada = 1 processo Chromium (~300-700MB). Limite protege o VPS.
const MAX_SESSIONS = Number(process.env.ZAPLEADS_MAX_SESSIONS || 15)
const IDLE_TIMEOUT_MS = Number(process.env.ZAPLEADS_IDLE_TIMEOUT_MIN || 30) * 60 * 1000
const SWEEP_INTERVAL_MS = 5 * 60 * 1000
// Não despeja uma sessão recém-ativa para abrir espaço (evita matar quem está conectando)
const EVICTION_GRACE_MS = 5 * 60 * 1000

export class SessionLimitError extends Error {
  constructor() {
    super("Limite de conexões simultâneas de WhatsApp atingido. Tente novamente em alguns minutos.")
    this.name = "SessionLimitError"
  }
}

interface WhatsAppEngine {
  userId: string
  client: Client | null
  status: WhatsAppStatus
  qrCodeUrl: string | null
  lastActivityAt: number
  initialize: () => void
  getClient: () => Client | null
  disconnect: () => Promise<void>
}

// Registry por usuário, cacheado no global p/ sobreviver ao Hot Reload do Next em dev.
const globalForWhatsApp = globalThis as unknown as {
  whatsappRegistry: Map<string, WhatsAppEngine> | undefined
  whatsappSweeper: NodeJS.Timeout | undefined
}

const registry = globalForWhatsApp.whatsappRegistry ?? new Map<string, WhatsAppEngine>()
if (process.env.NODE_ENV !== "production") {
  globalForWhatsApp.whatsappRegistry = registry
}

const resolveExecutablePath = () =>
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const createEngine = (userId: string): WhatsAppEngine => {
  const engine: WhatsAppEngine = {
    userId,
    client: null,
    status: "DISCONNECTED",
    qrCodeUrl: null,
    lastActivityAt: Date.now(),

    getClient() {
      return this.client
    },

    async disconnect() {
      if (this.client) {
        try {
          await this.client.destroy()
        } catch (error) {
          console.error(`[zapleads] Error destroying client for ${userId}:`, error)
        }
      }
      this.client = null
      this.status = "DISCONNECTED"
      this.qrCodeUrl = null
    },

    initialize() {
      if (this.status === "INITIALIZING" || this.status === "CONNECTED" || this.status === "AWAITING_QR") {
        return
      }

      this.status = "INITIALIZING"
      this.qrCodeUrl = null

      this.client = new Client({
        // clientId + dataPath POR USUÁRIO: isola a sessão de cada conta.
        authStrategy: new LocalAuth({ clientId: `zapleads-${userId}` }),
        puppeteer: {
          headless: true,
          executablePath: resolveExecutablePath(),
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      })

      this.client.on("qr", (qr) => {
        console.log(`[zapleads] QR recebido para ${userId}`)
        this.qrCodeUrl = qr
        this.status = "AWAITING_QR"
      })

      this.client.on("ready", () => {
        console.log(`[zapleads] Cliente pronto para ${userId}`)
        this.status = "CONNECTED"
        this.qrCodeUrl = null
      })

      this.client.on("disconnected", (reason) => {
        console.log(`[zapleads] Cliente desconectado (${userId}):`, reason)
        this.status = "DISCONNECTED"
        this.qrCodeUrl = null
        this.client = null
      })

      this.client.on("auth_failure", (msg) => {
        console.error(`[zapleads] Falha de autenticação (${userId}):`, msg)
        this.status = "DISCONNECTED"
        this.qrCodeUrl = null
        this.client = null
      })

      // Listener de inbound (Auto-Heat) — escopado ao DONO da sessão.
      this.client.on("message", async (msg) => {
        if (!msg.from.includes("@g.us") && msg.type === "chat") {
          try {
            const { handleInboundMessage } = await import("./sextou-tools/auto-heat")
            await handleInboundMessage(userId, msg.from, msg.body)
          } catch (err) {
            console.error(`[zapleads] Erro no Auto Heat (${userId}):`, err)
          }
        }
      })

      this.client.initialize().catch((err) => {
        console.error(`[zapleads] Falha ao inicializar cliente (${userId}):`, err)
        this.status = "DISCONNECTED"
      })
    },
  }

  return engine
}

/**
 * Remove sessões ociosas há mais que IDLE_TIMEOUT_MS.
 * Retorna o número de sessões removidas.
 */
const sweepIdle = (): number => {
  const now = Date.now()
  let removed = 0
  for (const [userId, engine] of registry) {
    if (now - engine.lastActivityAt > IDLE_TIMEOUT_MS) {
      void engine.disconnect()
      registry.delete(userId)
      removed++
      console.log(`[zapleads] Sessão ociosa removida: ${userId}`)
    }
  }
  return removed
}

// Sweeper único (guard contra múltiplos timers em hot reload).
if (!globalForWhatsApp.whatsappSweeper) {
  globalForWhatsApp.whatsappSweeper = setInterval(sweepIdle, SWEEP_INTERVAL_MS)
  // Não segura o processo vivo por causa do timer.
  if (typeof globalForWhatsApp.whatsappSweeper.unref === "function") {
    globalForWhatsApp.whatsappSweeper.unref()
  }
}

/**
 * Retorna a engine do usuário, criando se necessário.
 * Aplica limite de sessões simultâneas com despejo da mais ociosa (respeitando grace).
 * @throws {SessionLimitError} quando no limite e não há sessão ociosa a despejar.
 */
/**
 * Lê a engine do usuário SEM criar uma nova (não conta no limite).
 * Usado para checar status sem disparar inicialização de Chromium.
 */
export function peekEngine(userId: string): WhatsAppEngine | undefined {
  const engine = registry.get(userId)
  if (engine) engine.lastActivityAt = Date.now()
  return engine
}

export function getEngine(userId: string): WhatsAppEngine {
  const existing = registry.get(userId)
  if (existing) {
    existing.lastActivityAt = Date.now()
    return existing
  }

  if (registry.size >= MAX_SESSIONS) {
    // Tenta despejar a sessão mais ociosa (desde que passe do grace period).
    let oldest: WhatsAppEngine | null = null
    for (const engine of registry.values()) {
      if (!oldest || engine.lastActivityAt < oldest.lastActivityAt) oldest = engine
    }
    const now = Date.now()
    if (oldest && now - oldest.lastActivityAt > EVICTION_GRACE_MS) {
      void oldest.disconnect()
      registry.delete(oldest.userId)
      console.log(`[zapleads] Sessão despejada por limite: ${oldest.userId}`)
    } else {
      throw new SessionLimitError()
    }
  }

  const engine = createEngine(userId)
  registry.set(userId, engine)
  return engine
}
