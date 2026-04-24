import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = typeof body.token === "string" ? body.token.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!token) {
      return NextResponse.json({ error: "Token invalido." }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 })
    }

    const resetToken = await (prisma as any).passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken || new Date(resetToken.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Este link de recuperacao e invalido ou expirou." }, { status: 400 })
    }

    const passwordHash = await hash(password, 12)

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    })

    await (prisma as any).passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    })

    return NextResponse.json({
      success: true,
      message: "Senha redefinida com sucesso.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Nao foi possivel redefinir a senha." }, { status: 500 })
  }
}
