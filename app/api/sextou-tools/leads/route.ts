import { NextResponse } from "next/server"
import { z } from "zod"
import { createToolkitLead, listToolkitLeads } from "@/lib/sextou-tools/business"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { ToolkitDatabaseUnavailableError } from "@/lib/sextou-tools/prisma-guards"

const leadSchema = z.object({
  name: z.string().min(1),
  companyName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  source: z.string().min(1),
  status: z.string().min(1),
  estimatedValue: z.number().nonnegative().optional().nullable(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET() {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const leads = await listToolkitLeads(user.id)
  return NextResponse.json({ leads })
}

export async function POST(request: Request) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = leadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const lead = await createToolkitLead(user.id, {
      ...parsed.data,
      email: parsed.data.email || undefined,
    })

    return NextResponse.json({ lead })
  } catch (error) {
    if (error instanceof ToolkitDatabaseUnavailableError) {
      return NextResponse.json({ error: "Toolkit database unavailable" }, { status: 503 })
    }

    throw error
  }
}
