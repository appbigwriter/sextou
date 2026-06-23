import { NextResponse } from "next/server"
import { peekEngine } from "@/lib/whatsapp"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const engine = peekEngine(result.user.id)
  const client = engine?.getClient()
  const connectedPhone = client?.info?.wid?.user || null

  return NextResponse.json({
    status: engine?.status || "DISCONNECTED",
    connectedPhone,
  })
}
