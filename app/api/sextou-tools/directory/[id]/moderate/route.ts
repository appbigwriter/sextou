import { NextResponse } from "next/server"
import { z } from "zod"
import { moderateToolkitDirectoryEntry } from "@/lib/sextou-tools/business"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { ToolkitDatabaseUnavailableError } from "@/lib/sextou-tools/prisma-guards"

const moderationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNotes: z.string().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireToolkitApiUser()

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = moderationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const entry = await moderateToolkitDirectoryEntry(
      params.id,
      parsed.data.status,
      parsed.data.adminNotes
    )

    return NextResponse.json({ entry })
  } catch (error) {
    if (error instanceof ToolkitDatabaseUnavailableError) {
      return NextResponse.json({ error: "Toolkit database unavailable" }, { status: 503 })
    }

    throw error
  }
}
