import Link from "next/link"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { auth } from "@/lib/auth"

export default async function ComoFuncionaPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.email

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
            <Link href="/videos" className="font-medium text-slate-700 transition hover:text-[#F97316]">
              Vídeos
            </Link>
            <Link href="/como-funciona" className="font-medium text-[#F97316]">
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

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center font-heading">
            Como funciona o Sextou ?
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 mb-8">
              O Sextou.biz é uma plataforma criada para ajudar empresários, profissionais autônomos e prestadores de serviço a divulgarem seus negócios dentro da comunidade.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Veja como é simples participar:</h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Receba o link de convite</h3>
                  <p className="text-slate-600">Você receberá um link enviado por um amigo, parceiro ou associado do Sextou.biz. Clique nesse link para iniciar seu cadastro.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Preencha seus dados</h3>
                  <p className="text-slate-600 mb-2">Na página de cadastro, informe seus dados corretamente para criar sua conta.</p>
                  <p className="text-slate-600">Após finalizar o registro, você terá acesso ao seu painel pessoal, chamado Dashboard.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Acesse seu Dashboard</h3>
                  <p className="text-slate-600 mb-2">O Dashboard é a área onde você poderá administrar suas informações e criar seus anúncios.</p>
                  <p className="text-slate-600">É por lá que você acompanha seu cadastro, seus anúncios e suas próximas ações dentro da plataforma.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Crie seu primeiro anúncio</h3>
                  <p className="text-slate-600 mb-2">No Dashboard, você poderá criar um anúncio profissional para divulgar seu negócio.</p>
                  <p className="text-slate-600 mb-2">Você poderá incluir:</p>
                  <ul className="list-disc list-inside text-slate-600 mb-2 space-y-1 ml-4">
                    <li>Seu nome ou nome da empresa;</li>
                    <li>Sua foto ou logotipo;</li>
                    <li>Descrição do que você faz;</li>
                    <li>WhatsApp;</li>
                    <li>E-mail;</li>
                    <li>Redes sociais;</li>
                    <li>Site;</li>
                    <li>Outras informações importantes.</li>
                  </ul>
                  <p className="text-slate-600">O objetivo é que as pessoas entendam rapidamente quem você é, o que você oferece e como podem entrar em contato.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Use o código de indicação no primeiro anúncio</h3>
                  <p className="text-slate-600 mb-2">No momento do primeiro pagamento, utilize o código informado pela pessoa que convidou você.</p>
                  <p className="text-slate-600">Esse código identifica quem trouxe você para a comunidade Sextou.biz.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">6</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Pagamentos futuros via Zelle</h3>
                  <p className="text-slate-600 mb-2">Após o primeiro anúncio, os próximos pagamentos serão feitos via Zelle.</p>
                  <p className="text-slate-600 mb-2">Depois de realizar o pagamento, basta informar no sistema o código de confirmação da transação, também conhecido como Transaction ID.</p>
                  <p className="text-slate-600">O Zelle foi escolhido por ser uma forma prática, rápida e com menos custos bancários, facilitando o processo para todos os associados.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">7</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Aguarde a confirmação</h3>
                  <p className="text-slate-600">Após o cadastro, criação do anúncio e confirmação do pagamento, sua publicação será analisada e liberada na plataforma.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold">8</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Comece a divulgar e indicar</h3>
                  <p className="text-slate-600 mb-2">Com seu anúncio ativo, você já pode compartilhar sua página, divulgar seus serviços e convidar novos associados para fazer parte da comunidade.</p>
                  <p className="text-slate-600">Quanto mais pessoas participam, mais forte fica a rede de negócios.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">Sextou.biz</h3>
              <p className="text-slate-600 text-lg">Uma comunidade criada para anunciar, indicar, comprar e vender entre os próprios membros.</p>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Link
                href={isLoggedIn ? "/dashboard/anunciar" : "/cadastro"}
                className="rounded-lg bg-[#F97316] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#EA580C] shadow-md hover:shadow-lg"
              >
                {isLoggedIn ? "Criar Anúncio Agora" : "Cadastre-se e Anuncie"}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#101622] py-8 text-white mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 SEXTOU.biz. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
