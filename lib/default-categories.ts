import { prisma } from "@/lib/prisma"

const defaultCategories = [
  { name: "Alimentacao", slug: "alimentacao", icon: "Pizza", order: 1 },
  { name: "Beleza e Cosmeticos", slug: "beleza", icon: "Sparkles", order: 2 },
  { name: "Moda e Acessorios", slug: "moda", icon: "Shirt", order: 3 },
  { name: "Servicos Profissionais", slug: "servicos", icon: "Briefcase", order: 4 },
  { name: "Saude e Bem-estar", slug: "saude", icon: "HeartPulse", order: 5 },
  { name: "Educacao e Cursos", slug: "educacao", icon: "GraduationCap", order: 6 },
  { name: "Automotivo", slug: "automotivo", icon: "Car", order: 7 },
  { name: "Casa e Decoracao", slug: "casa", icon: "Home", order: 8 },
  { name: "Tecnologia", slug: "tecnologia", icon: "Laptop", order: 9 },
  { name: "Outros", slug: "outros", icon: "Package", order: 10 },
]

export async function ensureCategoriesExist() {
  const existingCount = await prisma.category.count()

  if (existingCount === 0) {
    for (const category of defaultCategories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          icon: category.icon,
          order: category.order,
          isActive: true,
        },
        create: {
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          order: category.order,
          isActive: true,
        },
      })
    }
  }
}

export async function getActiveCategories() {
  await ensureCategoriesExist()

  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
}

export async function getAllCategories() {
  await ensureCategoriesExist()

  return prisma.category.findMany({
    orderBy: { order: "asc" },
  })
}
