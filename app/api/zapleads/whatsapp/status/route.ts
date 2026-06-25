import { NextResponse } from "next/server"
import { getConnectionState, instanceNameFor } from "@/lib/evolution"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { syncZapConnection } from "@/lib/sextou-tools/zap-connection"

export const dynamic = "force-dynamic"

export async function GET() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const state = await getConnectionState(instanceNameFor(result.user.id))
    await syncZapConnection(result.user.id, state.status)
    return NextResponse.json({ status: state.status, connectedPhone: null })
  } catch {
    // Evolution indisponível: reporta desconectado sem derrubar o frontend.
    return NextResponse.json({ status: "DISCONNECTED", connectedPhone: null })
  }
}
