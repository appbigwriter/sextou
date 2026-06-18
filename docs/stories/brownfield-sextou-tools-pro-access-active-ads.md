# Brownfield Story - SextouTools PRO Access by Active Ads

**Status:** Ready for Review  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-data-llm-history.md`

## Story

Como admin da plataforma,  
quero controlar por usuario se ele tem anuncios ativos e, portanto, acesso ao `SextouTools PRO`,  
para que a suite `PRO` fique disponivel apenas para membros elegiveis e seja liberada automaticamente quando um anuncio for aprovado.

## Acceptance Criteria

1. O modelo `User` possui um booleano persistido para indicar se o usuario tem anuncios ativos / acesso ao `PRO`.
2. Apenas admins conseguem editar esse booleano manualmente pela area administrativa de usuarios.
3. Ao executar `liberar anuncio` no fluxo administrativo, o usuario dono do anuncio passa automaticamente a ter o booleano marcado como `true`.
4. Rotas autenticadas do `SextouTools PRO` bloqueiam usuarios logados sem esse booleano ativo.
5. APIs autenticadas do `SextouTools PRO` retornam `403` para usuarios sem acesso liberado.
6. A landing publica do `PRO` continua publica, mas passa a refletir o estado de acesso do usuario logado.
7. Existe uma tela amigavel explicando por que o acesso ainda nao foi liberado.

## Tasks / Subtasks

- [x] Adicionar campo booleano no schema Prisma e migration aditiva
- [x] Criar helper de acesso dedicado ao `SextouTools PRO`
- [x] Proteger dashboard, paginas de app e APIs do `PRO`
- [x] Adicionar toggle admin para liberar ou remover acesso `PRO`
- [x] Incluir o campo na criacao manual de usuario por admin
- [x] Sincronizar `liberar anuncio` com o novo flag
- [x] Criar tela amigavel de acesso nao liberado

## File List

- `prisma/schema.prisma`
- `prisma/migrations/20260616143000_add_user_has_active_ads/migration.sql`
- `lib/sextou-tools/auth.ts`
- `app/sextou-tools-pro/page.tsx`
- `app/sextou-tools-pro/dashboard/page.tsx`
- `app/sextou-tools-pro/[slug]/page.tsx`
- `app/sextou-tools-pro/acesso/page.tsx`
- `app/api/sextou-tools-pro/generate/route.ts`
- `app/api/sextou-tools-pro/generations/route.ts`
- `app/api/sextou-tools-pro/generations/[id]/route.ts`
- `app/api/sextou-tools-pro/usage/route.ts`
- `app/api/admin/users/route.ts`
- `app/api/admin/users/[id]/toggle-active-ads/route.ts`
- `app/api/admin/ads/[id]/approve/route.ts`
- `app/dashboard/admin/usuarios/page.tsx`
- `app/dashboard/admin/novo-usuario/page.tsx`
- `components/active-ads-toggle-button.tsx`

## Notes

- O acesso do `PRO` agora e controlado por elegibilidade persistida em usuario, nao apenas por login.
- Nesta fase, a liberacao automatica ocorre ao aprovar anuncio. A desabilitacao continua manual pelo admin.
