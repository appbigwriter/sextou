import { NextResponse } from "next/server"
import { getEngine, SessionLimitError } from "@/lib/whatsapp"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const engine = getEngine(result.user.id)

    if (engine.status === "DISCONNECTED") {
      // Inicia a engine apenas quando o usuário pedir o QR Code
      engine.initialize()
    }

    return NextResponse.json({
      status: engine.status,
      qrCodeUrl: engine.qrCodeUrl,
    })
  } catch (err) {
    if (err instanceof SessionLimitError) {
      return NextResponse.json({ error: err.message }, { status: 503 })
    }
    throw err
  }
}
