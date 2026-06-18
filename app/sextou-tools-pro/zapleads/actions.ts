"use server"

import { prisma } from "@/lib/prisma"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"

export async function initiateWhatsAppConnection() {
  const result = await resolveSextouToolsProUser()
  if (result.kind !== "ok") {
    throw new Error("Unauthorized")
  }

  // Marcar aceite de risco e criar conexao mockada
  const connection = await prisma.zapConnection.create({
    data: {
      userId: result.user.id,
      mode: "web",
      status: "connecting",
      riskAcknowledgedAt: new Date(),
    },
  })

  return { success: true, connectionId: connection.id }
}

export async function checkConnectionStatus(connectionId: string) {
  const result = await resolveSextouToolsProUser()
  if (result.kind !== "ok") throw new Error("Unauthorized")

  const connection = await prisma.zapConnection.findFirst({
    where: { id: connectionId, userId: result.user.id },
  })

  // Mocked response: return connected state if it's over 15 seconds, or just stick to 'connecting'
  // Na pratica aqui a API do backend diria se o scan foi feito
  return { status: connection?.status || "disconnected" }
}

export async function extractMockedGroup(purpose: string, connectionId?: string) {
  const result = await resolveSextouToolsProUser()
  if (result.kind !== "ok") throw new Error("Unauthorized")

  const userId = result.user.id

  // 1. Create a mocked ZapGroup
  const group = await prisma.zapGroup.create({
    data: {
      userId,
      connectionId: connectionId || null,
      externalGroupId: `mock-group-${Date.now()}`,
      name: "Grupo Desafio Vendas (Mock)",
      memberCount: 150,
      lastExtractedAt: new Date(),
    },
  })

  // 2. Register the extraction
  await prisma.zapGroupExtraction.create({
    data: {
      userId,
      groupId: group.id,
      declaredPurpose: purpose,
      limitApplied: 10, // simularemos 10 leads para não poluir
      totalFound: 150,
      totalImported: 10,
      totalSkipped: 140,
    },
  })

  // 3. Import Contacts and Leads
  const newContacts = []
  for (let i = 0; i < 10; i++) {
    // Random 11 digit phone starting with 55
    const randomPhone = `55119${Math.floor(10000000 + Math.random() * 90000000)}`
    
    const contact = await prisma.contact.create({
      data: {
        userId,
        phoneE164: randomPhone,
        displayName: `Lead Desafio ${i + 1}`,
        sourceGroupId: group.id,
      },
    })
    
    // Create lead
    await prisma.zapLead.create({
      data: {
        userId,
        contactId: contact.id,
        status: "frio",
        heatScore: 0,
      },
    })
    newContacts.push(contact)
  }

  // Artificial delay for UI realism
  await new Promise((resolve) => setTimeout(resolve, 3000))

  return { imported: 10, total: 150 }
}
