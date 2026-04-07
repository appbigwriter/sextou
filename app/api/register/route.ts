import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  businessName: z.string().min(2, "Nome da empresa é obrigatório"),
  whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  instagram: z.string().optional(),
  website: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      )
    }

    const passwordHash = await hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        businessName: data.businessName,
        whatsapp: data.whatsapp,
        city: data.city,
        state: data.state,
        instagram: data.instagram || null,
        website: data.website || null,
      },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      businessName: user.businessName,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    
    // Log detalhado para diagnóstico
    const errMsg = error instanceof Error ? error.message : String(error)
    const errCode = (error as any)?.code || 'UNKNOWN'
    console.error("[REGISTER ERROR]", { code: errCode, message: errMsg, error })
    
    return NextResponse.json(
      { error: "Erro ao criar conta", detail: errMsg, code: errCode },
      { status: 500 }
    )
  }
}
