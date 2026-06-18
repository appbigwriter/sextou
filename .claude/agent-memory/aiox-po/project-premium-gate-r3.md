---
name: project-premium-gate-r3
description: Estado real do gate de acesso premium da Suite Sextou.biz (R3 do Launch Studio PRO) — divergência entre is_premium e hasActiveAds
metadata:
  type: project
---

A Suite Sextou.biz tem DOIS flags de acesso na tabela `users` (ambos criados na mesma migration `20260616143000_add_user_has_active_ads`): `hasActiveAds` (`has_active_ads`) e `isPremium` (`is_premium`). Também existe `isVip` legado.

Estado real do código (verificado 2026-06-18):
- `lib/sextou-tools/auth.ts` → `resolveSextouToolsProUser` já libera acesso com `hasActiveAds OR isPremium` (lógica JÁ unificada/OR no gate central da suite).
- `hasActiveAds` É setado em 3 lugares: aprovação de anúncio (`app/api/admin/ads/[id]/approve`), toggle admin (`toggle-active-ads`), e criação manual de usuário. O label da UI admin já diz "Tem anuncios ativos / PRO liberado".
- `isPremium` é um campo ÓRFÃO: NÃO é setado em lugar nenhum (nem Stripe webhook, nem admin UI). Stripe webhook só processa pagamento de anúncios, não assina premium. Logo `is_premium` é sempre `false` por default hoje.
- Inconsistência interna já existente: o StoryBrand Strategy Generator (`app/sextou-tools-pro/storybrand-strategy-generator/*`) checa SOMENTE `isPremium`, enquanto o resto da suite usa o gate OR. Isso significa que o StoryBrand está efetivamente inacessível hoje (ninguém tem is_premium=true).

**Why:** O PRD do Launch Studio PRO (`prd/LaunchStudioPRO/PRD.md` §0) exige `users.is_premium = TRUE` como gate inegociável. O breakdown sinalizou isso como risco R3 e pediu decisão consciente do PO antes da Onda 0.

**How to apply:** Antes de implementar stories 1.2/1.4/1.5 do Launch Studio PRO, confirmar com o usuário qual é a fonte de verdade. Recomendação do PO: gate em camadas — `is_premium` é a assinatura paga real (a ser conectada ao Stripe), `hasActiveAds` é cortesia para anunciantes ativos; ambos liberam acesso via OR no helper central. Stripe webhook precisa passar a setar `is_premium` + `premium_plan_slug` (gap atual, não coberto por nenhuma story). Ver [[project-launch-studio-pro-breakdown]].
