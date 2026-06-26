import { NextResponse } from "next/server"
import { getConnectionState, fetchAllGroups, instanceNameFor, participantPhoneE164 } from "@/lib/evolution"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { getZapConnectionId } from "@/lib/sextou-tools/zap-connection"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId, purpose } = await req.json()
  const instance = instanceNameFor(result.user.id)

  try {
    const state = await getConnectionState(instance)
    if (state.status !== "CONNECTED") {
      return NextResponse.json({ error: "WhatsApp disconnected" }, { status: 400 })
    }

    const groups = await fetchAllGroups(instance, true)
    if (groups.length === 0) {
      return NextResponse.json({ error: "Nenhum grupo encontrado" }, { status: 400 })
    }

    const group = groupId ? groups.find((g) => g.id === groupId) : groups[0]
    if (!group) {
      return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 })
    }

    // O `id` do participante pode ser um LID anônimo (@lid); o telefone real vem em
    // `phoneNumber`. participantPhoneE164 resolve isso e descarta quem só tem LID.
    // A Evolution não retorna o nome em fetchAllGroups, então displayName fica vazio.
    const participants = group.participants || []
    const seen = new Set<string>()
    const extractedContacts = participants
      .map((p) => {
        const phone = participantPhoneE164(p)
        return phone ? { phone, name: "" } : null
      })
      .filter((c): c is { phone: string; name: string } => {
        if (!c) return false
        if (seen.has(c.phone)) return false // dedup dentro do mesmo grupo
        seen.add(c.phone)
        return true
      })

    const connectionId = await getZapConnectionId(result.user.id)

    // Ensure ZapGroup exists
    let dbGroup = await prisma.zapGroup.findFirst({
      where: { userId: result.user.id, externalGroupId: group.id },
    })

    if (!dbGroup) {
      dbGroup = await prisma.zapGroup.create({
        data: {
          userId: result.user.id,
          connectionId: connectionId,
          externalGroupId: group.id,
          name: group.subject,
          memberCount: extractedContacts.length,
        },
      })
    } else {
      await prisma.zapGroup.update({
        where: { id: dbGroup.id },
        data: { memberCount: extractedContacts.length, name: group.subject },
      })
    }

    // Save Extraction
    const extraction = await prisma.zapGroupExtraction.create({
      data: {
        userId: result.user.id,
        groupId: dbGroup.id,
        declaredPurpose: purpose || "Extração Genérica",
        totalFound: extractedContacts.length,
        totalImported: 0,
      },
    })

    let importedCount = 0

    // Processar sequencialmente para não estourar o pool do Prisma.
    for (const contact of extractedContacts) {
      try {
        if (!contact.phone) continue

        const c = await prisma.contact.upsert({
          where: {
            userId_phoneE164: {
              userId: result.user.id,
              phoneE164: contact.phone,
            },
          },
          create: {
            userId: result.user.id,
            phoneE164: contact.phone,
            displayName: contact.name,
            sourceType: "group",
            sourceGroupId: dbGroup.id,
          },
          update: {}, // Do not overwrite if exists
        })

        const existingLead = await prisma.zapLead.findFirst({
          where: { userId: result.user.id, contactId: c.id },
        })

        if (!existingLead) {
          await prisma.zapLead.create({
            data: {
              userId: result.user.id,
              contactId: c.id,
              status: "frio",
            },
          })
          importedCount++
        }
      } catch (e) {
        console.error("Error creating contact/lead", e)
      }
    }

    await prisma.zapGroupExtraction.update({
      where: { id: extraction.id },
      data: { totalImported: importedCount },
    })

    return NextResponse.json({
      message: "Extração concluída",
      group: group.subject,
      leadsExtracted: importedCount,
      totalMembers: extractedContacts.length,
    })
  } catch (error: any) {
    console.error("Extraction error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
