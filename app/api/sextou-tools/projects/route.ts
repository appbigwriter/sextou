import { NextResponse } from "next/server"
import { z } from "zod"
import { createToolkitProject, listToolkitProjects } from "@/lib/sextou-tools/business"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { ToolkitDatabaseUnavailableError } from "@/lib/sextou-tools/prisma-guards"

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.string().min(1),
  priority: z.string().min(1),
  dueDate: z.string().optional().nullable(),
})

export async function GET() {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await listToolkitProjects(user.id)
  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = projectSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const project = await createToolkitProject(user.id, parsed.data)
    return NextResponse.json({ project })
  } catch (error) {
    if (error instanceof ToolkitDatabaseUnavailableError) {
      return NextResponse.json({ error: "Toolkit database unavailable" }, { status: 503 })
    }

    throw error
  }
}
