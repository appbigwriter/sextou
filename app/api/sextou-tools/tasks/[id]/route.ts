import { NextResponse } from "next/server"
import { z } from "zod"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { updateToolkitTaskStatus } from "@/lib/sextou-tools/business"
import { ToolkitDatabaseUnavailableError } from "@/lib/sextou-tools/prisma-guards"

const patchSchema = z.object({
  status: z.string().min(1),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const task = await updateToolkitTaskStatus(user.id, params.id, parsed.data.status)
    return NextResponse.json({ task })
  } catch (error) {
    if (error instanceof ToolkitDatabaseUnavailableError) {
      return NextResponse.json({ error: "Toolkit database unavailable" }, { status: 503 })
    }

    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }
}
