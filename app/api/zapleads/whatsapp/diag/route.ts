import { NextResponse } from "next/server"
import fs from "fs"
import { getDiagnostics } from "@/lib/whatsapp"
import { resolveSextouToolsPremiumUser } from "@/lib/sextou-tools/auth"

export const dynamic = "force-dynamic"

// Endpoint de diagnóstico do subsistema WhatsApp/ZapLeads.
// Retorna 200 sempre (mesmo sem auth) para que a causa seja visível no browser.
export async function GET() {
  const result = await resolveSextouToolsPremiumUser()

  // auth.kind diz se o problema é autenticação/premium no contexto da API
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

  const diag = getDiagnostics(result.user.id)

  let chromiumExists = false
  let chromiumCheckError: string | null = null
  try {
    chromiumExists = fs.existsSync(diag.resolvedExecutablePath)
  } catch (e: any) {
    chromiumCheckError = e?.message || String(e)
  }

  // Conclusão automática da causa mais provável
  let reason = "OK"
  let hint = "Subsistema saudável. Se o QR não aparece, é frontend/poll."
  if (!chromiumExists) {
    reason = "CHROMIUM_MISSING"
    hint = `Chromium não existe em ${diag.resolvedExecutablePath}. Verifique o apk add chromium no Dockerfile e a env PUPPETEER_EXECUTABLE_PATH.`
  } else if (diag.atLimit && !diag.user) {
    reason = "SESSION_LIMIT"
    hint = `Limite de ${diag.maxSessions} sessões atingido e sem sessão própria. Suba ZAPLEADS_MAX_SESSIONS ou aguarde expirar ocioso.`
  } else if (diag.user?.lastError) {
    reason = "ENGINE_ERROR"
    hint = `A engine registrou erro: ${diag.user.lastError}`
  }

  return NextResponse.json({
    ok: reason === "OK",
    reason,
    hint,
    auth,
    userId: result.user.id,
    chromiumExists,
    chromiumCheckError,
    process: {
      memoryRssMB: Math.round(process.memoryUsage().rss / 1048576),
      uptimeSec: Math.round(process.uptime()),
    },
    ...diag,
  })
}
