import { NextResponse } from "next/server"
import { z } from "zod"
import { createToolkitTask } from "@/lib/sextou-tools/business"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { ToolkitDatabaseUnavailableError } from "@/lib/sextou-tools/prisma-guards"

const taskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().min(1),
  priority: z.string().min(1),
  assigneeName: z.string().optional(),
  dueDate: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = taskSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const task = await createToolkitTask(user.id, parsed.data)
    return NextResponse.json({ task })
  } catch (error) {
    if (error instanceof ToolkitDatabaseUnavailableError) {
      return NextResponse.json({ error: "Toolkit database unavailable" }, { status: 503 })
    }

    throw error
  }
}
