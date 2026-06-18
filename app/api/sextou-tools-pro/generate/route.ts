import { NextResponse } from "next/server"
import { requireSextouToolsProApiUser } from "@/lib/sextou-tools/auth"
import { generateSextouToolsProResult } from "@/lib/sextou-tools-pro/generation"
import { sextouToolsProGenerateSchema } from "@/lib/sextou-tools-pro/schemas"
import {
  SextouToolsProDatabaseUnavailableError,
} from "@/lib/sextou-tools-pro/prisma-guards"
import { isSextouToolsProUsageLimitError } from "@/lib/sextou-tools-pro/usage"

export async function POST(request: Request) {
  const user = await requireSextouToolsProApiUser()

  if (user === false) {
    return NextResponse.json({ error: "SextouTools PRO access requires active ads" }, { status: 403 })
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = sextouToolsProGenerateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const generation = await generateSextouToolsProResult({
      user,
      ...parsed.data,
      sourceAction: parsed.data.sourceAction || "GENERATE",
    })

    return NextResponse.json({ generation })
  } catch (error) {
    if (error instanceof SextouToolsProDatabaseUnavailableError) {
      return NextResponse.json({ error: "SextouTools PRO database unavailable" }, { status: 503 })
    }

    if (isSextouToolsProUsageLimitError(error)) {
      return NextResponse.json({ error: "Usage limit reached", code: (error as Error).message }, { status: 429 })
    }

    if (
      error instanceof Error &&
      (error.message === "unsupported-app" ||
        error.message === "generation-not-found" ||
        error.message.startsWith("openai-response-error") ||
        error.message === "openai-empty-structured-output")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    throw error
  }
}
