import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getActiveCategories } from "@/lib/default-categories"

export const dynamic = "force-dynamic"

const createCategorySchema = z.object({
  name: z.string().min(2, "Nome e obrigatorio"),
  slug: z.string().min(2, "Slug e obrigatorio"),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
})

export async function GET() {
  try {
    const categories = await getActiveCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json(
      {
        error: "Erro ao buscar categorias",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
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
      return NextResponse.json({ error: "Slug ja existe" }, { status: 400 })
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
    return NextResponse.json(
      {
        error: "Erro ao criar categoria",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
