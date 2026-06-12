const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const video = await prisma.video.create({
    data: {
      title: "Como funciona o Sextou.biz?",
      youtubeUrl: "https://youtu.be/KZaLQPcGTS8",
      description: "Vídeo explicativo sobre como anunciar e participar da comunidade.",
      isFeatured: true,
      isActive: true,
    }
  })
  console.log("Created video:", video)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
