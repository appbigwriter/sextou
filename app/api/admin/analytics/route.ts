import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30"

    const daysAgo = parseInt(period, 10)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    const [
      totalUsers,
      totalAds,
      publishedAds,
      totalViews,
      totalPayments,
      revenue,
      recentAds,
      topCategories,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.ad.count(),
      prisma.ad.count({ where: { status: "PUBLISHED" } }),
      prisma.ad.aggregate({
        _sum: { viewsCount: true },
        where: { publishedAt: { gte: startDate } },
      }),
      prisma.payment.count({
        where: { status: "CONFIRMED", createdAt: { gte: startDate } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "CONFIRMED", createdAt: { gte: startDate } },
      }),
      prisma.ad.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { businessName: true } },
        },
      }),
      prisma.ad.groupBy({
        by: ["categoryId"],
        _count: { id: true },
        where: { status: "PUBLISHED" },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ])

    const categoryStats = await Promise.all(
      topCategories.map(async (categoryStat) => {
        const category = await prisma.category.findUnique({
          where: { id: categoryStat.categoryId },
        })

        return {
          name: category?.name || "Unknown",
          count: categoryStat._count.id,
        }
      })
    )

    return NextResponse.json({
      period: daysAgo,
      stats: {
        totalUsers,
        totalAds,
        publishedAds,
        totalViews: totalViews._sum.viewsCount || 0,
        totalPayments,
        revenue: revenue._sum.amount || 0,
      },
      recentAds: recentAds.map((ad) => ({
        id: ad.id,
        title: ad.title,
        businessName: ad.user.businessName,
        status: ad.status,
        views: ad.viewsCount,
        createdAt: ad.createdAt,
      })),
      categoryStats,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Erro ao buscar analytics" }, { status: 500 })
  }
}
