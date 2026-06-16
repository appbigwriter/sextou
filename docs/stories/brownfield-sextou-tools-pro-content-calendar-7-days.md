# Story: SextouTools PRO - Calendario de Conteudo de 7 Dias

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app sobre a nova foundation do SextouTools PRO -->

**Status:** Draft  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que nao sabe o que postar durante a semana,  
I want gerar um calendario de conteudo de 7 dias com ideias e CTAs,  
so that eu mantenha presenca digital com menos esforco manual.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico unificado e acoes padrao.
- Deve permitir marcar posts como publicados/usados dentro do historico do app.
- Conecta com a acao derivada de gerar roteiro de Reels para um dos posts.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta: tipo de negocio, produto ou servico principal, publico-alvo, objetivo da semana, canal principal e tom de voz.
2. O resultado gera exatamente 7 itens, um por dia, cada um com ideia de post, formato sugerido, legenda curta, CTA, ideia visual simples e hashtags opcionais.
3. O app nao gera calendario mensal no MVP.
4. O texto de cada dia permanece curto e utilizavel em mobile.
5. O historico salva o resultado como calendario semanal e permite marcacao persistida de posts como publicados no app.
6. O resultado oferece acoes para gerar roteiro de Reels, criar anuncio local e criar resposta para comentarios ou leads.
7. O app funciona bem em celular e segue o design system do pacote anterior.
8. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Salvar calendario como estrutura de 7 objetos em `output_data`.
- Permitir status por item semanal sem quebrar o registro principal da geracao.
- Renderizar cada dia em card proprio com CTA de copiar.

### Technical Constraints

- Exatamente 7 dias.
- Sem agendamento automatico.
- Sem integracao com Meta, LinkedIn ou TikTok no MVP.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Calendario de Conteudo de 7 Dias`
- [x] Implementar formulario orientado por objetivo e canal
- [x] Implementar schema de saida com exatamente 7 dias
- [x] Renderizar calendario em cards diarios
- [x] Persistir historico semanal
- [x] Implementar marcacao persistida de usado/publicado por item
- [x] Implementar acoes derivadas para Reels, anuncio e resposta
- [x] Validar experiencia mobile e de copia

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** saida longa demais ou repetitiva entre os 7 dias.
- **Mitigation:** schema curto por item e limite de texto por campo.
- **Verification:** revisar calendario com nichos distintos e canais diferentes.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar a foundation e demais apps sem impacto.

### Safety Checks

- [x] O app sempre retorna 7 dias
- [x] A marcacao de publicado nao quebra o historico
- [x] O app nao tenta integrar com redes sociais externas

---

## File List

- [x] [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [x] [components/sextou-tools-pro/tools/content-calendar-tool.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools/content-calendar-tool.tsx:1)
- [x] [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [x] [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [x] [lib/sextou-tools-pro/history.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/history.ts:1)
- [x] Marcacao persistida de publicado por item via metadados da geracao

---

## CodeRabbit Integration

### Story Type Analysis

- Primary Type: Frontend
- Secondary Type(s): Integration, API
- Complexity: Medium
- Risk Level: MEDIUM RISK
- Integration Points:
  - historico estruturado
  - marcacao de posts usados
  - handoff para app de Reels

### Specialized Agent Assignment

- Primary Agents:
  - `@dev`
  - `@ux-design-expert`
- Supporting Agents:
  - `@qa`

### Quality Gate Tasks

- [ ] Pre-Commit: validar schema de 7 dias e UX de cards diarios
- [ ] Pre-PR: validar marcacao de usado/publicado e experiencia mobile

### CodeRabbit Focus Areas

- Garantia de 7 itens exatos
- Evitar repeticao entre dias
- Persistencia de status por item via metadados da geracao
- UX de leitura e copia no celular

---

## Definition of Done

- [x] App gera calendario de 7 dias com estrutura fixa
- [x] Historico semanal salvo e reutilizavel
- [x] Marcacao persistida de posts publicados funcionando
- [x] Acoes derivadas expostas
