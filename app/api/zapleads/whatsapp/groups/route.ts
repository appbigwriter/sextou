import { NextResponse } from "next/server"
import { whatsappEngine } from "@/lib/whatsapp"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const result = await resolveSextouToolsProUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (whatsappEngine.status !== "CONNECTED") {
    return NextResponse.json({ error: "WhatsApp disconnected" }, { status: 400 })
  }

  const client = whatsappEngine.getClient()
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
