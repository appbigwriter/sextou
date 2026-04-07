import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  slug: z.string().min(2, "Slug é obrigatório"),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
})

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createCategorySchema.parse(body)

    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      return NextResponse.json({ error: "Slug já existe" }, { status: 400 })
    }

    const maxOrder = await prisma.category.aggregate({
      _max: { order: true },
    })

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        icon: data.icon || null,
        order: data.order || (maxOrder._max.order || 0) + 1,
        isActive: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Create category error:", error)
    return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 })
  }
}