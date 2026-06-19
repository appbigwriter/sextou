import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { resolveToolkitUser } from "@/lib/sextou-tools/auth"
import { AcessoPremiumClient } from "./acesso-client"

export const metadata = {
  title: "Ativar acesso PRO | SextouTools",
  description: "Publique seu anuncio para liberar os apps PRO e veja como funciona a ativacao do Premium.",
}

const PREMIUM_PATH_PREFIXES = [
  "/sextou-tools-pro/social-network-studio",
  "/sextou-tools-pro/storybrand-strategy-generator",
  "/sextou-tools-pro/youtube-growth-studio",
  "/sextou-tools-pro/zapleads",
  "/sextou-tools-pro/launch-studio-pro",
]

function getSafePath(path?: string) {
  return path && path.startsWith("/") ? path : null
}

function isPremiumIntent(path: string | null) {
  return !!path && PREMIUM_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
}

export default async function SextouToolsProAccessPage({
  searchParams,
}: {
  searchParams?: {
    next?: string
    premium?: string
  }
}) {
  const result = await resolveToolkitUser()
  const requestedPath = getSafePath(searchParams?.next)
  const premiumIntent = searchParams?.premium === "cancelled" || isPremiumIntent(requestedPath)

  const createAdNext = premiumIntent
    ? `/sextou-tools-pro/acesso${requestedPath ? `?next=${encodeURIComponent(requestedPath)}` : ""}`
    : null
  const createAdPath = createAdNext
    ? `/dashboard/anunciar?next=${encodeURIComponent(createAdNext)}`
    : "/dashboard/anunciar"
  const createAdHref =
    result.kind === "unauthorized"
      ? `/cadastro?next=${encodeURIComponent(createAdPath)}`
      : createAdPath
  const loginHref = `/login?next=${encodeURIComponent(createAdPath)}`
  const signupHref = `/cadastro?next=${encodeURIComponent(createAdPath)}`

  const user =
    result.kind === "ok"
      ? {
          fullName: result.user.fullName || "Membro Sextou",
          businessName: result.user.businessName || "Conta ativa no portal",
          hasActiveAds: result.user.hasActiveAds || false,
          isPremium: result.user.isPremium || false,
        }
      : null

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] font-sans">
      <SextouToolsProSuiteHeader
        userName={user?.fullName}
        businessName={user?.businessName}
        showPublicNav
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {result.kind === "db-unavailable" ? (
          <div className="mb-6 rounded-[24px] border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
            O banco de dados esta temporariamente indisponivel. A pagina de orientacao continua no ar,
            mas a validacao do seu status de anunciante pode demorar.
          </div>
        ) : null}

        <AcessoPremiumClient
          user={user}
          createAdHref={createAdHref}
          loginHref={loginHref}
          signupHref={signupHref}
          premiumReturnTo={requestedPath || undefined}
          requestedPath={requestedPath}
          premiumIntent={premiumIntent}
          premiumCancelled={searchParams?.premium === "cancelled"}
        />
      </main>
    </div>
  )
}
