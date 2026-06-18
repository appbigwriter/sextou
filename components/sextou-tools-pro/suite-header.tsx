import Link from "next/link"

interface SextouToolsProSuiteHeaderProps {
  userName?: string | null
  businessName?: string | null
  showPublicNav?: boolean
}

export function SextouToolsProSuiteHeader({
  userName,
  businessName,
  showPublicNav = false,
}: SextouToolsProSuiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0D]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#F0EDE6] transition hover:text-white">
            <img src="/images/logoPNGSextou.png" alt="SEXTOU.biz" className="h-9 w-auto object-contain" />
          </Link>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5A5755]">
              SextouTools PRO
            </p>
            <p className="font-toolkit text-xl font-extrabold text-[#F0EDE6]">
              Ferramentas Gratuitas Pacote PRO
            </p>
          </div>
        </div>

        {showPublicNav ? (
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/sextou-tools"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
            >
              Ver suite atual
            </Link>
            <Link
              href="/login?next=/sextou-tools-pro/dashboard"
              className="rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Entrar para usar
            </Link>
          </div>
        ) : (
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-[#F0EDE6]">{userName || "Membro Sextou"}</p>
            <p className="text-xs text-[#A09D97]">{businessName || "Conta ativa no portal"}</p>
          </div>
        )}
      </div>
    </header>
  )
}
