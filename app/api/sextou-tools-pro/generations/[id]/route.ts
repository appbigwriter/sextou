import { NextResponse } from "next/server"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { sextouToolsProGenerationActionSchema } from "@/lib/sextou-tools-pro/schemas"
import { updateSextouToolsProGenerationAction } from "@/lib/sextou-tools-pro/history"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireToolkitApiUser()

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

    throw error
  }
}
