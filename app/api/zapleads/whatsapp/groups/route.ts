import { NextResponse } from "next/server"
import { getConnectionState, fetchAllGroups, instanceNameFor } from "@/lib/evolution"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const instance = instanceNameFor(result.user.id)

  try {
    const state = await getConnectionState(instance)
    if (state.status !== "CONNECTED") {
      return NextResponse.json({ error: "WhatsApp disconnected" }, { status: 400 })
    }

    const groups = await fetchAllGroups(instance, false)
    return NextResponse.json({
      groups: groups.map((g) => ({ id: g.id, name: g.subject || "Grupo sem Nome" })),
    })
  } catch (error: any) {
    console.error("Groups fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
