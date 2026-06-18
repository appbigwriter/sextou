import Link from "next/link"

const ACCESS_HREF = "/sextou-tools-pro/acesso"

const FEATURES = [
  { icon: "📅", title: "Calendário mensal", desc: "Plano completo de vídeos, Shorts e posts para 30 dias. Evita improviso e mantém consistência." },
  { icon: "🎬", title: "Roteiros de vídeo", desc: "Estrutura de abertura, desenvolvimento, CTA e fechamento. Para vender sem parecer forçado." },
  { icon: "💡", title: "Ideias de vídeos", desc: "Temas baseados no seu nicho, cidade, oferta e dúvidas comuns do público brasileiro nos EUA." },
  { icon: "📣", title: "Posts de divulgação", desc: "Textos prontos para Instagram, Facebook, LinkedIn, WhatsApp e comunidade do YouTube." },
  { icon: "🎠", title: "Carrosséis", desc: "Estrutura de slides educativos ou promocionais derivados de cada vídeo. Reaproveite tudo." },
  { icon: "✍️", title: "Legendas", desc: "Legendas curtas, médias e longas para redes sociais. Publique em múltiplos canais sem esforço." },
  { icon: "#", title: "Hashtags", desc: "Hashtags por nicho, cidade, comunidade e intenção de busca. Melhora descoberta e segmentação." },
  { icon: "🎨", title: "Artes sugeridas", desc: "Briefing de thumbnail, capa, carrossel e imagem de apoio. Direção visual mesmo sem designer." },
  { icon: "📝", title: "Descrição do vídeo", desc: "Texto otimizado com resumo, links, CTA e palavras-chave. Ajuda na apresentação e busca." },
  { icon: "🎯", title: "Títulos alternativos", desc: "Variações com foco em curiosidade, autoridade, SEO e venda. Aumenta chance de clique." },
]

const EXAMPLE_ITEMS = [
  { type: "Vídeo longo", content: '"Como escolher uma empresa de limpeza confiável para sua casa em Orlando"' },
  { type: "Shorts", content: '"3 sinais de que sua casa precisa de deep cleaning"' },
  { type: "Carrossel", content: '"Checklist antes de contratar uma empresa de limpeza"' },
  { type: "Post", content: '"Você sabe a diferença entre regular cleaning e deep cleaning?"' },
  { type: "Thumbnail", content: "Pessoa segurando checklist + casa limpa ao fundo" },
  { type: "CTA", content: '"Peça um orçamento para sua casa ou Airbnb em Orlando"' },
]

const STEPS = [
  { title: "Conte sobre seu negócio", desc: "Nicho, cidade, oferta principal e público-alvo. A gente faz o resto." },
  { title: "Escolha estratégia e tom", desc: "Autoridade amigável, educativo leve, energético ou sofisticado. Você decide a voz." },
  { title: "IA gera seu calendário", desc: "30 dias de vídeos, Shorts, posts e ideias — baseados no seu mercado nos EUA." },
  { title: "Receba o pacote completo", desc: "Roteiros, títulos, descrições, hashtags, carrosséis, legendas e briefings de arte." },
  { title: "Exporte e publique", desc: "Baixe em PDF, DOCX, CSV ou Markdown. Copie, edite e publique onde quiser." },
]

const VALUE_ITEMS = [
  "Criar autoridade no mercado local",
  "Explicar seus serviços com clareza",
  "Ser encontrado por brasileiros e clientes fora da comunidade",
  "Reaproveitar um vídeo em vários canais",
  "Economizar tempo com planejamento",
  "Publicar com mais frequência",
  "Vender com mais confiança",
  "Construir presença digital de longo prazo",
]

const PRIMARY_BTN =
  "inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-7 text-sm font-bold text-white shadow-lg shadow-[#FF3D57]/25 transition hover:opacity-95"

/**
 * Vitrine de apresentação do YouTube Growth Studio para usuários sem acesso ao Pacote PRO
 * (sem hasActiveAds e sem isPremium). Todos os CTAs encaminham para a página de vendas /acesso,
 * onde o pagamento por cartão é feito via componente PagamentoStripe.
 */
export function YoutubeGrowthSales() {
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="relative text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] max-w-full bg-[radial-gradient(circle,rgba(255,61,87,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#171717] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#A09D97]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3DDC97] shadow-[0_0_8px_#3DDC97]" /> SextouTools Premium
        </div>
        <h1 className="font-toolkit text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-[#F0EDE6] md:text-6xl">
          Transforme seu YouTube em{" "}
          <span className="bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] bg-clip-text text-transparent">
            máquina de autoridade
          </span>{" "}
          e vendas
        </h1>
        <p className="mx-auto max-w-2xl text-base text-[#A09D97] leading-relaxed md:text-lg">
          Crie em minutos um plano completo para seu canal — vídeos, Shorts, posts, carrosséis, legendas, hashtags e
          artes sugeridas. Tudo adaptado ao seu nicho, sua cidade e seu público nos Estados Unidos.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link href={ACCESS_HREF} className={PRIMARY_BTN}>
            ✨ Desbloquear acesso Premium
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 text-sm font-medium text-[#A09D97] transition hover:text-white"
          >
            Ver o que você ganha ↓
          </a>
        </div>
      </section>

      {/* PAYWALL BANNER */}
      <section className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#171717] p-6 sm:flex sm:items-center sm:gap-5 sm:p-7">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF3D57]/10 to-[#FF8C00]/10 pointer-events-none" />
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-xl">
          🔒
        </div>
        <div className="relative mt-4 sm:mt-0">
          <h3 className="font-toolkit text-xl font-bold text-white">Acesso exclusivo do Pacote PRO Premium</h3>
          <p className="mt-1 text-sm text-[#A09D97]">
            Este app faz parte da suite SextouTools PRO. O acesso requer conta de anunciante ativo e assinatura Premium.
            Veja abaixo tudo que você ganha e desbloqueie agora.
          </p>
        </div>
        <Link href={ACCESS_HREF} className={`relative mt-4 w-full sm:ml-auto sm:mt-0 sm:w-auto ${PRIMARY_BTN}`}>
          Assinar Premium
        </Link>
      </section>

      {/* FEATURES */}
      <section id="features" className="space-y-10 scroll-mt-24">
        <div className="text-center space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#FF8C00]">O que você ganha</div>
          <h2 className="font-toolkit text-3xl font-bold text-white md:text-4xl">10 ferramentas em um único plano mensal</h2>
          <p className="mx-auto max-w-xl text-sm text-[#A09D97]">
            Em vez de depender da inspiração do momento, você passa a ter um plano editorial claro, alinhado ao seu
            público, seu mercado e seus objetivos de venda.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="relative rounded-2xl border border-white/10 bg-[#171717] p-5 transition hover:border-white/20"
            >
              <span className="absolute right-4 top-4 rounded border border-white/10 bg-[#262626] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#FF8C00]">
                PRO
              </span>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl">{f.icon}</div>
              <h3 className="font-toolkit text-[17px] font-bold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#A09D97]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COACH TIP */}
      <section className="mx-auto max-w-2xl rounded-2xl border border-[#FF8C00]/25 bg-gradient-to-br from-[#FF3D57]/10 to-[#FF8C00]/10 p-5">
        <p className="text-sm text-[#F0EDE6]">
          <span className="text-lg">💡</span> <strong className="text-[#FF8C00]">Dica:</strong> um único vídeo bem
          planejado vira conteúdo para YouTube, Instagram, Facebook, WhatsApp e Google Business Profile. O app faz esse
          reaproveitamento automaticamente para você.
        </p>
      </section>

      {/* EXAMPLE */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#FF8C00]">Exemplo real</div>
          <h2 className="font-toolkit text-3xl font-bold text-white md:text-4xl">
            O que o app gera para uma empresa de limpeza em Orlando
          </h2>
          <p className="mx-auto max-w-xl text-sm text-[#A09D97]">
            Um pacote completo, pronto para publicar em todos os canais na mesma semana.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <div className="absolute right-0 top-0 h-48 w-48 bg-[radial-gradient(circle,rgba(255,140,0,0.1)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-2xl">
              🧽
            </div>
            <div>
              <h3 className="font-toolkit text-lg font-bold text-white">Limpeza Residencial Orlando</h3>
              <div className="text-[13px] text-[#A09D97]">Nicho: Serviços · Cidade: Orlando, FL</div>
            </div>
          </div>
          <div className="relative grid gap-2.5">
            {EXAMPLE_ITEMS.map((item) => (
              <div key={item.type} className="flex gap-3 rounded-xl border border-white/10 bg-[#1F1F1F] p-3.5">
                <div className="min-w-[90px] pt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#FF8C00]">
                  {item.type}
                </div>
                <div className="flex-1 text-sm text-[#F0EDE6]">{item.content}</div>
                <div className="text-[#6B6862]">🔒</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#FF8C00]">Como funciona</div>
          <h2 className="font-toolkit text-3xl font-bold text-white md:text-4xl">Em 5 passos simples, seu plano está pronto</h2>
          <p className="mx-auto max-w-xl text-sm text-[#A09D97]">
            Fluxo guiado, mobile-first, feito para quem não tem tempo a perder.
          </p>
        </div>
        <div className="mx-auto grid max-w-2xl gap-3.5">
          {STEPS.map((step, idx) => (
            <div key={step.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#171717] p-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-toolkit text-[15px] font-bold ${
                  idx === 0
                    ? "bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-white"
                    : "border border-white/10 bg-[#1F1F1F] text-[#A09D97]"
                }`}
              >
                {idx + 1}
              </div>
              <div>
                <h4 className="font-toolkit text-[15px] font-bold text-white">{step.title}</h4>
                <p className="mt-1 text-[13px] text-[#A09D97]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#FF8C00]">Por que vale a pena</div>
          <h2 className="font-toolkit text-3xl font-bold text-white md:text-4xl">Para brasileiros empreendendo nos EUA</h2>
          <p className="mx-auto max-w-xl text-sm text-[#A09D97]">
            Você tem bom serviço, boa experiência e boas histórias. Falta só transformar isso em conteúdo consistente.
          </p>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {VALUE_ITEMS.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#171717] p-3.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#3DDC97]/15 text-sm font-bold text-[#3DDC97]">
                ✓
              </div>
              <p className="text-sm text-[#F0EDE6]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] py-14 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,61,87,0.18)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative space-y-5">
          <div className="text-5xl">🎉</div>
          <h2 className="font-toolkit text-3xl font-extrabold text-white md:text-4xl">
            Seu canal merece um{" "}
            <span className="bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] bg-clip-text text-transparent">
              plano de verdade
            </span>
          </h2>
          <p className="mx-auto max-w-md text-sm text-[#A09D97]">
            Desbloqueie o YouTube Growth Studio AI e transforme seu conhecimento em uma vitrine permanente de autoridade,
            conteúdo e geração de oportunidades.
          </p>
          <div className="flex justify-center pt-1">
            <Link href={ACCESS_HREF} className={PRIMARY_BTN}>
              ✨ Assinar SextouTools Premium
            </Link>
          </div>
          <div className="font-mono text-[11px] text-[#6B6862]">Acesso imediato · Cancele quando quiser</div>
        </div>
      </section>
    </div>
  )
}
