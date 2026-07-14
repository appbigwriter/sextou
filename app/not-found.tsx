import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] flex items-center justify-center px-4">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#FF8C00]">
          Erro 404
        </p>
        <h1 className="mt-4 font-toolkit text-5xl font-extrabold leading-none tracking-[-0.03em] text-[#F0EDE6] md:text-6xl">
          Pagina nao encontrada
        </h1>
        <p className="mt-5 text-sm leading-7 text-[#A09D97]">
          O endereço que voce acessou nao existe ou foi movido. Volte para o inicio ou
          explore as ferramentas disponiveis.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-6 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Voltar para o inicio
          </Link>
          <Link
            href="/sextou-tools-pro"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
          >
            Ver SextouTools PRO
          </Link>
        </div>
      </div>
    </div>
  )
}
