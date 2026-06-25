import { prisma } from "@/lib/prisma"
import { instanceNameFor, type WhatsAppStatus } from "@/lib/evolution"

/**
 * Mantém o registro `ZapConnection` do usuário sincronizado com o estado real
 * da instância Evolution. Cada usuário tem no máximo um registro por instância
 * (sessionRef = nome da instância). Retorna o id da conexão.
 */
export async function syncZapConnection(userId: string, status: WhatsAppStatus): Promise<string> {
  const instance = instanceNameFor(userId)
  const existing = await prisma.zapConnection.findFirst({
    where: { userId, sessionRef: instance },
  })

  if (existing) {
    if (existing.status !== status) {
      await prisma.zapConnection.update({ where: { id: existing.id }, data: { status } })
    }
    return existing.id
  }

  const created = await prisma.zapConnection.create({
    data: { userId, mode: "evolution", sessionRef: instance, status },
  })
  return created.id
}

export async function getZapConnectionId(userId: string): Promise<string | null> {
  const instance = instanceNameFor(userId)
  const conn = await prisma.zapConnection.findFirst({
    where: { userId, sessionRef: instance },
  })
  return conn?.id ?? null
}
