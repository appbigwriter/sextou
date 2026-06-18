# SextouTools PRO - Next Dev Wave

**Status:** Sprint 7 Released  
**Last Updated:** 2026-06-17

---

## Objetivo

Liberar as proximas tasks da Fase 2 para execucao paralela por multiplos agentes `aiox-dev`, preservando dependencias funcionais e reduzindo conflito de arquivos.

---

## Gate de Entrada

- Sprint 6:
  - `Pitch de 30 Segundos`: QA `PASS`, PM `Done`
  - `Bio Profissional`: QA `PASS`, PM `Done`
  - `FAQ & Objecoes`: QA `PASS`, PM `Done`
- Sprint 7:
  - `Follow-up Comercial em 5 Mensagens`: `Approved`, QA de prontidao `PASS`
  - `Gerador de Anuncios Locais`: `Approved`, QA de prontidao `PASS`

---

## Lane 1 - Sprint 7 / Follow-up

**Agente sugerido:** `aiox-dev` 01  
**Story:** [brownfield-sextou-tools-pro-follow-up-5-messages.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-follow-up-5-messages.md:1)

**Escopo tecnico:**

- Implementar slug `follow-up-5-messages`
- Adicionar schema/prompt/mock
- Criar componente do tool
- Persistir marcacao por mensagem em `metadataJson`

**Arquivos alvo principais:**

- `lib/sextou-tools-pro/schemas.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/catalog.ts`
- `components/sextou-tools-pro/tools/`
- `app/sextou-tools-pro/[slug]/page.tsx`
- `lib/sextou-tools-pro/history.ts`
- `lib/sextou-tools-pro/metadata.ts`

---

## Lane 2 - Sprint 7 / Anuncios Locais

**Agente sugerido:** `aiox-dev` 02  
**Story:** [brownfield-sextou-tools-pro-local-ads.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-local-ads.md:1)

**Escopo tecnico:**

- Implementar slug `local-ads`
- Adicionar schema/prompt/mock
- Criar componente do tool
- Opcionalmente persistir status `em uso` em `metadataJson`

**Arquivos alvo principais:**

- `lib/sextou-tools-pro/schemas.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/catalog.ts`
- `components/sextou-tools-pro/tools/`
- `app/sextou-tools-pro/[slug]/page.tsx`

---

## Lane 3 - Sprint 8 / Diagnostico Express

**Agente sugerido:** `aiox-dev` 04  
**Story:** [brownfield-sextou-tools-pro-business-diagnosis.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-business-diagnosis.md:1)

**Escopo tecnico:**

- Implementar slug `business-diagnosis`
- Adicionar schema/prompt/mock
- Criar componente do tool
- Persistir recomendacao de proximo app em `metadataJson`

**Arquivos alvo principais:**

- `lib/sextou-tools-pro/schemas.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/catalog.ts`
- `components/sextou-tools-pro/tools/`
- `app/sextou-tools-pro/[slug]/page.tsx`
- `lib/sextou-tools-pro/metadata.ts`

---

## Lane 4 - Sprint 8 / Plano de Lancamento 48h

**Agente sugerido:** `aiox-dev` 05  
**Story:** [brownfield-sextou-tools-pro-launch-plan-48h.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-launch-plan-48h.md:1)

**Escopo tecnico:**

- Implementar slug `launch-plan-48h`
- Adicionar schema/prompt/mock
- Criar componente do tool
- Persistir checklist concluido em `metadataJson`

**Arquivos alvo principais:**

- `lib/sextou-tools-pro/schemas.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/catalog.ts`
- `components/sextou-tools-pro/tools/`
- `app/sextou-tools-pro/[slug]/page.tsx`
- `lib/sextou-tools-pro/history.ts`
- `lib/sextou-tools-pro/metadata.ts`

---

## Lane 5 - Sprint 9 / Briefing Criativo

**Agente sugerido:** `aiox-dev` 06  
**Story:** [brownfield-sextou-tools-pro-creative-brief.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-creative-brief.md:1)

**Escopo tecnico:**

- Implementar slug `creative-brief`
- Adicionar schema/prompt/mock
- Criar componente do tool

**Arquivos alvo principais:**

- `lib/sextou-tools-pro/schemas.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/catalog.ts`
- `components/sextou-tools-pro/tools/`
- `app/sextou-tools-pro/[slug]/page.tsx`

---

## Lane 6 - Sprint 9 / Precificador

**Agente sugerido:** `aiox-dev` 07  
**Story:** [brownfield-sextou-tools-pro-service-pricing.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-service-pricing.md:1)

**Escopo tecnico:**

- Implementar slug `service-pricing`
- Criar helper deterministico de calculo
- Adicionar schema/prompt/mock
- Criar componente do tool

**Arquivos alvo principais:**

- `lib/sextou-tools-pro/schemas.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/catalog.ts`
- `components/sextou-tools-pro/tools/`
- `app/sextou-tools-pro/[slug]/page.tsx`

---

## Lane 7 - Sprint 10 / Parcerias Locais

**Agente sugerido:** `aiox-dev` 08  
**Story:** [brownfield-sextou-tools-pro-local-partnerships.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-local-partnerships.md:1)

**Escopo tecnico:**

- Implementar slug `local-partnerships`
- Adicionar schema/prompt/mock
- Criar componente do tool
- Persistir marcacoes operacionais leves em `metadataJson`

**Arquivos alvo principais:**

- `lib/sextou-tools-pro/schemas.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/catalog.ts`
- `components/sextou-tools-pro/tools/`
- `app/sextou-tools-pro/[slug]/page.tsx`
- `lib/sextou-tools-pro/history.ts`
- `lib/sextou-tools-pro/metadata.ts`

---

## Regra de Coordenacao

- Todos os lanes compartilham:
  - `lib/sextou-tools-pro/schemas.ts`
  - `lib/sextou-tools-pro/prompts.ts`
  - `lib/sextou-tools-pro/generation.ts`
  - `lib/sextou-tools-pro/catalog.ts`
  - `app/sextou-tools-pro/[slug]/page.tsx`
- Para reduzir conflito:
  - executar em worktrees isoladas ou branches locais separadas
  - integrar primeiro Lanes 1-2
  - depois Lanes 3-4
  - depois Lanes 5-7
