"use client"

import { useEffect } from "react"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[APP_ERROR]", error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#101622] px-4 py-16 text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F97316]">Falha de carregamento</p>
        <h1 className="mt-3 text-3xl font-bold">Nao foi possivel carregar esta pagina.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Se esta pagina depende do banco de dados, o servico pode estar indisponivel
          ou a configuracao do ambiente pode estar incompleta.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#EA580C]"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Voltar para a home
          </a>
        </div>
      </div>
    </div>
  )
}
