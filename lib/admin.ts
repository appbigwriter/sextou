import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function getConfiguredAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || ""
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
    .map(normalizeEmail)
}

export function isConfiguredAdminEmail(email?: string | null) {
  if (!email) {
    return false
  }

  return getConfiguredAdminEmails().includes(normalizeEmail(email))
}

export async function requireAdminPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  if (!session.user.isAdmin && !isConfiguredAdminEmail(session.user.email)) {
    redirect("/dashboard")
  }

  return session
}

export async function requireAdminApi() {
  const session = await auth()

  if (!session?.user?.email) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Nao autorizado" }, { status: 401 }),
    }
  }

  if (!session.user.isAdmin && !isConfiguredAdminEmail(session.user.email)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Acesso restrito ao admin" }, { status: 403 }),
    }
  }

  return {
    ok: true as const,
    session,
  }
}
