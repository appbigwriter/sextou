import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Sexta do Empreendedor</h1>
          <nav className="space-x-4">
            <Link href="/anuncios" className="text-white hover:text-gold transition">
              Anúncios
            </Link>
            <Link href="/cadastro" className="bg-gold text-primary px-4 py-2 rounded-lg font-bold hover:bg-darkGold transition">
              Anunciar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
          A Vitrine da<br />Comunidade Brasileira
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Toda sexta-feira, milhares de brasileiros descobrem negócios incríveis. 
          Seu negócio pode ser o próximo!
        </p>
        <Link href="/anuncios" className="inline-block bg-gold text-primary px-8 py-4 rounded-lg text-xl font-bold hover:bg-darkGold transition transform hover:scale-105">
          Ver Anúncios 🔥
        </Link>
      </section>

      {/* Como Funciona */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-primary text-center mb-12">Como Funciona</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border-2 border-gold rounded-xl">
              <div className="text-5xl mb-4">📝</div>
              <h4 className="text-2xl font-bold text-primary mb-2">1. Crie seu Anúncio</h4>
              <p className="text-gray-600">Cadastre seu negócio em minutos</p>
            </div>
            <div className="text-center p-6 border-2 border-gold rounded-xl">
              <div className="text-5xl mb-4">💳</div>
              <h4 className="text-2xl font-bold text-primary mb-2">2. Pague US$ 30</h4>
              <p className="text-gray-600">Investimento único por publicação</p>
            </div>
            <div className="text-center p-6 border-2 border-gold rounded-xl">
              <div className="text-5xl mb-4">🚀</div>
              <h4 className="text-2xl font-bold text-primary mb-2">3. Apareça na Sexta</h4>
              <p className="text-gray-600">Milhares de clientes veem seu negócio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-gradient-to-br from-secondary to-primary py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-white text-center mb-12">Por que Anunciar?</h3>
          <div className="grid md:grid-cols-2 gap-8 text-white">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">📈</div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Alcance Real</h4>
                <p className="text-white/90">Milhares de brasileiros engajados toda semana</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-4xl">💰</div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Investimento Baixo</h4>
                <p className="text-white/90">Apenas US$ 30 por publicação</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🤝</div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Comunidade</h4>
                <p className="text-white/90">Brasileiros apoiam brasileiros</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-4xl">⚡</div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Resultados Rápidos</h4>
                <p className="text-white/90">Contatos diretos via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gold py-20 text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-primary mb-6">Pronto para Crescer?</h3>
          <p className="text-xl text-primary/80 mb-8">Seu negócio merece ser visto</p>
          <Link href="/cadastro" className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-secondary transition transform hover:scale-105">
            Criar Meu Anúncio Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Sexta do Empreendedor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
