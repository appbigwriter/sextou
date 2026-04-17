import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PaymentOptions } from "@/components/payment-options"

interface Props {
  params: { id: string }
  searchParams?: {
    submitted?: string
    payment?: string
    session_id?: string
  }
}

export default async function DashboardAdDetailPage({ params, searchParams }: Props) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, fullName: true },
  })

  if (!user) {
    redirect("/login")
  }

  const ad = await prisma.ad.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!ad) {
    notFound()
  }

  const statusLabel =
    ad.status === "PUBLISHED"
      ? "Publicado"
      : ad.status === "UNDER_REVIEW"
      ? "Em Analise"
      : ad.status === "REJECTED"
      ? "Rejeitado"
      : ad.status === "AWAITING_PAYMENT"
      ? "Aguardando Pagamento"
      : "Rascunho"

  const statusClass =
    ad.status === "PUBLISHED"
      ? "bg-green-100 text-green-700"
      : ad.status === "UNDER_REVIEW"
      ? "bg-yellow-100 text-yellow-700"
      : ad.status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : ad.status === "AWAITING_PAYMENT"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-[#F97316]">
            SEXTOU.biz
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-[#F97316]">
              Dashboard
            </Link>
            <Link href="/dashboard/anunciar" className="text-gray-600 hover:text-[#F97316]">
              Novo Anuncio
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-sm text-[#F97316] hover:underline">
              Voltar ao dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{ad.title}</h1>
            <p className="mt-1 text-gray-600">
              Acompanhe o status e os detalhes do anuncio enviado por {user.fullName}.
            </p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        {searchParams?.submitted === "1" && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
            <p className="font-semibold">Anuncio enviado para analise.</p>
            <p className="text-sm">
              Agora ele fica no seu dashboard como Em Analise ate a liberacao do admin.
            </p>
          </div>
        )}

        {searchParams?.payment === "required" && (
          <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-900">
            <p className="font-semibold">Falta concluir o pagamento do anuncio.</p>
            <p className="text-sm">
              Escolha abaixo entre cartao de credito ou Zelle para liberar o envio do anuncio para analise.
            </p>
          </div>
        )}

        {searchParams?.payment === "success" && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
            <p className="font-semibold">Pagamento recebido com sucesso.</p>
            <p className="text-sm">
              Seu anuncio agora segue para analise do admin antes de aparecer na vitrine.
            </p>
          </div>
        )}

        {searchParams?.payment === "cancelled" && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
            <p className="font-semibold">Pagamento cancelado.</p>
            <p className="text-sm">
              O anuncio continua salvo, mas voce ainda precisa concluir o pagamento para prosseguir.
            </p>
          </div>
        )}

        {searchParams?.payment === "zelle_submitted" && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
            <p className="font-semibold">Codigo Zelle enviado para confirmacao.</p>
            <p className="text-sm">
              O admin vai validar o pagamento e, depois disso, seu anuncio entra em analise.
            </p>
          </div>
        )}

        {(ad.status === "DRAFT" || ad.status === "REJECTED") && (
          <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-900">
            <p className="font-semibold">
              {ad.status === "DRAFT"
                ? "Seu anuncio ainda nao foi enviado para analise."
                : "Seu anuncio foi rejeitado e precisa de um novo envio para analise."}
            </p>
            <p className="text-sm">
              Clique no botao abaixo para enviar este anuncio para avaliacao do admin.
            </p>
            <form action={`/api/ads/${ad.id}/submit`} method="POST" className="mt-4">
              <button
                type="submit"
                className="rounded-lg bg-[#F97316] px-4 py-2 font-semibold text-white hover:bg-[#EA580C]"
              >
                Enviar para Analise
              </button>
            </form>
          </div>
        )}

        {ad.status === "UNDER_REVIEW" && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
            <p className="font-semibold">Seu anuncio esta em analise.</p>
            <p className="text-sm">
              Neste momento, nenhuma acao do cliente e necessaria. Assim que o admin aprovar,
              ele passa a aparecer na vitrine publica.
            </p>
          </div>
        )}

        {ad.status === "AWAITING_PAYMENT" && (
          <div className="mb-6">
            <PaymentOptions adId={ad.id} amount={ad.paymentAmount || 30} />
          </div>
        )}

        {ad.status === "PUBLISHED" && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
            <p className="font-semibold">Seu anuncio esta publicado.</p>
            <p className="text-sm">
              Ele ja esta visivel na vitrine publica e pode receber visitas dos clientes.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Resumo do anuncio</h2>
              <p className="mt-4 text-gray-700">{ad.shortDescription}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p className="font-medium text-gray-900">{ad.category?.name || "Sem categoria"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de oferta</p>
                  <p className="font-medium text-gray-900">{ad.offerType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cidade</p>
                  <p className="font-medium text-gray-900">
                    {ad.city}, {ad.state || "USA"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entrega</p>
                  <p className="font-medium text-gray-900">{ad.deliveryType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium text-gray-900">{ad.whatsappContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preco</p>
                  <p className="font-medium text-gray-900">
                    {ad.price ? `$${ad.price}` : "Nao informado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Descricao completa</h2>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">{ad.fullDescription}</p>
            </div>

            {ad.images.length > 0 && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Imagens</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {ad.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.imageUrl}
                      alt={ad.title}
                      className="h-56 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Status e desempenho</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status atual</p>
                  <p className="font-medium text-gray-900">{statusLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Criado em</p>
                  <p className="font-medium text-gray-900">
                    {new Date(ad.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visualizacoes</p>
                  <p className="font-medium text-gray-900">{ad.viewsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cliques</p>
                  <p className="font-medium text-gray-900">{ad.clicksCount}</p>
                </div>
                {ad.publishedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Publicado em</p>
                    <p className="font-medium text-gray-900">
                      {new Date(ad.publishedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {ad.externalLink && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Link externo</h2>
                <a
                  href={ad.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block break-all text-[#F97316] hover:underline"
                >
                  {ad.externalLink}
                </a>
              </div>
            )}

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Proximos passos</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li>Use o dashboard para acompanhar o status do seu anuncio.</li>
                <li>Conclua o pagamento para o anuncio seguir para analise do admin.</li>
                <li>Quando o status mudar para Publicado, ele aparece na vitrine.</li>
                <li>Se o anuncio estiver em Rascunho ou Rejeitado, use o botao Enviar para Analise.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
