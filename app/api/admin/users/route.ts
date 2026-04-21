import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const { email, password, fullName, businessName, whatsapp, city, state, isAdmin: isUserAdmin, isVip } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, senha e nome sao obrigatorios" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Ja existe um usuario com este email" },
        { status: 400 }
      )
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        businessName: businessName || fullName,
        whatsapp: whatsapp || "",
        city: city || "",
        state: state || "",
        isAdmin: isUserAdmin || false,
        isVip: isVip || false,
      }
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Erro ao criar usuario" }, { status: 500 })
  }
}