"use server"

import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function validatePremiumUser() {
  const access = await resolveSextouToolsPremiumUser()

  if (access.kind !== "ok") {
    throw new Error(
      access.kind === "unauthorized"
        ? "Não autenticado"
        : "Acesso restrito ao Pacote Premium (anúncio ativo + assinatura)"
    )
  }

  return access.user
}

export async function createProject(data: { name: string; targetAudience: string; rawIdea: string }) {
  const user = await validatePremiumUser()

  if (!data.name.trim() || !data.targetAudience.trim() || !data.rawIdea.trim()) {
    throw new Error("Todos os campos básicos são obrigatórios")
  }

  const project = await prisma.sb7Project.create({
    data: {
      userId: user.id,
      appId: "storybrand-strategy-generator",
      name: data.name.trim(),
      targetAudience: data.targetAudience.trim(),
      rawIdea: data.rawIdea.trim(),
      status: "draft"
    }
  })

  revalidatePath("/sextou-tools-pro/storybrand-strategy-generator")
  return { id: project.id }
}

export async function duplicateProject(projectId: string) {
  const user = await validatePremiumUser()

  const project = await prisma.sb7Project.findFirst({
    where: { id: projectId, userId: user.id },
    include: {
      sessions: true,
      brandScripts: {
        include: {
          collaterals: true
        }
      }
    }
  })

  if (!project) {
    throw new Error("Projeto não encontrado")
  }

  // Encontra um nome não duplicado
  let newName = `${project.name} (Cópia)`
  let nameExists = true
  let counter = 1
  while (nameExists) {
    const existing = await prisma.sb7Project.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name: newName
        }
      }
    })
    if (!existing) {
      nameExists = false
    } else {
      counter++
      newName = `${project.name} (Cópia ${counter})`
    }
  }

  // Duplica o projeto base
  const newProject = await prisma.sb7Project.create({
    data: {
      userId: user.id,
      appId: project.appId,
      name: newName,
      targetAudience: project.targetAudience,
      rawIdea: project.rawIdea,
      brandVoice: project.brandVoice,
      language: project.language,
      channels: project.channels,
      status: project.status
    }
  })

  // Duplica a última sessão se houver
  const activeSession = project.sessions[0]
  if (activeSession) {
    await prisma.sb7InterviewSession.create({
      data: {
        projectId: newProject.id,
        userId: user.id,
        questions: activeSession.questions || {},
        answers: activeSession.answers || {},
        status: activeSession.status
      }
    })
  }

  // Duplica o brandscript e collaterals correspondentes
  const currentBrandScript = project.brandScripts.find(bs => bs.isCurrent)
  if (currentBrandScript) {
    const newBs = await prisma.sb7BrandScript.create({
      data: {
        projectId: newProject.id,
        userId: user.id,
        version: 1,
        heroWant: currentBrandScript.heroWant,
        problemExternal: currentBrandScript.problemExternal,
        problemInternal: currentBrandScript.problemInternal,
        problemPhilosophical: currentBrandScript.problemPhilosophical,
        villain: currentBrandScript.villain,
        empathy: currentBrandScript.empathy,
        authority: currentBrandScript.authority || [],
        planProcess: currentBrandScript.planProcess || [],
        planAgreement: currentBrandScript.planAgreement || [],
        ctaDirect: currentBrandScript.ctaDirect,
        ctaTransitional: currentBrandScript.ctaTransitional,
        stakes: currentBrandScript.stakes || [],
        success: currentBrandScript.success || {},
        oneLiner: currentBrandScript.oneLiner,
        isCurrent: true
      }
    })

    const currentCollateral = currentBrandScript.collaterals[0]
    if (currentCollateral) {
      await prisma.sb7Collateral.create({
        data: {
          brandScriptId: newBs.id,
          userId: user.id,
          wireframe: currentCollateral.wireframe || {},
          leadGenerator: currentCollateral.leadGenerator || {},
          nurtureEmails: currentCollateral.nurtureEmails || [],
          salesEmails: currentCollateral.salesEmails || []
        }
      })
    }
  }

  revalidatePath("/sextou-tools-pro/storybrand-strategy-generator")
  return { id: newProject.id }
}

export async function archiveProject(projectId: string) {
  const user = await validatePremiumUser()

  await prisma.sb7Project.updateMany({
    where: { id: projectId, userId: user.id },
    data: { status: "archived" }
  })

  revalidatePath("/sextou-tools-pro/storybrand-strategy-generator")
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const user = await validatePremiumUser()

  await prisma.sb7Project.deleteMany({
    where: { id: projectId, userId: user.id }
  })

  revalidatePath("/sextou-tools-pro/storybrand-strategy-generator")
  return { success: true }
}

export async function saveInterviewAnswers(
  projectId: string,
  answers: any,
  options: { tone: string; language: string; channels: string[] }
) {
  const user = await validatePremiumUser()

  // Salva no banco de dados nas tabelas correspondentes
  const session = await prisma.sb7InterviewSession.findFirst({
    where: { projectId, userId: user.id }
  })

  if (!session) {
    throw new Error("Sessão de entrevista não encontrada")
  }

  await prisma.sb7InterviewSession.update({
    where: { id: session.id },
    data: {
      answers,
      status: "completed"
    }
  })

  await prisma.sb7Project.update({
    where: { id: projectId, userId: user.id },
    data: {
      brandVoice: options.tone,
      language: options.language,
      channels: options.channels,
      status: "interviewing" // pronto para gerar
    }
  })

  return { success: true }
}

