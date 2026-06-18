# Story: SextouTools PRO - Diagnostico Express do Negocio

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app da Fase 2 sobre a foundation existente do SextouTools PRO -->

**Status:** Ready for Review  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que sente que esta vendendo abaixo do potencial,  
I want gerar um diagnostico rapido do meu negocio,  
so that eu saiba o que priorizar primeiro.

---

## Existing System Integration

- Reaproveita auth, historico, limites e shell visual do `PRO`.
- Deve recomendar proximos apps como `Oferta`, `Calendario` e `Plano de Lancamento`.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta nome do negocio, tipo de negocio, produto ou servico principal, publico-alvo, canal principal de venda, maior dificuldade atual, faturamento aproximado opcional e cidade/mercado opcional.
2. O resultado gera resumo do diagnostico, 3 pontos fortes, 3 pontos fracos, 3 oportunidades rapidas, 3 riscos, plano de acao de 7 dias e sugestao de proximo mini-app.
3. A saida e curta, estruturada e nao tenta fazer analise financeira profunda.
4. O historico salva o diagnostico por negocio e permite comparar novas geracoes.
5. O resultado oferece acoes para criar oferta, criar calendario de conteudo e criar plano de lancamento.
6. O app usa o design system do pacote anterior e funciona bem no mobile.
7. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Salvar o diagnostico com listas curtas em `output_data`.
- Persistir o proximo app recomendado em `metadataJson`.
- Reaproveitar o perfil do usuario como contexto padrao sempre que houver dados de onboarding.

### Technical Constraints

- Uma chamada principal de LLM.
- Saida maxima curta e escaneavel.
- Sem benchmark real com concorrentes.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Diagnostico Express do Negocio`
- [x] Implementar formulario guiado
- [x] Implementar prompt fixo com checklist de diagnostico
- [x] Validar saida estruturada com blocos curtos
- [x] Persistir historico por negocio
- [x] Implementar recomendacoes de proximos apps
- [x] Validar experiencia mobile e utilidade das recomendacoes

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** diagnostico parecer generico demais.
- **Mitigation:** usar canal principal, dor atual e perfil do negocio como contexto minimo obrigatorio.
- **Verification:** revisar saidas de nichos distintos.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar registros historicos sem renderizacao ativa, se necessario.

### Safety Checks

- [ ] Sem analise financeira profunda
- [ ] Sem benchmark real
- [ ] Sem regressao no dashboard do `PRO`

---

## File List

- [x] rota individual do app
- [x] componente do mini-app
- [x] prompt template versionado
- [x] schema de saida estruturada
- [x] adaptadores de proximos apps

---

## CodeRabbit Integration

### Story Type Analysis

- Primary Type: Frontend
- Secondary Type(s): Integration, API
- Complexity: Medium
- Risk Level: MEDIUM RISK

### Specialized Agent Assignment

- Primary Agents:
  - `@dev`
  - `@ux-design-expert`
- Supporting Agents:
  - `@qa`

### Quality Gate Tasks

- [ ] Pre-Commit: validar clareza do diagnostico e recomendacoes
- [ ] Pre-PR: validar relevancia de proximos apps sugeridos

### CodeRabbit Focus Areas

- Relevancia do diagnostico
- Escaneabilidade do resultado
- Recomendacao de proximos apps

---

## Definition of Done

- [ ] App gera diagnostico com secoes exigidas
- [ ] Historico por negocio salvo
- [ ] Recomendacoes de proximos apps expostas
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

- `lib/sextou-tools-pro/catalog.ts`: adicionar entrada do app na categoria de estrategia definida para o dashboard completo da suite.
- `app/sextou-tools-pro/[slug]/page.tsx`: substituir o placeholder e mapear `subtitle` do historico para o resumo do diagnostico.
- `components/sextou-tools-pro/tools/`: criar componente dedicado com blocos curtos de diagnostico e recomendacoes de proximos apps.
- `lib/sextou-tools-pro/schemas.ts`: registrar schema com resumo, `3` pontos fortes, `3` pontos fracos, `3` oportunidades, `3` riscos, plano de 7 dias e proximo app sugerido.
- `lib/sextou-tools-pro/prompts.ts`: adicionar prompt de checklist fixo com linguagem pratica e sem benchmark real.
- `lib/sextou-tools-pro/generation.ts`: extender `buildMockOutput`, persistencia e `metadataJson` para guardar o proximo app recomendado.

### Implementation Notes

- O app deve usar contexto de onboarding/perfil quando esse dado ja estiver disponivel via foundation.
- Nao incluir analise financeira profunda, benchmark de concorrentes ou integracoes externas.
- O historico precisa facilitar comparacao entre geracoes, ainda que a UI inicial use lista simples.

### Testing

- Rodar `npm run lint`, `npm run typecheck` e `npm test`.
- Validar cardinalidade exata das listas de 3 itens e a existencia do plano de 7 dias.
- Confirmar persistencia do proximo app recomendado e reapresentacao coerente no historico.
- Revisar mobile e clareza dos blocos curtos do diagnostico.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-06-16 | 1.1 | Ajuste de conformidade com PRD, foundation atual e handoff formal para QA/Dev. | Orion |
| 2026-06-17 | 1.2 | Implementacao completa do mini-app business-diagnosis no pacote PRO com historico, recomendacao persistida e acoes de handoff. | Dex |

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`

### Completion Notes List

- Mini-app `business-diagnosis` publicado no catalogo e em rota propria do pacote PRO.
- Formulario implementado com os campos exigidos pelo PRD e validacao dos campos obrigatorios.
- Schema e prompt estruturados para resumo curto, listas exatas de 3 itens, plano de 7 dias e proximo mini-app recomendado.
- Historico por negocio reapresentado na UI com resumo do diagnostico e label do proximo app persistidos em `metadataJson`.
- Acoes de follow-up implementadas como briefs copiados para oferta, calendario de conteudo e plano de lancamento.
- Validacao concluida com `lint`, `typecheck` e `test` passando; o `test` exigiu execucao fora do sandbox para o build buscar Google Fonts.

### File List

- `app/sextou-tools-pro/[slug]/page.tsx`
- `components/sextou-tools-pro/tools/business-diagnosis-tool.tsx`
- `docs/stories/brownfield-sextou-tools-pro-business-diagnosis.md`
- `lib/sextou-tools-pro/catalog.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/metadata.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/schemas.ts`

## QA Results

### 2026-06-16 - Quinn

- Gate: PASS para prontidao da story e conformidade com o PRD.
- Rastreabilidade confirmada com `docs/SextouTools_PRO_PRD.md` App 01 e Fase 2 do roadmap.
- A story agora cobre a persistencia da recomendacao de proximo app e os limites de escopo do diagnostico.
- Foco obrigatorio na implementacao: evitar diagnostico generico e nao escalar para pseudo-consultoria financeira.
