import { prisma } from "@/lib/prisma"

async function main() {
  const categories = [
    { id: "1", name: "Alimentação", slug: "alimentacao", icon: "🍕", order: 1 },
    { id: "2", name: "Beleza e Cosméticos", slug: "beleza", icon: "💄", order: 2 },
    { id: "3", name: "Moda e Acessórios", slug: "moda", icon: "👗", order: 3 },
    { id: "4", name: "Serviços Profissionais", slug: "servicos", icon: "💼", order: 4 },
    { id: "5", name: "Saúde e Bem-estar", slug: "saude", icon: "💪", order: 5 },
    { id: "6", name: "Educação e Cursos", slug: "educacao", icon: "📚", order: 6 },
    { id: "7", name: "Automotivo", slug: "automotivo", icon: "🚗", order: 7 },
    { id: "8", name: "Casa e Decoração", slug: "casa", icon: "🏠", order: 8 },
    { id: "9", name: "Tecnologia", slug: "tecnologia", icon: "💻", order: 9 },
    { id: "10", name: "Outros", slug: "outros", icon: "📦", order: 10 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    })
  }

  console.log("Categorias criadas com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
