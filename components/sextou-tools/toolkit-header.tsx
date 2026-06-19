import Link from "next/link"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { LogoutButton } from "@/components/logout-button"

interface ToolkitHeaderProps {
  userName: string
  businessName?: string | null
}

export function ToolkitHeader({ userName, businessName }: ToolkitHeaderProps) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/anuncios", label: "Ver Vitrine" },
    { href: "/dashboard", label: "Meu Dashboard" },
    { href: "/sextou-tools", label: "Sextou Tools" },
    { href: "/dashboard/configuracoes", label: "Configuracoes" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0D]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#F0EDE6] transition hover:text-white">
            <img src="/images/logoPNGSextou.png" alt="SEXTOU.biz" className="h-9 w-auto object-contain" />
          </Link>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5A5755]">
              Sextou Tools
            </p>
            <p className="font-toolkit text-xl font-extrabold text-[#F0EDE6]">
              Brazilian Business Toolkit
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
          >
            Voltar ao dashboard
          </Link>
          <Link
            href="/anuncios"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
          >
            Ver vitrine
          </Link>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#F0EDE6]">{userName}</p>
            <p className="text-xs text-[#A09D97]">{businessName || "Conta ativa no portal"}</p>
          </div>
          <LogoutButton className="text-sm font-semibold text-[#F0EDE6] hover:text-[#FCD34D]" />
        </div>

        <MobileMenu links={links} showLogout />
      </div>
    </header>
  )
}
