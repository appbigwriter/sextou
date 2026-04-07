import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cache } from "react"

export const dynamic = "force-dynamic"

const getCategories = cache(() => 
  prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const city = searchParams.get("city")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")

    const where: any = {
      status: "PUBLISHED",
    }

    if (category) {
      where.categoryId = category
    }

    if (city) {
      where.city = { contains: city }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { fullDescription: { contains: search } },
      ]
    }

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        include: {
          category: true,
          user: {
            select: {
              businessName: true,
              whatsapp: true,
              instagram: true,
              website: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ad.count({ where }),
    ])

    return NextResponse.json({
      ads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Get public ads error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar anúncios" },
      { status: 500 }
    )
  }
}