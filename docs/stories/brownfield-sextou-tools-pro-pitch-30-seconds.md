# Story: SextouTools PRO - Pitch de 30 Segundos

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app da Fase 2 sobre a foundation existente do SextouTools PRO -->

**Status:** Done  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a profissional que precisa explicar rapido o que faz,  
I want gerar um pitch curto e claro,  
so that eu consiga me apresentar melhor em networking, video ou mensagem.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico e acoes padrao.
- Conecta com `Bio Profissional`, `Roteiro de Reels` e `Descricao institucional`.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta nome do negocio ou profissional, o que vende, para quem vende, problema que resolve, diferencial e tom desejado.
2. O resultado gera pitch de 30 segundos, versao de 10 segundos, versao para WhatsApp, versao para bio curta e frase de encerramento.
3. A saida e curta e escaneavel, sem blocos longos.
4. O historico salva o pitch por negocio e permite favoritar a versao principal.
5. O resultado oferece acoes para criar bio profissional, criar roteiro de video e criar descricao institucional.
6. O app usa o design system do pacote anterior e funciona bem no mobile.
7. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Salvar multiplas versoes curtas em `output_data`.
- Destacar uma versao principal para copiar rapido.
- Tratar a bio curta como handoff natural para o app de `Bio Profissional`.

### Technical Constraints

- Saida curta.
- Maximo de 4 versoes principais.
- Sem audio ou treino de apresentacao.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Pitch de 30 Segundos`
- [x] Implementar formulario curto
- [x] Implementar prompt com estrutura fixa por canal
- [x] Validar saida curta e escaneavel
- [x] Persistir historico por negocio
- [x] Implementar acoes derivadas para bio, video e descricao
- [x] Validar leitura e copia no mobile

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** pitch ficar generico e pouco memoravel.
- **Mitigation:** exigir problema resolvido e diferencial no formulario.
- **Verification:** revisar a taxa de copia por versao.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar historico sem renderizacao ativa, se necessario.

### Safety Checks

- [ ] Sem blocos longos
- [ ] Sem audio ou treinamento de apresentacao
- [ ] Sem regressao na foundation do `PRO`

---

## File List

- [ ] rota individual do app
- [ ] componente do mini-app
- [ ] prompt template versionado
- [ ] schema de saida do pitch
- [ ] adaptadores para apps derivados

---

## CodeRabbit Integration

### Story Type Analysis

- Primary Type: Frontend
- Secondary Type(s): Integration, API
- Complexity: Low
- Risk Level: LOW RISK

### Specialized Agent Assignment

- Primary Agents:
  - `@dev`
  - `@ux-design-expert`
- Supporting Agents:
  - `@qa`

### Quality Gate Tasks

- [ ] Pre-Commit: validar concisao e clareza das versoes
- [ ] Pre-PR: validar handoff com `Bio Profissional`

### CodeRabbit Focus Areas

- Clareza do pitch
- Escaneabilidade no mobile
- Reutilizacao entre canais

---

## Definition of Done

- [ ] App gera todas as versoes exigidas
- [ ] Historico por negocio salvo
- [ ] Acoes derivadas expostas
- [ ] App mobile-first e consistente com design v2

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@qa"
quality_gate_tools:
  - "npm run lint"
  - "npm run typecheck"
  - "npm test"
```

## Dev Notes

### Source Tree & Integration Points

- `lib/sextou-tools-pro/catalog.ts`: adicionar entrada do app na categoria `communication` e manter `status` como `draft` ate validacao QA final.
- `app/sextou-tools-pro/[slug]/page.tsx`: trocar o placeholder da rota por renderizacao concreta do componente e mapear `subtitle` do historico para a versao principal do pitch.
- `components/sextou-tools-pro/tools/`: criar componente proprio seguindo o padrao de formulario + resultado + historico usado pelos 5 apps ja `live`.
- `lib/sextou-tools-pro/schemas.ts`: registrar schema de entrada e saida com versoes curtas por canal, mantendo `nextActions` com exatamente 3 itens.
- `lib/sextou-tools-pro/prompts.ts`: adicionar prompt de sistema especifico para pitch curto, claro e escaneavel.
- `lib/sextou-tools-pro/generation.ts`: extender `buildMockOutput` e fluxo de persistencia sem criar endpoint paralelo; reaproveitar `app/api/sextou-tools-pro/generate/route.ts`.

### Implementation Notes

- Seguir o padrao de saida estruturada em cards, evitando bloco unico de texto.
- Tratar a versao de bio curta como handoff natural para o app de `Bio Profissional`.
- Nao introduzir audio, gravacao ou treino guiado; o app e apenas textual no MVP.

### Testing

- Rodar `npm run lint`, `npm run typecheck` e `npm test`.
- Validar fluxo autenticado completo: gerar, copiar, favoritar, duplicar, arquivar e regenerar.
- Confirmar que o historico reapresenta a versao principal do pitch sem quebrar o shell lateral.
- Revisar mobile-first em viewport pequena para leitura das versoes curta, WhatsApp e bio.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-06-16 | 1.1 | Ajuste de conformidade com PRD, foundation atual e handoff formal para QA/Dev. | Orion |
| 2026-06-16 | 1.2 | Implementacao da Sprint 6 no codigo, com validacao completa do projeto. | Dex |

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`

### Completion Notes List

- App publicado com slug `pitch-30-seconds` na foundation existente do `SextouTools PRO`.
- Schema, prompt, mock fallback e renderizacao do historico foram adicionados sem criar endpoint paralelo.
- Acoes derivadas para bio, video e descricao institucional foram expostas via copy briefs.

### File List

- `app/sextou-tools-pro/[slug]/page.tsx`
- `app/sextou-tools-pro/dashboard/page.tsx`
- `app/sextou-tools-pro/page.tsx`
- `components/sextou-tools-pro/tools/pitch-30-seconds-tool.tsx`
- `lib/sextou-tools-pro/catalog.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/schemas.ts`

## QA Results

### 2026-06-16 - Quinn

- Gate: PASS para prontidao da story e conformidade com o PRD.
- Rastreabilidade confirmada com `docs/SextouTools_PRO_PRD.md` App 03 e Fase 2 do roadmap.
- A story agora informa os pontos de integracao, a estrategia de testes e o handoff esperado para `Bio Profissional` e fluxo de video.
- Foco obrigatorio na implementacao: manter o pitch memoravel sem sacrificar concisao e legibilidade mobile.

### 2026-06-16 - Quinn Review Pass

- Gate: PASS.
- Evidencias executadas: `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd test` passaram.
- Conformidade confirmada para formulario, saidas exigidas, historico, favorito, duplicacao, regeneracao e acoes derivadas.
- Nenhum gap funcional critico encontrado contra o PRD do App 03 nesta passada.
