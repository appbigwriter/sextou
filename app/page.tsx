import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isDatabaseUnavailableError } from "@/lib/prisma-guards"
import { MobileMenu } from "@/components/layout/mobile-menu"

const getYoutubeVideoId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
  return match ? match[1] : null
}

export default async function Home() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.email

  let featuredVideo = null
  let isDatabaseUnavailable = false

  try {
    featuredVideo =
      (await prisma.video.findFirst({
        where: { isFeatured: true, isActive: true },
        orderBy: { createdAt: "desc" },
      })) ||
      (await prisma.video.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }))
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error
    }

    isDatabaseUnavailable = true
  }

  const videoId = featuredVideo?.youtubeUrl
    ? getYoutubeVideoId(featuredVideo.youtubeUrl)
    : null

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/anuncios", label: "Anuncios" },
    { href: "/sextou-tools", label: "Sextou Tools" },
    { href: "/videos", label: "Videos" },
    { href: "/como-funciona", label: "Como Funciona" },
    {
      href: isLoggedIn ? "/dashboard" : "/login",
      label: isLoggedIn ? "Meu Dashboard" : "Entrar",
    },
    {
      href: isLoggedIn ? "/dashboard/anunciar" : "/cadastro",
      label: isLoggedIn ? "Novo Anuncio" : "Anunciar Agora",
      isAction: true,
    },
  ]

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo_sextou.png"
              alt="SEXTOU.biz"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link href="/" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Home
            </Link>
            <Link href="/anuncios" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Anuncios
            </Link>
            <Link href="/sextou-tools" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Sextou Tools
            </Link>
            <Link href="/videos" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Videos
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
              className="rounded-lg bg-[#F97316] px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#EA580C] hover:shadow-lg"
            >
              {isLoggedIn ? "Novo Anuncio" : "Anunciar Agora"}
            </Link>
          </nav>
          <MobileMenu links={navLinks} />
        </div>
      </header>

      <section className="relative flex min-h-[650px] items-center justify-center overflow-hidden py-20 md:min-h-[700px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A]">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNEgxNHYtMWgyMXYxem0wLTVIMTR2LTFoMjJ2MXoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
            <div className="order-2 w-full flex-shrink-0 lg:order-1 lg:w-[500px] xl:w-[600px]">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md md:p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                {videoId ? (
                  <div
                    className="relative overflow-hidden rounded-xl bg-black shadow-inner"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                      title="Video em Destaque"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute left-0 top-0 h-full w-full border-0"
                    />
                  </div>
                ) : (
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-800 shadow-inner"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <p className="text-slate-400">
                      {isDatabaseUnavailable ? "Conteudo temporariamente indisponivel" : "Video nao disponivel"}
                    </p>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <p className="font-semibold text-white">
                    Ja tem conta? Entre para acessar seu dashboard.
                  </p>
                  <p className="mb-4 mt-1 text-sm text-slate-300">
                    Acompanhe o status do seu anuncio e gerencie sua assinatura.
                  </p>
                  <Link
                    href={isLoggedIn ? "/dashboard/anunciar" : "/cadastro"}
                    className="inline-block w-full rounded-lg border border-white/30 px-5 py-2.5 text-center font-semibold text-white transition hover:bg-white/10"
                  >
                    {isLoggedIn ? "Enviar novo anuncio" : "Criar conta e anunciar"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="order-1 flex-1 space-y-6 text-center lg:order-2 lg:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-4 py-2">
                <span className="text-xl text-[#FCD34D]">Hot</span>
                <span className="text-xs font-medium text-white/90 md:text-sm">
                  Alcance milhares de brasileiros toda sexta-feira
                </span>
              </div>

              <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                A Vitrine da
                <br />
                <span className="bg-gradient-to-r from-[#F97316] to-[#FCD34D] bg-clip-text text-transparent">
                  Comunidade Brasileira
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl lg:mx-0">
                Toda sexta-feira, em grupo fechado, milhares de brasileiros descobrem negocios incriveis.
                Seu negocio pode ser o proximo.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
                <Link
                  href="/anuncios"
                  className="group flex w-full items-center justify-center space-x-2 rounded-lg bg-[#F97316] px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105 hover:bg-[#EA580C] hover:shadow-2xl sm:w-auto"
                >
                  <span>Ver Anuncios</span>
                  <svg className="h-5 w-5 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="w-full rounded-lg border-2 border-white/30 px-8 py-4 text-center text-lg font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 sm:w-auto"
                >
                  {isLoggedIn ? "Meu Dashboard" : "Entrar"}
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 pt-12 sm:grid-cols-3">
            <div className="text-center">
              <div className="font-heading text-4xl font-bold text-white">1000+</div>
              <div className="mt-1 text-sm text-slate-400">Anuncios</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-4xl font-bold text-white">US$ 30</div>
              <div className="mt-1 text-sm text-slate-400">Por Publicacao</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-4xl font-bold text-white">24h</div>
              <div className="mt-1 text-sm text-slate-400">Aprovacao</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center font-heading text-slate-900">Como Funciona</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600">
            Tres passos simples para colocar seu negocio diante de milhares de potenciais clientes
          </p>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                icon: "1",
                title: "1. Entre ou crie sua conta",
                desc: "Acesse seu dashboard para centralizar seus anuncios e acompanhar o processo.",
              },
              {
                icon: "2",
                title: "2. Envie para analise",
                desc: "Depois de salvar, o anuncio aparece no dashboard com o status da revisao.",
              },
              {
                icon: "3",
                title: "3. Publique na vitrine",
                desc: "Quando o admin aprovar, o anuncio passa a aparecer na vitrine publica.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-card p-8 transition hover:border-[#F97316] hover:shadow-lg"
              >
                <div className="mb-4 text-5xl">{step.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          {isDatabaseUnavailable && (
            <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Parte do conteudo dinamico esta temporariamente indisponivel. O site segue no ar enquanto a conexao com o banco e estabilizada.
            </div>
          )}
          <h2 className="mb-4 text-center font-heading text-slate-900">Por que Anunciar Conosco?</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600">
            A maneira mais eficaz de alcancar a comunidade brasileira
          </p>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "A", title: "Alcance Real", desc: "Milhares de brasileiros engajados toda semana" },
              { icon: "$", title: "Custo Baixo", desc: "Apenas US$ 30 por publicacao, sem taxas ocultas" },
              { icon: "C", title: "Comunidade", desc: "Brasileiros apoiam brasileiros" },
              { icon: "R", title: "Resultados Rapidos", desc: "Contatos diretos via WhatsApp" },
            ].map((benefit, i) => (
              <div key={i} className="rounded-xl p-6 text-center transition hover:bg-slate-50">
                <div className="mb-4 text-5xl">{benefit.icon}</div>
                <h4 className="mb-2 text-lg font-semibold text-slate-900">{benefit.title}</h4>
                <p className="text-sm text-slate-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#EA580C]"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Pronto para Crescer?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
            Entre na sua conta, envie seu anuncio e acompanhe tudo pelo seu dashboard.
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="inline-block rounded-lg bg-white px-10 py-5 text-xl font-bold text-[#F97316] shadow-2xl transition hover:scale-105 hover:bg-slate-100"
          >
            {isLoggedIn ? "Abrir Dashboard" : "Entrar ou criar conta"}
          </Link>
        </div>
      </section>

      <footer className="bg-[#101622] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4">
                <img
                  src="/images/logo_sextou.png"
                  alt="SEXTOU.biz"
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-slate-400">A vitrine da comunidade brasileira</p>
            </div>
            <div>
              <h4 className="mb-4 font-heading font-semibold">Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/anuncios" className="transition hover:text-[#F97316]">Anuncios</Link></li>
                <li><Link href="/sextou-tools" className="transition hover:text-[#F97316]">Sextou Tools</Link></li>
                <li><Link href="/videos" className="transition hover:text-[#F97316]">Videos</Link></li>
                <li><Link href="/como-funciona" className="transition hover:text-[#F97316]">Como Funciona</Link></li>
                <li><Link href={isLoggedIn ? "/dashboard" : "/login"} className="transition hover:text-[#F97316]">{isLoggedIn ? "Meu Dashboard" : "Entrar"}</Link></li>
                <li><Link href={isLoggedIn ? "/dashboard/anunciar" : "/cadastro"} className="transition hover:text-[#F97316]">{isLoggedIn ? "Novo Anuncio" : "Anunciar"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-heading font-semibold">Contato</h4>
              <p className="text-slate-400">contato@sextadoempreendedor.com</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2026 SEXTOU.biz. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
