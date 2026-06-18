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
        hasActiveAds: boolean
        isPremium: boolean
      }
    }
  | { kind: "unauthorized" }
  | { kind: "db-unavailable" }

type SextouToolsProUserLookupResult =
  | ToolkitUserLookupResult
  | {
      kind: "forbidden"
      user: {
        id: string
        fullName: string
        businessName: string
        email: string
        isAdmin: boolean
        hasActiveAds: boolean
        isPremium: boolean
      }
    }

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
        hasActiveAds: true,
        isPremium: true,
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

export async function resolveSextouToolsProUser(): Promise<SextouToolsProUserLookupResult> {
  const result = await lookupToolkitUser()

  if (result.kind !== "ok") {
    return result
  }

  // Pacote PRO: o "pagamento" se dá única e exclusivamente pelos anúncios — acesso liberado
  // unicamente para anunciante ativo (hasActiveAds). Publicar um anúncio ativa hasActiveAds.
  if (!result.user.hasActiveAds) {
    return {
      kind: "forbidden",
      user: result.user,
    }
  }

  return result
}

export async function requireSextouToolsProApiUser() {
  const result = await resolveSextouToolsProUser()

  if (result.kind === "ok") {
    return result.user
  }

  if (result.kind === "db-unavailable") {
    throw new ToolkitDatabaseUnavailableError()
  }

  return result.kind === "forbidden" ? false : null
}

/**
 * Gate dos APPS PREMIUM da suite (ex.: YouTube Growth Studio, Launch Studio PRO).
 * Diferente do Pacote PRO (que basta hasActiveAds), os apps Premium exigem AMBOS:
 * anunciante ativo (hasActiveAds) E assinatura premium (isPremium). Faltando qualquer um → forbidden.
 */
export async function resolveSextouToolsPremiumUser(): Promise<SextouToolsProUserLookupResult> {
  const result = await lookupToolkitUser()

  if (result.kind !== "ok") {
    return result
  }

  if (!result.user.hasActiveAds || !result.user.isPremium) {
    return {
      kind: "forbidden",
      user: result.user,
    }
  }

  return result
}

export async function requireSextouToolsPremiumApiUser() {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind === "ok") {
    return result.user
  }

  if (result.kind === "db-unavailable") {
    throw new ToolkitDatabaseUnavailableError()
  }

  return result.kind === "forbidden" ? false : null
}
