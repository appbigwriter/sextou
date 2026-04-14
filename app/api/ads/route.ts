import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createAdSchema = z.object({
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  shortDescription: z.string().min(10, "Descrição curta é obrigatória"),
  fullDescription: z.string().min(20, "Descrição completa é obrigatória"),
  offerType: z.enum(["PRODUCT", "SERVICE"]),
  price: z.number().nullable(),
  promotionText: z.string().optional(),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  deliveryType: z.enum(["LOCAL", "ONLINE", "BOTH"]),
  externalLink: z.string().url().optional().or(z.literal("")),
  whatsappContact: z.string().min(10, "WhatsApp é obrigatório"),
  images: z.array(z.string().url()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const body = await request.json()
    console.log("[ADS_POST] Payload recebido:", body)

    const result = createAdSchema.safeParse(body)
    
    if (!result.success) {
      console.error("[ADS_POST] Erro de validação Zod:", result.error.format())
      return NextResponse.json(
        { 
          error: "Dados inválidos", 
          details: result.error.issues.map(i => ({ path: i.path, message: i.message })) 
        },
        { status: 400 }
      )
    }

    const data = result.data

    const ad = await prisma.ad.create({
      data: {
        userId: user.id,
        categoryId: data.categoryId,
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
    }

    console.error("Create ad error:", error)
    return NextResponse.json(
      { error: "Erro ao criar anúncio" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
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
      { error: "Erro ao buscar anúncios" },
      { status: 500 }
    )
  }
}
