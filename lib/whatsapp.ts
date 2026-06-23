import { Client, LocalAuth } from "whatsapp-web.js"

export type WhatsAppStatus = "DISCONNECTED" | "AWAITING_QR" | "CONNECTED" | "INITIALIZING"

interface WhatsAppEngine {
  client: Client | null
  status: WhatsAppStatus
  qrCodeUrl: string | null
  initialize: () => void
  getClient: () => Client | null
  disconnect: () => Promise<void>
}

// Global cache to avoid multiple puppeteer instances during Next.js Hot Reload
const globalForWhatsApp = globalThis as unknown as {
  whatsappEngine: WhatsAppEngine | undefined
}

const createWhatsAppEngine = (): WhatsAppEngine => {
  const engine: WhatsAppEngine = {
    client: null,
    status: "DISCONNECTED",
    qrCodeUrl: null,

    getClient() {
      return this.client
    },

    async disconnect() {
      if (this.client) {
        try {
          await this.client.destroy()
        } catch (error) {
          console.error("Error destroying WhatsApp client:", error)
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
        authStrategy: new LocalAuth({ clientId: "zapleads-local" }),
        puppeteer: {
          headless: true,
          // Em produção (Linux/Docker) usa o Chromium do sistema via env.
          // Em dev local (Windows) cai no fallback do Chrome instalado.
          executablePath:
            process.env.PUPPETEER_EXECUTABLE_PATH ||
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      })

      this.client.on("qr", (qr) => {
        console.log("WhatsApp QR Code received!")
        // qrcode package on frontend can render the raw string into an image
        this.qrCodeUrl = qr
        this.status = "AWAITING_QR"
      })

      this.client.on("ready", () => {
        console.log("WhatsApp Client is ready!")
        this.status = "CONNECTED"
        this.qrCodeUrl = null
      })

      this.client.on("disconnected", (reason) => {
        console.log("WhatsApp Client disconnected:", reason)
        this.status = "DISCONNECTED"
        this.qrCodeUrl = null
        this.client = null
      })

      this.client.on("auth_failure", (msg) => {
        console.error("WhatsApp Authentication failure:", msg)
        this.status = "DISCONNECTED"
        this.qrCodeUrl = null
        this.client = null
      })

      // Inbound Message Listener for Auto-Heat (Story 6)
      this.client.on("message", async (msg) => {
        // Ignora grupos e mídias por enquanto
        if (!msg.from.includes("@g.us") && msg.type === "chat") {
          try {
            const { handleInboundMessage } = await import("./sextou-tools/auto-heat")
            await handleInboundMessage(msg.from, msg.body)
          } catch (err) {
            console.error("Erro ao chamar Auto Heat:", err)
          }
        }
      })

      // Iniciar a engine
      this.client.initialize().catch((err) => {
        console.error("Failed to initialize WhatsApp client:", err)
        this.status = "DISCONNECTED"
      })
    },
  }

  return engine
}

export const whatsappEngine = globalForWhatsApp.whatsappEngine ?? createWhatsAppEngine()

if (process.env.NODE_ENV !== "production") {
  globalForWhatsApp.whatsappEngine = whatsappEngine
}
