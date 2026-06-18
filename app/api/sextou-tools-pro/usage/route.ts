import { NextResponse } from "next/server"
import { requireSextouToolsProApiUser } from "@/lib/sextou-tools/auth"
import { listSextouToolsProUsageSummary } from "@/lib/sextou-tools-pro/usage"

export async function GET() {
  const user = await requireSextouToolsProApiUser()

  if (user === false) {
    return NextResponse.json({ error: "SextouTools PRO access requires active ads" }, { status: 403 })
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const usage = await listSextouToolsProUsageSummary(user.id)
  return NextResponse.json({ usage })
}
