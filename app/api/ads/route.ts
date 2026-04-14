import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const optionalTrimmedString = z.string().trim().optional()

const createAdSchema = z.object({
  categoryId: z.string().trim().min(1, "Categoria e obrigatoria"),
  title: z.string().trim().min(3, "Titulo deve ter pelo menos 3 caracteres"),
  shortDescription: z.string().trim().min(10, "Descricao curta e obrigatoria"),
  fullDescription: z.string().trim().min(20, "Descricao completa e obrigatoria"),
  offerType: z.enum(["PRODUCT", "SERVICE"]),
  price: z.number().nullable(),
  promotionText: optionalTrimmedString,
  city: z.string().trim().min(2, "Cidade e obrigatoria"),
  state: z.string().trim().min(2, "Estado e obrigatorio"),
  deliveryType: z.enum(["LOCAL", "ONLINE", "BOTH"]),
  externalLink: z.string().trim().url("Link externo invalido").optional().or(z.literal("")),
  whatsappContact: z.string().trim().min(10, "WhatsApp e obrigatorio"),
  images: z.array(z.string().url()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    const body = await request.json()
    console.log("[ADS_POST] Payload recebido:", body)

    const result = createAdSchema.safeParse(body)

    if (!result.success) {
      console.error("[ADS_POST] Erro de validacao Zod:", result.error.format())
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

    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        isActive: true,
      },
      select: { id: true },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria invalida ou inativa" },
        { status: 400 }
      )
    }

    const ad = await prisma.ad.create({
      data: {
        userId: user.id,
        categoryId: category.id,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        offerType: data.offerType,
        price: data.price,
        promotionText: data.promotionText || null,
        city: data.city,
        state: data.state,
        deliveryType: data.deliveryType,
        externalLink: data.externalLink || null,
        whatsappContact: data.whatsappContact,
        status: "DRAFT",
        paymentStatus: "PENDING",
        images: {
          create: (data.images || []).map((url, index) => ({
            imageUrl: url,
            order: index,
          })),
        },
      },
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error("Create ad error:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error:
            error.code === "P2003"
              ? "Categoria invalida para este anuncio"
              : "Erro ao criar anuncio no banco de dados",
          code: error.code,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao criar anuncio" },
      { status: 500 }
    )
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    const ads = await prisma.ad.findMany({
      where: { userId: user.id },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(ads)
  } catch (error) {
    console.error("Get ads error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar anuncios" },
      { status: 500 }
    )
  }
}
