import { NextResponse } from "next/server"
import { logoutInstance, instanceNameFor } from "@/lib/evolution"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { syncZapConnection } from "@/lib/sextou-tools/zap-connection"

export const dynamic = "force-dynamic"

// Desconecta (logout) a sessão WhatsApp do usuário na Evolution.
// Mantém a instância para permitir reconectar depois com um novo QR.
export async function POST() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await logoutInstance(instanceNameFor(result.user.id))
    await syncZapConnection(result.user.id, "DISCONNECTED")
    return NextResponse.json({ status: "DISCONNECTED" })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao desconectar" }, { status: 500 })
  }
}
