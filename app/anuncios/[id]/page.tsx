import Link from 'next/link'
import { mockAds } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

export default function AdDetailPage({ params }: { params: { id: string } }) {
  const ad = mockAds.find(a => a.id === params.id)
  
  if (!ad) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-gold transition">
              Sexta do Empreendedor
            </Link>
            <Link href="/anuncios" className="hover:text-gold transition">
              ← Voltar para Anúncios
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Galeria de Imagens */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-96 md:h-full flex items-center justify-center">
              <span className="text-9xl">📷</span>
            </div>

            {/* Informações */}
            <div className="p-8">
              {/* Badge */}
              {ad.featured && (
                <div className="inline-block bg-gradient-to-r from-gold to-darkGold text-primary px-4 py-2 rounded-lg font-bold mb-4">
                  ⭐ ANÚNCIO EM DESTAQUE
                </div>
              )}

              {/* Categoria */}
              <div className="text-sm font-bold text-secondary bg-secondary/10 px-3 py-1 rounded inline-block mb-4">
                {ad.category}
              </div>

              {/* Título */}
              <h1 className="text-4xl font-extrabold text-primary mb-4">
                {ad.title}
              </h1>

              {/* Localização */}
              <div className="flex items-center text-gray-600 mb-6">
                <span className="text-xl mr-2">📍</span>
                <span className="text-lg">{ad.city}, {ad.state}</span>
              </div>

              {/* Preço */}
              {ad.price > 0 && (
                <div className="mb-6">
                  <span className="text-sm text-gray-600">A partir de</span>
                  <div className="text-5xl font-bold text-gold">
                    ${ad.price}
                  </div>
                </div>
              )}

              {/* Descrição */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-3">Sobre o Serviço</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {ad.description}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition transform hover:scale-105"
                >
                  💬 Falar no WhatsApp
                </a>

                {ad.website && (
                  <a
                    href={ad.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-primary text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-secondary transition"
                  >
                    🌐 Visitar Site
                  </a>
                )}

                {ad.instagram && (
                  <a
                    href={`https://instagram.com/${ad.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-4 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition"
                  >
                    📸 Instagram
                  </a>
                )}

                <button className="block w-full bg-gold text-primary text-center py-4 rounded-lg font-bold text-lg hover:bg-darkGold transition">
                  ⭐ Tenho Interesse
                </button>

                <button className="block w-full border-2 border-gold text-gold text-center py-4 rounded-lg font-bold text-lg hover:bg-gold hover:text-primary transition">
                  🔗 Compartilhar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Sexta do Empreendedor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
