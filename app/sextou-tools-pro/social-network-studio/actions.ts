"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function validateAdsUser() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Não autenticado")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, hasActiveAds: true }
  })

  if (!user || !user.hasActiveAds) {
    throw new Error("Acesso restrito para usuários com anúncios ativos")
  }

  return user
}

export interface SaveWizardData {
  projectName: string
  targetAudience: string
  basicIdea: string
  dorPrincipal: string
  medo: string
  sonho: string
  promessa: string
  provaSocial: string
  escassez: string
}

export async function saveSocialNetworkWizard(data: SaveWizardData) {
  const user = await validateAdsUser()

  // Validação básica dos campos
  if (
    !data.projectName.trim() ||
    !data.targetAudience.trim() ||
    !data.basicIdea.trim() ||
    !data.dorPrincipal.trim() ||
    !data.medo.trim() ||
    !data.sonho.trim() ||
    !data.promessa.trim() ||
    !data.provaSocial.trim() ||
    !data.escassez.trim()
  ) {
    throw new Error("Todos os campos do projeto e do Canvas da Oferta 11 Estrelas são obrigatórios.")
  }

  // 1. Cria ou encontra o projeto
  let project = await prisma.socialNetworkProject.findFirst({
    where: {
      userId: user.id,
      projectName: data.projectName.trim(),
    }
  })

  if (!project) {
    project = await prisma.socialNetworkProject.create({
      data: {
        userId: user.id,
        projectName: data.projectName.trim(),
        targetAudience: data.targetAudience.trim(),
        basicIdea: data.basicIdea.trim(),
      }
    })
  }

  // 2. Cria a execução PremiumAppRun para auditar custos da IA posterior
  const appRun = await prisma.premiumAppRun.create({
    data: {
      userId: user.id,
      appId: "social-network-studio",
      artifactType: "campaign",
      artifactStatus: "pending",
      totalEstimatedCost: 0,
      totalActualCost: 0,
      totalLatencyMs: 0,
      totalLlmCalls: 0,
    }
  })

  // 3. Cria a campanha baseada no Canvas de 11 Estrelas
  const now = new Date()
  const campaign = await prisma.socialNetworkCampaign.create({
    data: {
      projectId: project.id,
      premiumRunId: appRun.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      dorPrincipal: data.dorPrincipal.trim(),
      medo: data.medo.trim(),
      sonho: data.sonho.trim(),
      promessa: data.promessa.trim(),
      provaSocial: data.provaSocial.trim(),
      escassez: data.escassez.trim(),
      status: "draft",
      version: 1,
    }
  })

  revalidatePath("/sextou-tools-pro/social-network-studio")
  return { projectId: project.id, campaignId: campaign.id }
}

export async function deleteSocialProject(projectId: string) {
  const user = await validateAdsUser()
  
  await prisma.socialNetworkProject.deleteMany({
    where: {
      id: projectId,
      userId: user.id,
    }
  })

  revalidatePath("/sextou-tools-pro/social-network-studio")
  return { success: true }
}
