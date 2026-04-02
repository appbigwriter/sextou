import Link from 'next/link'
import { mockAds, categories } from '@/lib/mock-data'

export default function AnunciosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-gold transition">
              Sexta do Empreendedor
            </Link>
            <nav className="space-x-4">
              <Link href="/" className="hover:text-gold transition">Home</Link>
              <Link href="/anuncios" className="text-gold font-bold">Anúncios</Link>
              <Link href="/cadastro" className="bg-gold text-primary px-4 py-2 rounded-lg font-bold hover:bg-darkGold transition">
                Anunciar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Descubra Negócios Incríveis
          </h1>
          <p className="text-xl mb-6">
            {mockAds.length} anúncios ativos • Atualizado toda sexta-feira
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="px-4 py-2 bg-gold text-primary rounded-lg font-bold">
              Todos
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gold hover:text-primary transition font-semibold"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Anúncios */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAds.map((ad) => (
            <Link
              key={ad.id}
              href={`/anuncios/${ad.id}`}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-gold transition-all hover:shadow-xl overflow-hidden group"
            >
              {/* Badge Destaque */}
              {ad.featured && (
                <div className="bg-gradient-to-r from-gold to-darkGold text-primary px-4 py-1 text-sm font-bold">
                  ⭐ DESTAQUE
                </div>
              )}

              {/* Imagem Placeholder */}
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 flex items-center justify-center group-hover:from-gold/20 group-hover:to-darkGold/20 transition">
                <span className="text-6xl">📷</span>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">
                    {ad.category}
                  </span>
                  {ad.price > 0 && (
                    <span className="text-2xl font-bold text-gold">
                      ${ad.price}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition">
                  {ad.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {ad.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>📍 {ad.city}, {ad.state}</span>
                  <span className="text-gold font-bold group-hover:underline">
                    Ver detalhes →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-gold to-darkGold py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Seu Negócio Aqui!
          </h2>
          <p className="text-xl text-primary/80 mb-6">
            Por apenas US$ 30, alcance milhares de brasileiros
          </p>
          <Link
            href="/cadastro"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-secondary transition transform hover:scale-105"
          >
            Anunciar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Sexta do Empreendedor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
