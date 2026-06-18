import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const result = await resolveSextouToolsPremiumUser()

  if (result.kind !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { contacts } = await req.json()

    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
    }

    let importedCount = 0

    // Busca ou cria o Grupo padrão de "Importação CSV" para organizar
    let dbGroup = await prisma.zapGroup.findFirst({
      where: { userId: result.user.id, name: "Importação CSV" }
    })
    
    if (!dbGroup) {
      dbGroup = await prisma.zapGroup.create({
        data: {
          userId: result.user.id,
          externalGroupId: "csv_import",
          name: "Importação CSV",
        }
      })
    }

    // Usar loop for para não esgotar as conexões (Connection Pool Exhaustion)
    for (const contact of contacts) {
      if (!contact.phone) continue

      try {
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
            displayName: contact.name || "Desconhecido",
            sourceType: "csv_import",
            sourceGroupId: dbGroup.id
          },
          update: {} // Ignora se já existe
        })

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
      } catch (err) {
        console.error("Erro importando lead específico", err)
      }
    }

    return NextResponse.json({ success: true, count: importedCount })
  } catch (error: any) {
    console.error("Import error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
