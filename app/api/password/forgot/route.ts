import { randomBytes } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"

function getBaseUrl(request: NextRequest) {
  return process.env.NEXTAUTH_URL || process.env.AUTH_URL || new URL(request.url).origin
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email) {
      return NextResponse.json({ error: "Informe um email valido." }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    })

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Se o email estiver cadastrado, enviaremos um link de recuperacao.",
      })
    }

    await (prisma as any).passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await (prisma as any).passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    const resetUrl = `${getBaseUrl(request)}/resetar-senha?token=${token}`
    await sendPasswordResetEmail(user.email, user.fullName, resetUrl)

    return NextResponse.json({
      success: true,
      message: "Se o email estiver cadastrado, enviaremos um link de recuperacao.",
      ...(process.env.NODE_ENV !== "production" ? { debugResetUrl: resetUrl } : {}),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Nao foi possivel iniciar a recuperacao de senha." }, { status: 500 })
  }
}
