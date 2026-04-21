import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

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

async function main() {
  const adminPasswordHash = await hash("12345", 12)
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@admin.com" }
  })

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@admin.com",
        passwordHash: adminPasswordHash,
        fullName: "Administrador",
        businessName: "Admin",
        whatsapp: "0000000000",
        city: "Admin",
        state: "Admin",
        isAdmin: true,
      }
    })
    console.log("Admin padrão criado: admin@admin.com / 12345")
  } else {
    await prisma.user.update({
      where: { email: "admin@admin.com" },
      data: { isAdmin: true }
    })
    console.log("Admin atualizado: admin@admin.com")
  }

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

    console.log("Categorias padrao criadas com sucesso!")
    return
  }

  console.log(`Seed ignorado: ${existingCount} categorias ja existem.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
