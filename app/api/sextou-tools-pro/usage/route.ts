import { NextResponse } from "next/server"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { listSextouToolsProUsageSummary } from "@/lib/sextou-tools-pro/usage"

export async function GET() {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const usage = await listSextouToolsProUsageSummary(user.id)
  return NextResponse.json({ usage })
}
