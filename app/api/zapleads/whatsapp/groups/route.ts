import { NextResponse } from "next/server"
import { getEngine } from "@/lib/whatsapp"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const engine = getEngine(result.user.id)
  if (engine.status !== "CONNECTED") {
    return NextResponse.json({ error: "WhatsApp disconnected" }, { status: 400 })
  }

  const client = engine.getClient()
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 500 })
  }

  try {
    const chats = await client.getChats()
    const groups = chats
      .filter((c) => c.isGroup)
      .map((g) => ({
        id: g.id._serialized,
        name: g.name || "Grupo sem Nome",
      }))
    
    return NextResponse.json({ groups })
  } catch (error: any) {
    console.error("Groups fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
