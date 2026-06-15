import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { recordToolkitExecution } from "@/lib/sextou-tools/history"

const payloadSchema = z.object({
  toolSlug: z.string().min(1),
  input: z.record(z.string(), z.any()).optional().nullable(),
  output: z.record(z.string(), z.any()).optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = await request.json()
  const parsed = payloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const execution = await recordToolkitExecution(user.id, parsed.data.toolSlug, {
    input: parsed.data.input ?? undefined,
    output: parsed.data.output ?? undefined,
    metadata: parsed.data.metadata ?? undefined,
  })

  return NextResponse.json({ id: execution.id })
}
