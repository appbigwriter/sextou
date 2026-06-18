"use client"

export default function GlobalError() {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#101622] px-4 py-16 text-white">
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F97316]">Erro fatal</p>
            <h1 className="mt-3 text-3xl font-bold">A aplicacao nao conseguiu iniciar corretamente.</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Verifique a conexao com o banco, as migrations e as variaveis de ambiente do container.
            </p>
            <a
              href="/"
              className="mt-6 rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#EA580C]"
            >
              Ir para a home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
