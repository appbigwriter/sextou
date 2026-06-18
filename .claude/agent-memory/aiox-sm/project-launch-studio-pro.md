---
name: project-launch-studio-pro
description: Launch Studio PRO — fábrica de Fórmulas de Lançamento PLF, 41 stories em 8 épicos; decisão R3-C (gate OR) aplicada em 2026-06-18
metadata:
  type: project
---

Launch Studio PRO é um mini-app Premium da Suite Sextou.biz. 41 stories (atualizado de 40) em `docs/stories/launch-studio-pro/`. Índice: `INDEX-launch-studio-pro.md`.

**Why:** Produto novo baseado na Product Launch Formula™ (Jeff Walker). Brownfield — infraestrutura de auth/stripe/header já existe.

**How to apply:** Ao trabalhar em stories do LS PRO, carregar `docs/stories/launch-studio-pro/INDEX-launch-studio-pro.md` como referência de dependências e roadmap. Toda nova story deve rastrear para `prd/LaunchStudioPRO/PRD.md` ou `STORIES-BREAKDOWN.md`.

**Decisão R3-C (PO, 2026-06-18) — Gate de Acesso:**
- Acesso PRO = `is_premium OR hasActiveAds`, sempre via `resolveSextouToolsProUser` em `lib/sextou-tools/auth.ts` (linha ~104).
- O helper já implementa a lógica OR: `!hasActiveAds && !isPremium` → `kind: "forbidden"`.
- `is_premium` era ORFAO (nenhuma rota o setava). Story 1.7 criada para corrigir isso (Stripe assinatura → webhook → `is_premium=true`).
- Story 1.2 atualizada: gate usa `resolveSextouToolsProUser`, não check isolado de `is_premium`. Nota "NÃO REUSAR anúncios" removida.
- Story 1.4 atualizada: corrigida premissa falsa de que Stripe webhook populava `is_premium` (ele só processa anúncios via `metadata.adId`).

**Dívida técnica fora do escopo LS PRO:**
- StoryBrand Strategy Generator usa `isPremium` isolado, sem `resolveSextouToolsProUser`. Inacessível para todos. Corrigir após Onda 0 do LS PRO.

**Outras decisões registradas:**
- Schema: `launch_*` (domínio PLF) separado de `premium_*` (telemetria)
- MVP: apenas pt-BR; i18n pós-MVP (R9)
- E4: CREATE justificado (multi-provider é capacidade nova)
- Fidelity score: calculado programaticamente (checklist binário), não subjetivo pelo LLM (R5)

**Caminho crítico:** `1.1 → 1.2 → 1.3 → 2.x → 3.1-3.5 → 4.1-4.4 → 5.1-5.7 → 6.1 → 6.3`
**Gate funcional ponta-a-ponta (assinatura):** `1.1 → 1.4 → 1.7 → 1.2`

**Riscos abertos:** R1 (spike multi-provider antes da Onda 3), R4 (fallback Puppeteer para PDF), R10 (`is_premium` orfao — endereçado pela 1.7).
