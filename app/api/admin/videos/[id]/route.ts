import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export const runtime = "nodejs"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()
  if (!adminCheck.ok) return adminCheck.response

  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
    })
    
    if (!video) {
      return NextResponse.json({ error: "Vídeo não encontrado" }, { status: 404 })
    }
    
    return NextResponse.json(video)
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: "Erro ao buscar vídeo" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()
  if (!adminCheck.ok) return adminCheck.response

  try {
    const json = await request.json()
    const { title, youtubeUrl, description, isFeatured, isActive } = json

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: "Título e URL do YouTube são obrigatórios" }, { status: 400 })
    }

    const video = await prisma.video.update({
      where: { id: params.id },
      data: {
        title,
        youtubeUrl,
        description,
        isFeatured: Boolean(isFeatured),
        isActive: Boolean(isActive),
      },
    })

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json({ error: "Erro ao atualizar vídeo" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()
  if (!adminCheck.ok) return adminCheck.response

  try {
    await prisma.video.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json({ error: "Erro ao excluir vídeo" }, { status: 500 })
  }
}
