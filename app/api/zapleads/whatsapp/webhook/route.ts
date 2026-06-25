import { NextResponse } from "next/server"
import { userIdFromInstance, getWebhookToken } from "@/lib/evolution"
import { handleInboundMessage } from "@/lib/sextou-tools/auto-heat"

export const dynamic = "force-dynamic"

/**
 * Recebe eventos da Evolution API (configurados na criação da instância).
 * Substitui o antigo listener `client.on("message")` da engine puppeteer.
 *
 * Sempre responde 200 (mesmo em erro/ignore) para a Evolution não reenfileirar.
 * A autenticação é por segredo compartilhado (EVOLUTION_WEBHOOK_TOKEN), já que
 * a Evolution não carrega sessão de usuário.
 */
export async function POST(req: Request) {
  const token = getWebhookToken()
  if (token) {
    const auth = req.headers.get("authorization") || ""
    if (auth !== `Bearer ${token}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  try {
    const event: string = payload?.event || ""
    if (event !== "messages.upsert") {
      return NextResponse.json({ ok: true }) // só tratamos mensagens recebidas
    }

    const userId = userIdFromInstance(payload?.instance || "")
    if (!userId) return NextResponse.json({ ok: true })

    const data = payload?.data || {}
    const key = data?.key || {}
    if (key?.fromMe) return NextResponse.json({ ok: true }) // ignora envios próprios

    const remoteJid: string = key?.remoteJid || ""
    // Auto-Heat só trata conversas 1:1 (não grupos).
    if (!remoteJid.endsWith("@s.whatsapp.net")) return NextResponse.json({ ok: true })

    const body: string =
      data?.message?.conversation || data?.message?.extendedTextMessage?.text || ""
    if (!body) return NextResponse.json({ ok: true })

    await handleInboundMessage(userId, remoteJid, body)
  } catch (err) {
    console.error("[zapleads] webhook error:", err)
  }

  return NextResponse.json({ ok: true })
}
