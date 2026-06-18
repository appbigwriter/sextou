import Link from "next/link"
import { redirect } from "next/navigation"
import { SextouToolsProSuiteHeader } from "@/components/sextou-tools-pro/suite-header"
import { resolveToolkitUser } from "@/lib/sextou-tools/auth"

export default async function SextouToolsProAccessPage() {
  const result = await resolveToolkitUser()

  if (result.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools-pro/acesso")
  }

  const user =
    result.kind === "ok"
      ? result.user
      : {
          fullName: "Membro",
          businessName: "Conta",
        }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <SextouToolsProSuiteHeader userName={user.fullName} businessName={user.businessName} />

      <main className="mx-auto flex max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="w-full rounded-[28px] border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.14),rgba(255,140,0,0.10))] p-8">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#FF3D57]">
            Acesso condicionado a anuncios ativos
          </p>
          <h1 className="mt-3 font-toolkit text-4xl font-extrabold leading-none tracking-[-0.03em] text-[#F0EDE6]">
            Seu acesso ao SextouTools PRO ainda nao foi liberado.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F0EDE6]/88">
            O pacote `PRO` fica disponivel apenas para usuarios com anuncios ativos na plataforma.
            Um admin pode habilitar isso manualmente no seu cadastro, e a liberacao de anuncio tambem
            passa a ativar esse acesso automaticamente.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-[#171717] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#A09D97]">Como liberar</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#F0EDE6]/88">
                <li>Publique e tenha um anuncio liberado na plataforma.</li>
                <li>Ou solicite ao admin a habilitacao manual do acesso PRO.</li>
              </ul>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-[#171717] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#A09D97]">Enquanto isso</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#F0EDE6]/88">
                <li>Voce ainda pode navegar pela landing publica da suite.</li>
                <li>Quando o acesso for habilitado, o dashboard PRO abre normalmente.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/anuncios"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] px-5 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Ver meus anuncios
            </Link>
            <Link
              href="/sextou-tools-pro"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-[#F0EDE6] transition hover:bg-white/10"
            >
              Voltar para a landing PRO
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
