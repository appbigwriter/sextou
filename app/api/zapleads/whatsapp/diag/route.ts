import { NextResponse } from "next/server"
import { getDiagnostics } from "@/lib/evolution"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

// Endpoint de diagnóstico do subsistema WhatsApp/ZapLeads (Evolution API).
// Retorna 200 sempre (mesmo sem auth) para que a causa seja visível no browser.
export async function GET() {
  const result = await resolveSextouToolsPremiumUser()

  const auth = {
    kind: result.kind,
    isPremium: result.kind === "ok" || result.kind === "forbidden" ? result.user.isPremium : null,
    hasActiveAds: result.kind === "ok" || result.kind === "forbidden" ? result.user.hasActiveAds : null,
  }

  if (result.kind !== "ok") {
    return NextResponse.json({
      ok: false,
      reason: "AUTH",
      auth,
      hint: "Usuário não passou no gate premium DENTRO da rota de API (precisa isPremium && hasActiveAds + sessão válida).",
    })
  }

  const diag = await getDiagnostics(result.user.id)

  let hint = "Subsistema saudável. Se o QR não aparece, é frontend/poll."
  if (diag.reason === "EVOLUTION_NOT_CONFIGURED") {
    hint = "Defina EVOLUTION_API_URL e EVOLUTION_API_KEY no ambiente."
  } else if (diag.reason === "EVOLUTION_UNREACHABLE") {
    hint = "App não conseguiu falar com a Evolution API. Verifique a URL/rede e se o serviço está no ar."
  }

  return NextResponse.json({
    auth,
    userId: result.user.id,
    process: {
      memoryRssMB: Math.round(process.memoryUsage().rss / 1048576),
      uptimeSec: Math.round(process.uptime()),
    },
    nodeEnv: process.env.NODE_ENV || null,
    hint,
    ...diag,
  })
}
