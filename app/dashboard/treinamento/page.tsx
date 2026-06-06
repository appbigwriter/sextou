import Link from "next/link"

const tips = [
  {
    number: "1",
    title: "Seja o rosto do seu negócio",
    content: "Câmera no celular, você falando direto. Pequeno empresário que aparece converte mais do que logo bonito. A comunidade brasileira compra de *quem*, não de *o quê*. 30 segundos olhando na câmera e dizendo o que você faz vale mais que qualquer arte no Canva.",
    emoji: "📱"
  },
  {
    number: "2",
    title: "Diga o problema antes de dizer o serviço",
    content: "Não comece com \"Sou eletricista com 10 anos de experiência.\" Comece com \"Sua conta de luz veio absurda? Pode ser fiação antiga.\" Quem tem o problema para e lê. Quem não tem, não é seu cliente de qualquer forma.",
    emoji: "💡"
  },
  {
    number: "3",
    title: "Uma oferta, um botão, uma ação",
    content: "O maior erro do pequeno empresário: colocar telefone, e-mail, site, Instagram e endereço no mesmo anúncio. Escolha um único caminho — geralmente WhatsApp — e coloque só ele. Quanto mais opções, menos cliques.",
    emoji: "🎯"
  },
  {
    number: "4",
    title: "Fale o preço ou fale o resultado — nunca fique no meio",
    content: "\"Preços a partir de X\" não converte. Ou você ancora o preço (\"a partir de US$ 80\") ou ancora o resultado (\"3 clientes novos por semana sem gastar com Google Ads\"). O meio-termo gera curiosidade zero e compromisso zero.",
    emoji: "💰"
  },
  {
    number: "5",
    title: "Renove o anúncio toda semana — mesmo que seja só a foto",
    content: "O algoritmo e a comunidade cansam rápido. Não precisa reescrever tudo: troca a imagem, muda a primeira frase, atualiza com algo da semana (\"essa semana com 20% off\"). Anúncio parado é anúncio invisível.",
    emoji: "🔄"
  },
  {
    number: "6",
    title: "Preço é o que custa. Valor é o que resolve.",
    content: "Nunca entre em guerra de preço com concorrente mais barato — você sempre perde. Em vez de \"cobro menos\", diga \"resolvo mais rápido, sem dor de cabeça, com garantia.\" O cliente brasileiro nos EUA já aprendeu que barato sai caro. Mostre o que ele não vai ter que lidar se escolher você. O preço fecha o contrato. O valor abre a conversa.",
    emoji: "💎"
  },
  {
    number: "7",
    title: "Quanto mais perto, mais fácil de comprar.",
    content: "\"Atendo toda a Flórida\" não diz nada. \"Atendo Orlando, região de Kissimmee e arredores — chego até você\" fecha negócio. Proximidade geográfica cria confiança instantânea na comunidade imigrante — as pessoas querem saber que você está do lado delas, literalmente. Coloque a cidade, o bairro, a referência. Específico converte. Genérico confunde.",
    emoji: "📍"
  },
  {
    number: "8",
    title: "Pergunte antes de oferecer.",
    content: "A abordagem proativa que mais converte não começa com \"te ofereço\" — começa com \"você já teve esse problema?\" Uma pergunta simples no anúncio ou na abordagem direta ativa o cérebro do cliente e faz ele se identificar antes de você gastar uma palavra vendendo. \"Você paga imposto aqui nos EUA e não sabe se está pagando certo?\" — o contador que abre assim não precisa se apresentar. O cliente já chegou com a mão levantada.",
    emoji: "❓"
  },
  {
    number: "9",
    title: "Mostre o depois, não o durante.",
    content: "Ninguém quer ver a obra — todo mundo quer ver a casa pronta. Ninguém quer ver a consulta — quer ver a pessoa bem. Troque fotos de processo por fotos de resultado. Antes e depois. Depoimento real de cliente. Print de mensagem de agradecimento. A prova do resultado é o anúncio mais barato e mais poderoso que existe — e custa zero.",
    emoji: "✨"
  },
  {
    number: "10",
    title: "Volte. De novo. E de novo.",
    content: "A venda raramente acontece no primeiro contato — acontece no quinto. A maioria dos pequenos empresários desiste no segundo. Ter um anúncio ativo no Sextou.biz significa que você está presente toda semana, toda vez que alguém da comunidade procura o que você oferece. Consistência não é persistência chata — é autoridade sendo construída em silêncio. Quem some, perde. Quem fica, vende.",
    emoji: "🚀"
  }
]

export default function SextouTrainningPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#F97316] flex items-center gap-1">
            <span>←</span> Voltar ao Dashboard
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold font-heading text-gray-900 tracking-tight sm:text-5xl">
            Sextou<span className="text-[#F97316]">Trainning</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Dicas para fazer um anúncio matador.
          </p>
        </div>

        {/* 
          Cards Layout: 
          Uses a CSS Grid for responsive columns.
          Cards are styled like playing cards with an inner border, subtle gradients, and elegant typography.
        */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div 
              key={tip.number} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col h-full"
            >
              {/* Card Header area - simulated space for image */}
              <div className="h-40 bg-gradient-to-br from-gray-50 to-orange-50/50 flex items-center justify-center relative border-b border-gray-100">
                <span className="text-6xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {tip.emoji}
                </span>
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center font-heading font-bold text-lg text-[#F97316] shadow-sm border border-white/50">
                  {tip.number}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-3 leading-tight">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-1 text-justify">
                  {tip.content.split('*').map((part, i) => i % 2 === 1 ? <em key={i} className="font-semibold text-gray-800">{part}</em> : part)}
                </p>
              </div>
              
              {/* Decorative bottom bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/dashboard/anunciar"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#F97316] hover:bg-[#EA580C] transition-colors"
          >
            Aplicar Dicas no Meu Anúncio
          </Link>
        </div>
      </div>
    </div>
  )
}
