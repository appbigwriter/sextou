"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function validatePremiumUser() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Não autenticado")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isPremium: true }
  })

  if (!user || !user.isPremium) {
    throw new Error("Acesso restrito para assinantes Premium")
  }

  return user
}

export async function createChannel(data: {
  channelName: string
  niche: string
  city: string
  primaryOffer: string
}) {
  const user = await validatePremiumUser()

  if (!data.channelName.trim() || !data.niche.trim() || !data.primaryOffer.trim()) {
    throw new Error("Todos os campos básicos são obrigatórios")
  }

  const channel = await prisma.youtubeChannel.create({
    data: {
      userId: user.id,
      channelName: data.channelName.trim(),
      niche: data.niche.trim(),
      city: data.city.trim() || null,
      primaryOffer: data.primaryOffer.trim(),
      isDefault: false
    }
  })

  revalidatePath("/sextou-tools-pro/youtube-growth-studio")
  return { id: channel.id }
}

export async function deleteChannel(channelId: string) {
  const user = await validatePremiumUser()

  await prisma.youtubeChannel.deleteMany({
    where: { id: channelId, userId: user.id }
  })

  revalidatePath("/sextou-tools-pro/youtube-growth-studio")
  return { success: true }
}
