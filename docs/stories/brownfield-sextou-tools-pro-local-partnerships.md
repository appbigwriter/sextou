# Story: SextouTools PRO - Ideias de Parcerias Locais

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app da Fase 2 sobre a foundation existente do SextouTools PRO -->

**Status:** Ready for Review  
**Priority:** Medium  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a negocio local que quer crescer por networking e colaboracao,  
I want gerar ideias de parcerias praticas,  
so that eu consiga abrir novas oportunidades comerciais sem depender so de anuncios.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico e acoes padrao.
- Conecta com `Anuncios Locais`, `Plano de Lancamento` e `Mensagem de Abordagem`.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta tipo de negocio, cidade/regiao, publico-alvo, ticket medio opcional, objetivo da parceria e restricoes ou preferencias.
2. O resultado gera 10 ideias de parceiros locais, motivo da parceria, proposta de abordagem, mensagem inicial para contato, ideia de campanha conjunta e proximo passo recomendado.
3. O app nao lista empresas reais no MVP.
4. O historico salva a lista por campanha ou parceria e permite marcar como contatado, interessado ou arquivado.
5. O resultado oferece acoes para criar mensagem de abordagem, criar anuncio local e criar plano de lancamento.
6. O app usa o design system do pacote anterior e funciona bem no mobile.
7. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Gerar as 10 ideias por categoria de parceiro, nao por empresa real.
- Persistir status operacional das ideias em `metadataJson`.
- Tratar a mensagem inicial como bloco copiavel por item.

### Technical Constraints

- Sem busca real de empresas.
- Sem CRM completo.
- Sem envio automatico.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Ideias de Parcerias Locais`
- [x] Implementar formulario guiado por objetivo e regiao
- [x] Implementar schema de saida com 10 ideias
- [x] Renderizar ideias em cards com mensagem de abordagem
- [x] Persistir historico por campanha/parceria
- [x] Implementar acoes derivadas para mensagem, anuncio e lancamento
- [x] Validar leitura e copia no mobile

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** sugestoes muito vagas ou impossiveis de executar.
- **Mitigation:** exigir publico, objetivo e contexto local no input.
- **Verification:** revisar se as ideias sao praticas e acionaveis.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar historico para futura reativacao.

### Safety Checks

- [ ] Sem empresas reais no MVP
- [ ] Sem CRM ou envio automatico
- [ ] Sem regressao no historico do `PRO`

---

## File List

- [x] rota individual do app
- [x] componente do mini-app
- [x] prompt template versionado
- [x] schema de saida das parcerias
- [x] suporte a status operacional

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

- [ ] Pre-Commit: validar utilidade pratica das ideias
- [ ] Pre-PR: validar status operacional das parcerias

### CodeRabbit Focus Areas

- Acionabilidade das ideias
- Clareza da abordagem inicial
- Persistencia operacional

---

## Definition of Done

- [x] App gera 10 ideias com estrutura exigida
- [x] Historico por campanha/parceria salvo
- [x] Acoes derivadas expostas
- [x] App mobile-first e consistente com design v2

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

- `lib/sextou-tools-pro/catalog.ts`: adicionar entrada do app na categoria de estrategia ou crescimento local usada pelo dashboard final.
- `app/sextou-tools-pro/[slug]/page.tsx`: substituir o placeholder e mapear `subtitle` do historico para parceiro sugerido ou campanha da parceria.
- `components/sextou-tools-pro/tools/`: criar componente proprio com lista de parceiros, abordagem e campanha conjunta.
- `lib/sextou-tools-pro/schemas.ts`: registrar schema com `10` ideias de parceiros, motivo, abordagem inicial, mensagem de contato, campanha conjunta e proximo passo.
- `lib/sextou-tools-pro/generation.ts`: extender `buildMockOutput` e persistencia.
- `app/api/sextou-tools-pro/generations/[id]/route.ts`, `lib/sextou-tools-pro/history.ts` e `lib/sextou-tools-pro/metadata.ts`: adicionar suporte a marcacoes operacionais como `contactado`, `interessado` e `arquivado`.

### Implementation Notes

- As sugestoes devem ser baseadas em categorias de parceiros, nunca em empresas reais do mercado.
- O app nao vira CRM de parcerias; as marcacoes sao apenas estado leve em `metadataJson`.
- Handoffs principais: mensagem de abordagem, `Anuncio Local` e `Plano de Lancamento`.

### Testing

- Rodar `npm run lint`, `npm run typecheck` e `npm test`.
- Validar cardinalidade de `10` ideias e presenca da mensagem inicial e campanha conjunta.
- Testar persistencia das marcacoes operacionais e restauracao no historico.
- Revisar mobile para leitura da lista longa de parceiros e acoes de copia.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-06-16 | 1.1 | Ajuste de conformidade com PRD, foundation atual e handoff formal para QA/Dev. | Orion |
| 2026-06-17 | 1.2 | Implementacao do mini-app `local-partnerships` concluida com 10 ideias por categoria, mensagem inicial copiavel e marcacoes leves de parceria. | Dex |

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run lint` ✅
- `npm.cmd run typecheck` ✅
- `npm.cmd test` ✅

### Completion Notes List

- Catalogo do `PRO` atualizado com o app `local-partnerships` na categoria `sales` e handoffs para mensagem de abordagem, anuncio local e plano de lancamento.
- Schema e prompt implementados para 10 ideias de parceiros por categoria, sem listar empresas reais no MVP.
- UI dedicada criada com formulario por contexto local, cards por ideia, mensagem inicial copiavel, campanha conjunta, proximo passo e acoes derivadas.
- Persistencia leve implementada em `metadataJson` para status por ideia (`novo`, `contatado`, `interessado`) sem transformar o app em CRM.
- Integracao de rota feita em `app/sextou-tools-pro/[slug]/page.tsx` com historico por campanha e restauracao das marcacoes operacionais.

### File List

- `app/api/sextou-tools-pro/generations/[id]/route.ts`
- `app/sextou-tools-pro/[slug]/page.tsx`
- `components/sextou-tools-pro/tools/local-partnerships-tool.tsx`
- `docs/stories/brownfield-sextou-tools-pro-local-partnerships.md`
- `lib/sextou-tools-pro/catalog.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/history.ts`
- `lib/sextou-tools-pro/metadata.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/schemas.ts`

## QA Results

### 2026-06-16 - Quinn

- Gate: PASS para prontidao da story e conformidade com o PRD.
- Rastreabilidade confirmada com `docs/SextouTools_PRO_PRD.md` App 14 e Fase 2 do roadmap.
- A story agora cobre o requisito de marcacoes operacionais leves sem transformar o app em CRM.
- Foco obrigatorio na implementacao: manter sugestoes por categoria e nunca listar empresas reais no MVP.

### 2026-06-17 - Quinn

- Gate final da story: PASS
- A implementacao segue conforme com o PRD e o pacote `SextouTools PRO`.
- Os gates do workspace passaram na reexecucao desta correcao.
- Nao houve findings adicionais para esta story no fechamento final.
