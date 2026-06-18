import { NextResponse } from "next/server"
import { whatsappEngine } from "@/lib/whatsapp"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsProUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const result = await resolveSextouToolsProUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId, connectionId, purpose } = await req.json()

  if (whatsappEngine.status !== "CONNECTED") {
    return NextResponse.json({ error: "WhatsApp disconnected" }, { status: 400 })
  }

  const client = whatsappEngine.getClient()
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 500 })
  }

  try {
    const chats = await client.getChats()
    const groups = chats.filter((c) => c.isGroup)
    
    if (groups.length === 0) {
      return NextResponse.json({ error: "Nenhum grupo encontrado" }, { status: 400 })
    }

    const group = groupId ? groups.find((g) => g.id._serialized === groupId) : groups[0]

    if (!group) {
      return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 })
    }

    // Get participants
    const participants = (group as any).participants || []
    const contactPromises = participants.map(async (p: any) => {
      const contactId = p.id._serialized
      const contact = await client.getContactById(contactId)
      return {
        phone: contact.number || p.id.user,
        name: contact.name || contact.pushname || contact.verifiedName || contact.shortName || "",
      }
    })

    const extractedContacts = await Promise.all(contactPromises)

    // Ensure ZapGroup exists
    let dbGroup = await prisma.zapGroup.findFirst({
      where: { userId: result.user.id, externalGroupId: group.id._serialized }
    })
    
    if (!dbGroup) {
      dbGroup = await prisma.zapGroup.create({
        data: {
          userId: result.user.id,
          connectionId: connectionId,
          externalGroupId: group.id._serialized,
          name: group.name,
          memberCount: extractedContacts.length
        }
      })
    } else {
      await prisma.zapGroup.update({
        where: { id: dbGroup.id },
        data: { memberCount: extractedContacts.length, name: group.name }
      })
    }

    // Save Extraction
    const extraction = await prisma.zapGroupExtraction.create({
      data: {
        userId: result.user.id,
        groupId: dbGroup.id,
        declaredPurpose: purpose || "Extração Genérica",
        totalFound: extractedContacts.length,
        totalImported: 0
      },
    })

    let importedCount = 0

    // Processar sequencialmente para não estourar o limite de conexões do Prisma (pool exhaustion)
    for (const contact of extractedContacts) {
      try {
        if (!contact.phone) continue

        const c = await prisma.contact.upsert({
          where: {
            userId_phoneE164: {
              userId: result.user.id,
              phoneE164: contact.phone
            }
          },
          create: {
            userId: result.user.id,
            phoneE164: contact.phone,
            displayName: contact.name,
            sourceType: "group",
            sourceGroupId: dbGroup.id
          },
          update: {} // Do not overwrite if exists
        })

        // Create lead if not exists
        const existingLead = await prisma.zapLead.findFirst({
          where: { userId: result.user.id, contactId: c.id }
        })

        if (!existingLead) {
          await prisma.zapLead.create({
            data: {
              userId: result.user.id,
              contactId: c.id,
              status: "frio"
            }
          })
          importedCount++
        }
      } catch (e) {
        console.error("Error creating contact/lead", e)
      }
    }

    await prisma.zapGroupExtraction.update({
      where: { id: extraction.id },
      data: { totalImported: importedCount }
    })

    return NextResponse.json({
      message: "Extração concluída",
      group: group.name,
      leadsExtracted: importedCount,
      totalMembers: extractedContacts.length
    })

  } catch (error: any) {
    console.error("Extraction error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
