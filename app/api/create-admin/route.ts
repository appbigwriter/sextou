import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { secret, email, password, name } = await request.json()

    if (secret !== "ADMIN_CREATE_SECRET") {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    const passwordHash = await hash(password, 12)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      const updated = await prisma.user.update({
        where: { email },
        data: { 
          passwordHash,
          isAdmin: true,
          fullName: name,
        }
      })
      return NextResponse.json({ 
        message: "Admin atualizado", 
        email: updated.email 
      })
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: name || "Admin",
        businessName: "Admin",
        whatsapp: "0000000000",
        city: "Admin",
        state: "Admin",
        isAdmin: true,
      }
    })

    return NextResponse.json({ 
      message: "Admin criado", 
      email: user.email 
    })
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ error: "Erro ao criar admin" }, { status: 500 })
  }
}