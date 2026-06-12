import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { MobileMenu } from "@/components/layout/mobile-menu"

const getYoutubeVideoId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

export const dynamic = "force-dynamic"

export default async function VideosPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.email

  const videos = await prisma.video.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/anuncios", label: "Anuncios" },
    { href: "/videos", label: "Vídeos" },
    { href: "/como-funciona", label: "Como Funciona" },
    { href: isLoggedIn ? "/dashboard" : "/login", label: isLoggedIn ? "Meu Dashboard" : "Entrar" },
    { href: isLoggedIn ? "/dashboard/anunciar" : "/cadastro", label: isLoggedIn ? "Novo Anuncio" : "Anunciar Agora", isAction: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <img src="/images/logo_sextou.png" alt="SEXTOU.biz" className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link href="/" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Home
            </Link>
            <Link href="/anuncios" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Anuncios
            </Link>
            <Link href="/videos" className="font-medium text-[#F97316]">
              Vídeos
            </Link>
            <Link href="/como-funciona" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Como Funciona
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="font-medium text-slate-700 transition hover:text-[#F97316]"
            >
              {isLoggedIn ? "Meu Dashboard" : "Entrar"}
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/anunciar" : "/cadastro"}
              className="rounded-lg bg-[#F97316] px-6 py-2.5 font-semibold text-white transition hover:bg-[#EA580C]"
            >
              {isLoggedIn ? "Novo Anuncio" : "Anunciar Agora"}
            </Link>
          </nav>
          <MobileMenu links={navLinks} />
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A] py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Galeria de Vídeos</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Acompanhe nossas dicas, tutoriais e vídeos da comunidade.
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-12">
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhum vídeo disponível no momento.</h2>
            <p className="text-gray-600">Volte em breve para novidades!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videos.map(video => {
              const videoId = getYoutubeVideoId(video.youtubeUrl)
              return (
                <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow flex flex-col">
                  {videoId ? (
                    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full bg-slate-200 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                      <span className="text-slate-500">Vídeo Indisponível</span>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                        {video.description}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      {video.isFeatured && (
                        <span className="text-xs font-bold bg-[#F97316]/10 text-[#F97316] px-2 py-1 rounded">
                          Destaque
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="bg-[#101622] py-8 text-white mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 SEXTOU.biz. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
