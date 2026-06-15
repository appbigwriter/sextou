import { NextResponse } from "next/server"
import { z } from "zod"
import {
  createToolkitDirectoryEntry,
  listToolkitDirectoryEntries,
} from "@/lib/sextou-tools/business"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"

const directorySchema = z.object({
  businessName: z.string().min(1),
  ownerName: z.string().min(1),
  category: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  instagram: z.string().optional(),
  website: z.string().optional(),
  shortDescription: z.string().min(1),
  servicesSummary: z.string().optional(),
  badgeLabel: z.string().optional(),
  isPublic: z.boolean().optional(),
})

export async function GET() {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const entries = await listToolkitDirectoryEntries(user.id, user.isAdmin)
  return NextResponse.json({ entries, isAdmin: user.isAdmin })
}

export async function POST(request: Request) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = directorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const entry = await createToolkitDirectoryEntry(user.id, {
    ...parsed.data,
    email: parsed.data.email || undefined,
  })

  return NextResponse.json({ entry })
}
