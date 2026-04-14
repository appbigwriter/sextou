import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const optionalTrimmedString = z.string().trim().optional()

const registerSchema = z.object({
  email: z.string().trim().email("Email invalido").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  fullName: z.string().trim().min(2, "Nome completo e obrigatorio"),
  businessName: z.string().trim().min(2, "Nome da empresa e obrigatorio"),
  whatsapp: z.string().trim().min(10, "WhatsApp e obrigatorio"),
  city: z.string().trim().min(2, "Cidade e obrigatoria"),
  state: z.string().trim().min(2, "Estado e obrigatorio"),
  instagram: optionalTrimmedString,
  website: optionalTrimmedString,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[REGISTER_POST] Payload recebido:", {
      ...body,
      password: "[REDACTED]",
      confirmPassword: "[REDACTED]",
    })

    const result = registerSchema.safeParse(body)

    if (!result.success) {
      console.error("[REGISTER_POST] Erro de validacao Zod:", result.error.format())
      return NextResponse.json(
        {
          error: "Dados invalidos",
          details: result.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const data = result.data

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ja esta cadastrado" },
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
    const errMsg = error instanceof Error ? error.message : String(error)
    const errCode = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : "UNKNOWN"
    console.error("[REGISTER ERROR]", { code: errCode, message: errMsg, error })

    return NextResponse.json(
      { error: "Erro ao criar conta", detail: errMsg, code: errCode },
      { status: 500 }
    )
  }
}
