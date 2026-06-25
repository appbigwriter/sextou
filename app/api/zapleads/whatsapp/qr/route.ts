import { NextResponse } from "next/server"
import { ensureInstanceAndQr, EvolutionConfigError } from "@/lib/evolution"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { syncZapConnection } from "@/lib/sextou-tools/zap-connection"

export const dynamic = "force-dynamic"

export async function GET() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Garante a instância na Evolution e obtém o QR (raw code) quando aplicável.
    const { status, qrCode } = await ensureInstanceAndQr(result.user.id)
    await syncZapConnection(result.user.id, status)

    // `qrCodeUrl` é o code raw — o frontend gera a imagem com a lib `qrcode`.
    return NextResponse.json({ status, qrCodeUrl: qrCode, lastError: null })
  } catch (err: any) {
    if (err instanceof EvolutionConfigError) {
      return NextResponse.json(
        { status: "DISCONNECTED", qrCodeUrl: null, lastError: err.message },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { status: "DISCONNECTED", qrCodeUrl: null, lastError: err?.message || "Erro ao conectar" },
      { status: 500 }
    )
  }
}
