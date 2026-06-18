# Story: SextouTools PRO - Briefing de Logo, Site ou Material Grafico

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app da Fase 2 sobre a foundation existente do SextouTools PRO -->

**Status:** Ready for Review  
**Priority:** Medium  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que precisa pedir um servico criativo,  
I want organizar um briefing claro,  
so that eu consiga explicar melhor o projeto para designer ou agencia.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico e acoes padrao.
- Conecta com CTA de servico pago, `Proposta` e `Anuncios Locais`.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta tipo de projeto, nome do negocio, publico-alvo, objetivo do material, estilo desejado, cores preferidas opcional, referencias opcionais e informacoes obrigatorias.
2. O resultado gera briefing organizado, objetivo do projeto, publico-alvo, mensagem principal, direcao visual, conteudo obrigatorio, perguntas pendentes e checklist para enviar ao designer ou agencia.
3. O app nao tenta gerar identidade visual completa.
4. O historico salva o briefing por tipo de projeto e permite transformar o resultado em solicitacao de orcamento.
5. O resultado oferece acoes para solicitar servico pago, criar proposta e criar anuncio local.
6. O app usa o design system do pacote anterior e funciona bem no mobile.
7. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Salvar o briefing em blocos editoriais curtos.
- Persistir perguntas pendentes separadas em `output_data`.
- Preparar CTA de servico como proxima acao sem bloquear o uso gratuito.

### Technical Constraints

- Sem geracao de imagem.
- Sem criacao de logo.
- Sem wireframe completo.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Briefing de Logo, Site ou Material Grafico`
- [x] Implementar formulario guiado por tipo de projeto
- [x] Implementar schema de saida editorial estruturada
- [x] Renderizar briefing em secoes curtas
- [x] Persistir historico por tipo de projeto
- [x] Implementar acoes derivadas de servico, proposta e anuncio
- [x] Validar legibilidade e copia no mobile

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** briefing sair muito generico e pouco util para um designer real.
- **Mitigation:** exigir objetivo, publico e conteudo obrigatorio no input.
- **Verification:** revisar se o checklist final e acionavel.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar briefings historicos para futura reativacao.

### Safety Checks

- [ ] Sem geracao de identidade visual
- [ ] Sem criacao de imagem
- [ ] Sem regressao no dashboard `PRO`

---

## File List

- [x] rota individual do app
- [x] componente do mini-app
- [x] prompt template versionado
- [x] schema de saida do briefing
- [x] adaptadores de CTA de servico

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

- [ ] Pre-Commit: validar utilidade real do briefing
- [ ] Pre-PR: validar CTA de servico sem friccao exagerada

### CodeRabbit Focus Areas

- Clareza do briefing
- Qualidade das perguntas pendentes
- Monetizacao indireta etica

---

## Definition of Done

- [ ] App gera briefing com secoes exigidas
- [ ] Historico por tipo de projeto salvo
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

- `lib/sextou-tools-pro/catalog.ts`: adicionar entrada do app na categoria final usada para servicos e briefing no dashboard.
- `app/sextou-tools-pro/[slug]/page.tsx`: substituir o placeholder e mapear `subtitle` do historico para tipo de projeto ou objetivo principal do briefing.
- `components/sextou-tools-pro/tools/`: criar componente proprio seguindo o padrao dos apps ja `live`.
- `lib/sextou-tools-pro/schemas.ts`: registrar schema com briefing organizado, objetivo do projeto, publico-alvo, mensagem principal, direcao visual, conteudo obrigatorio, perguntas pendentes e checklist.
- `lib/sextou-tools-pro/prompts.ts`: adicionar prompt voltado a organizacao de pedido criativo, sem gerar identidade visual completa.
- `lib/sextou-tools-pro/generation.ts`: extender `buildMockOutput` e persistencia na pipeline atual.

### Implementation Notes

- O app organiza informacao e levanta perguntas pendentes; nao gera logo, wireframe ou imagem no MVP.
- Handoffs principais: `Proposta`, `Anuncio Local` e CTA de servico pago.
- A saida deve ser estruturada para facilitar copia e envio para designer ou agencia.

### Testing

- Rodar `npm run lint`, `npm run typecheck` e `npm test`.
- Validar a presenca das secoes obrigatorias e das perguntas pendentes.
- Confirmar gerar, copiar, favoritar, duplicar, arquivar e regenerar.
- Revisar UX mobile para leitura do checklist e dos campos obrigatorios.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-06-16 | 1.1 | Ajuste de conformidade com PRD, foundation atual e handoff formal para QA/Dev. | Orion |
| 2026-06-17 | 1.2 | Implementacao completa do mini-app creative-brief no pacote PRO com historico, acoes derivadas e validacao final. | Dex |

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`
- limpeza local de artefato de build em `.next`

### Completion Notes List

- Mini-app `creative-brief` publicado no catalogo e em rota propria do pacote PRO.
- Formulario implementado com tipo de projeto, negocio, publico, objetivo, estilo, cores, referencias e informacoes obrigatorias.
- Saida estruturada implementada com briefing organizado, objetivo, publico, mensagem principal, direcao visual, conteudo obrigatorio, perguntas pendentes e checklist final.
- Historico por tipo de projeto salvo e reapresentado com subtitulo baseado no objetivo principal do briefing.
- Acoes derivadas implementadas para solicitar servico pago, criar proposta comercial e criar anuncio local.
- Validacao concluida com `lint`, `typecheck` e `test` passando apos limpeza do resíduo local em `.next`.

### File List

- `app/sextou-tools-pro/[slug]/page.tsx`
- `components/sextou-tools-pro/tools/creative-brief-tool.tsx`
- `docs/stories/brownfield-sextou-tools-pro-creative-brief.md`
- `lib/sextou-tools-pro/catalog.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/schemas.ts`

## QA Results

### 2026-06-16 - Quinn

- Gate: PASS para prontidao da story e conformidade com o PRD.
- Rastreabilidade confirmada com `docs/SextouTools_PRO_PRD.md` App 11 e Fase 2 do roadmap.
- A story agora delimita o app como organizador de briefing, sem abrir escopo para geracao visual.
- Foco obrigatorio na implementacao: manter o briefing pratico e realmente reutilizavel por terceiros.
