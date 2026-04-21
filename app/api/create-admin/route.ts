import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ status: "ok" })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, email, password, name } = body

    if (secret !== "ADMIN_CREATE_SECRET") {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    const passwordHash = await hash(password, 12)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: { isAdmin: true, passwordHash }
      })
      return NextResponse.json({ message: "Admin atualizado" })
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

    return NextResponse.json({ message: "Admin criado", email: user.email })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Erro" }, { status: 500 })
  }
}