# Story: SextouTools PRO - Roteiro de Reels/Shorts de 30s

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app sobre a nova foundation do SextouTools PRO -->

**Status:** Draft  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que precisa gravar videos curtos para vender ou educar,  
I want gerar um roteiro estruturado de Reels/Shorts,  
so that eu consiga produzir video rapido com gancho, desenvolvimento e CTA.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico, limites e acoes padrao.
- Deve receber handoff natural do `Calendario de Conteudo de 7 Dias` e do `Gerador de Oferta Irresistivel`.
- O resultado precisa ser curto, visualmente escaneavel e pronto para copiar.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.
- `gravado/publicado` funcionam como estados operacionais persistidos em metadados, sem substituir o status macro do historico.

---

## Acceptance Criteria

1. O formulario coleta: tema do video, produto ou servico, publico-alvo, objetivo, tom e duracao.
2. O app gera: gancho inicial, roteiro falado, sugestao de cenas, texto para legenda na tela, CTA final e descricao curta para publicar.
3. A saida respeita duracao escolhida e usa estrutura fixa.
4. O app nao gera storyboard complexo, video, narracao automatica ou edicao.
5. O historico salva o roteiro por tema e permite marcacao persistida como `gravado` ou `publicado`, alem de `arquivado` no historico macro.
6. O resultado oferece acoes para criar legenda do post, criar oferta associada e criar follow-up para quem respondeu.
7. O app usa o design system do pacote anterior e funciona bem em celular.
8. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Converter a duracao em restricoes de tamanho do output antes da chamada de LLM.
- Persistir o roteiro no historico macro e o estado operacional em metadados nesta sprint.
- Renderizar blocos curtos separados por secao para facilitar leitura durante gravacao.

### Technical Constraints

- Duracoes suportadas no MVP: 15s, 30s e 45s.
- Estrutura fixa de output.
- Sem geracao de midia.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Roteiro de Reels/Shorts de 30s`
- [x] Implementar formulario com tema, objetivo, tom e duracao
- [x] Implementar schema de saida estruturada
- [x] Adaptar o prompt para respeitar duracao escolhida
- [x] Persistir historico do roteiro
- [x] Implementar marcacao persistida de `gravado/publicado`
- [x] Implementar acoes derivadas para legenda, oferta e follow-up
- [x] Validar leitura e copia no mobile

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** roteiro exceder a duracao prometida ou virar texto excessivo.
- **Mitigation:** limitar quantidade de texto por secao e adaptar o prompt pela duracao.
- **Verification:** revisar outputs para 15s, 30s e 45s.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar a foundation e demais apps da fase 1.

### Safety Checks

- [x] O roteiro respeita a duracao escolhida
- [x] O app nao tenta gerar video ou storyboard complexo
- [x] O status operacional persistido do roteiro nao quebra o historico

---

## File List

- [x] [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [x] [components/sextou-tools-pro/tools/reels-script-tool.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools/reels-script-tool.tsx:1)
- [x] [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [x] [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [x] [lib/sextou-tools-pro/history.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/history.ts:1)
- [x] Marcacao operacional persistida via metadados no componente do app

---

## CodeRabbit Integration

### Story Type Analysis

- Primary Type: Frontend
- Secondary Type(s): Integration, API
- Complexity: Medium
- Risk Level: MEDIUM RISK
- Integration Points:
  - handoff de calendario e oferta
  - historico com status operacional
  - pipeline de geracao estruturada

### Specialized Agent Assignment

- Primary Agents:
  - `@dev`
  - `@ux-design-expert`
- Supporting Agents:
  - `@qa`

### Quality Gate Tasks

- [ ] Pre-Commit: validar restricoes por duracao e schema da saida
- [ ] Pre-PR: validar leitura rapida, copia e estados do historico

### CodeRabbit Focus Areas

- Aderencia real a 15s/30s/45s
- Escaneabilidade da saida
- Persistencia do status do roteiro via metadados
- Handoff para apps derivados

---

## Definition of Done

- [x] App gera roteiro estruturado por duracao
- [x] Historico por tema salvo e reutilizavel
- [x] Marcacao operacional persistida disponivel no historico
- [x] Acoes derivadas expostas
- [x] Experiencia mobile validada
