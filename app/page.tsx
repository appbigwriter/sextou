import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.email

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-tight text-[#F97316]">
            Sexta do Empreendedor
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-700 hover:text-[#F97316] transition font-medium">
              Home
            </Link>
            <Link href="/anuncios" className="text-slate-700 hover:text-[#F97316] transition font-medium">
              Anuncios
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="text-slate-700 hover:text-[#F97316] transition font-medium"
            >
              {isLoggedIn ? "Meu Dashboard" : "Entrar"}
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/anunciar" : "/cadastro"}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            >
              {isLoggedIn ? "Novo Anuncio" : "Anunciar Agora"}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#101622] via-slate-900 to-[#0F172A]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNEgxNHYtMWgyMXYxem0wLTVIMTR2LTFoMjJ2MXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full px-4 py-2">
              <span className="text-[#FCD34D] text-2xl">🔥</span>
              <span className="text-white/90 font-medium text-sm">
                Alcance milhares de brasileiros toda sexta-feira
              </span>
            </div>

            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
              A Vitrine da
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#FCD34D]">
                Comunidade Brasileira
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Toda sexta-feira, milhares de brasileiros descobrem negocios incriveis.
              Seu negocio pode ser o proximo.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm max-w-3xl mx-auto">
              <p className="text-white font-semibold">
                Ja tem conta? Entre para acessar seu dashboard e acompanhar seus anuncios.
              </p>
              <p className="text-slate-300 text-sm mt-2">
                Depois de enviar um anuncio, ele fica visivel no seu dashboard com o status da analise
                e voce acompanha tudo por la.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="rounded-lg bg-white text-slate-900 px-5 py-3 font-semibold hover:bg-slate-100 transition"
                >
                  {isLoggedIn ? "Abrir Meu Dashboard" : "Entrar para ver meu dashboard"}
                </Link>
                <Link
                  href={isLoggedIn ? "/dashboard/anunciar" : "/cadastro"}
                  className="rounded-lg border border-white/30 text-white px-5 py-3 font-semibold hover:bg-white/10 transition"
                >
                  {isLoggedIn ? "Enviar novo anuncio" : "Criar conta e anunciar"}
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/anuncios"
                className="group bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-4 rounded-lg font-heading font-bold text-lg transition shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
              >
                <span>Ver Anuncios</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="border-2 border-white/30 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg font-heading font-bold text-lg transition backdrop-blur-sm"
              >
                {isLoggedIn ? "Meu Dashboard" : "Entrar"}
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="font-heading font-bold text-4xl text-white">1000+</div>
                <div className="text-slate-400 text-sm mt-1">Anuncios</div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-4xl text-white">US$ 30</div>
                <div className="text-slate-400 text-sm mt-1">Por Publicacao</div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-4xl text-white">24h</div>
                <div className="text-slate-400 text-sm mt-1">Aprovacao</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-center mb-4 text-slate-900">Como Funciona</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto text-lg">
            Tres passos simples para colocar seu negocio diante de milhares de potenciais clientes
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "📝",
                title: "1. Entre ou crie sua conta",
                desc: "Acesse seu dashboard para centralizar seus anuncios e acompanhar o processo.",
              },
              {
                icon: "⏳",
                title: "2. Envie para analise",
                desc: "Depois de salvar, o anuncio aparece no dashboard com o status da revisao.",
              },
              {
                icon: "🚀",
                title: "3. Publique na vitrine",
                desc: "Quando o admin aprovar, o anuncio passa a aparecer na vitrine publica.",
              },
            ].map((step, i) => (
              <div key={i} className="bg-card rounded-xl p-8 border border-slate-200 hover:border-[#F97316] hover:shadow-lg transition">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="font-heading font-semibold text-xl mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-center mb-4 text-slate-900">Por que Anunciar Conosco?</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto text-lg">
            A maneira mais eficaz de alcancar a comunidade brasileira
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "📈", title: "Alcance Real", desc: "Milhares de brasileiros engajados toda semana" },
              { icon: "💰", title: "Custo Baixo", desc: "Apenas US$ 30 por publicacao, sem taxas ocultas" },
              { icon: "🤝", title: "Comunidade", desc: "Brasileiros apoiam brasileiros" },
              { icon: "⚡", title: "Resultados Rapidos", desc: "Contatos diretos via WhatsApp" },
            ].map((benefit, i) => (
              <div key={i} className="text-center p-6 rounded-xl hover:bg-slate-50 transition">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h4 className="font-heading font-semibold text-lg mb-2 text-slate-900">{benefit.title}</h4>
                <p className="text-slate-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#EA580C]"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">
            Pronto para Crescer?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Entre na sua conta, envie seu anuncio e acompanhe tudo pelo seu dashboard.
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="inline-block bg-white text-[#F97316] px-10 py-5 rounded-lg font-heading font-bold text-xl hover:bg-slate-100 transition shadow-2xl hover:scale-105"
          >
            {isLoggedIn ? "Abrir Dashboard" : "Entrar ou criar conta"}
          </Link>
        </div>
      </section>

      <footer className="bg-[#101622] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">Sexta do Empreendedor</h3>
              <p className="text-slate-400">A vitrine da comunidade brasileira</p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/anuncios" className="hover:text-[#F97316] transition">Anuncios</Link></li>
                <li><Link href={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-[#F97316] transition">{isLoggedIn ? "Meu Dashboard" : "Entrar"}</Link></li>
                <li><Link href={isLoggedIn ? "/dashboard/anunciar" : "/cadastro"} className="hover:text-[#F97316] transition">{isLoggedIn ? "Novo Anuncio" : "Anunciar"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Contato</h4>
              <p className="text-slate-400">contato@sextadoempreendedor.com</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2026 Sexta do Empreendedor. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
