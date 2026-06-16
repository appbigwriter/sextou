import { NextResponse } from "next/server"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import {
  duplicateSextouToolsProGeneration,
  getSextouToolsProGenerationById,
  listRecentSextouToolsProGenerations,
  listRecentSextouToolsProGenerationsByApp,
} from "@/lib/sextou-tools-pro/history"

export async function GET(request: Request) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const appId = url.searchParams.get("appId")
  const generationId = url.searchParams.get("id")

  if (generationId) {
    const generation = await getSextouToolsProGenerationById(user.id, generationId)
    return NextResponse.json({ generation })
  }

  const generations = appId
    ? await listRecentSextouToolsProGenerationsByApp(user.id, appId, 20)
    : await listRecentSextouToolsProGenerations(user.id, 20)

  return NextResponse.json({ generations })
}

export async function POST(request: Request) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const sourceGenerationId = typeof body?.sourceGenerationId === "string" ? body.sourceGenerationId : null

  if (!sourceGenerationId) {
    return NextResponse.json({ error: "sourceGenerationId is required" }, { status: 400 })
  }

  const sourceGeneration = await getSextouToolsProGenerationById(user.id, sourceGenerationId)

  if (!sourceGeneration) {
    return NextResponse.json({ error: "Generation not found" }, { status: 404 })
  }

  const duplicated = await duplicateSextouToolsProGeneration(user.id, sourceGeneration.id)

  return NextResponse.json({ generation: duplicated })
}
