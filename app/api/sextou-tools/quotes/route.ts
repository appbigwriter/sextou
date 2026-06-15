import { NextResponse } from "next/server"
import { z } from "zod"
import { createToolkitQuote, listToolkitQuotes } from "@/lib/sextou-tools/business"
import { requireToolkitApiUser } from "@/lib/sextou-tools/auth"
import { ToolkitDatabaseUnavailableError } from "@/lib/sextou-tools/prisma-guards"

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().nonnegative(),
  unitPrice: z.number().nonnegative(),
})

const quoteSchema = z.object({
  leadId: z.string().optional().nullable(),
  title: z.string().min(1),
  clientName: z.string().min(1),
  clientCompany: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientPhone: z.string().optional(),
  issueDate: z.string().min(1),
  validUntil: z.string().optional().nullable(),
  notes: z.string().optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  discountAmount: z.number().nonnegative().optional(),
  lineItems: z.array(lineItemSchema).min(1),
})

export async function GET() {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const quotes = await listToolkitQuotes(user.id)
  return NextResponse.json({ quotes })
}

export async function POST(request: Request) {
  const user = await requireToolkitApiUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = quoteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const quote = await createToolkitQuote(user.id, {
      ...parsed.data,
      clientEmail: parsed.data.clientEmail || undefined,
    })

    return NextResponse.json({ quote })
  } catch (error) {
    if (error instanceof ToolkitDatabaseUnavailableError) {
      return NextResponse.json({ error: "Toolkit database unavailable" }, { status: 503 })
    }

    throw error
  }
}
