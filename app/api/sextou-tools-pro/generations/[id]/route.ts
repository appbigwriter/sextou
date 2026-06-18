import { NextResponse } from "next/server"
import { requireSextouToolsProApiUser } from "@/lib/sextou-tools/auth"
import { sextouToolsProGenerationActionSchema } from "@/lib/sextou-tools-pro/schemas"
import { updateSextouToolsProGenerationAction } from "@/lib/sextou-tools-pro/history"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireSextouToolsProApiUser()

  if (user === false) {
    return NextResponse.json({ error: "SextouTools PRO access requires active ads" }, { status: 403 })
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = sextouToolsProGenerationActionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const generation = await updateSextouToolsProGenerationAction(user.id, params.id, parsed.data)
    return NextResponse.json({ generation })
  } catch (error) {
    if (error instanceof Error && error.message === "generation-not-found") {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 })
    }

    if (error instanceof Error && error.message === "invalid-post-index") {
      return NextResponse.json({ error: "Invalid post index" }, { status: 400 })
    }

    if (error instanceof Error && error.message === "invalid-message-index") {
      return NextResponse.json({ error: "Invalid message index" }, { status: 400 })
    }

    if (error instanceof Error && (error.message === "invalid-task-index" || error.message === "invalid-task-section")) {
      return NextResponse.json({ error: "Invalid task payload" }, { status: 400 })
    }

    if (
      error instanceof Error &&
      (error.message === "invalid-partner-index" || error.message === "invalid-partnership-status")
    ) {
      return NextResponse.json({ error: "Invalid partnership payload" }, { status: 400 })
    }

    throw error
  }
}
