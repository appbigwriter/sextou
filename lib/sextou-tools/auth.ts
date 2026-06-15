import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ToolkitDatabaseUnavailableError, isToolkitDatabaseConnectionError } from "@/lib/sextou-tools/prisma-guards"
import { redirect } from "next/navigation"

type ToolkitUserLookupResult =
  | {
      kind: "ok"
      user: {
        id: string
        fullName: string
        businessName: string
        email: string
        isAdmin: boolean
      }
    }
  | { kind: "unauthorized" }
  | { kind: "db-unavailable" }

async function lookupToolkitUser(): Promise<ToolkitUserLookupResult> {
  const session = await auth()

  if (!session?.user?.email) {
    return { kind: "unauthorized" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        fullName: true,
        businessName: true,
        email: true,
        isAdmin: true,
      },
    })

    if (!user) {
      return { kind: "unauthorized" }
    }

    return { kind: "ok", user }
  } catch (error) {
    if (isToolkitDatabaseConnectionError(error)) {
      return { kind: "db-unavailable" }
    }

    throw error
  }
}

export async function requireToolkitUser() {
  const result = await lookupToolkitUser()

  if (result.kind === "ok") {
    return result.user
  }

  if (result.kind === "db-unavailable") {
    throw new ToolkitDatabaseUnavailableError()
  }

  redirect("/login?next=/sextou-tools")
}

export async function requireToolkitApiUser() {
  const result = await lookupToolkitUser()

  if (result.kind === "ok") {
    return result.user
  }

  if (result.kind === "db-unavailable") {
    throw new ToolkitDatabaseUnavailableError()
  }

  return null
}

export async function resolveToolkitUser() {
  return lookupToolkitUser()
}
