import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdminApi()
  if (!adminCheck.ok) return adminCheck.response

  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Erro ao buscar vídeos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdminApi()
  if (!adminCheck.ok) return adminCheck.response

  try {
    const json = await request.json()
    const { title, youtubeUrl, description, isFeatured, isActive } = json

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: "Título e URL do YouTube são obrigatórios" }, { status: 400 })
    }

    // Se este for marcado como destaque, e já existirem outros, talvez remover destaque dos outros?
    // Mas o usuário pode querer gerenciar manualmente. 
    // Vamos apenas salvar.

    const video = await prisma.video.create({
      data: {
        title,
        youtubeUrl,
        description,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    })

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Erro ao criar vídeo" }, { status: 500 })
  }
}
