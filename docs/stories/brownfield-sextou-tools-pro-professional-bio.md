# Story: SextouTools PRO - Bio Profissional para Instagram, Google e LinkedIn

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app da Fase 2 sobre a foundation existente do SextouTools PRO -->

**Status:** Done  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que precisa se posicionar melhor online,  
I want gerar bios e descricoes prontas para varios canais,  
so that eu consiga comunicar melhor meu negocio em perfis digitais.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico e handoffs padrao.
- Recebe handoff natural de `Pitch`.
- Conecta com `Calendario de Conteudo`, `Posts de Apresentacao` e `FAQ`.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta nome do negocio ou profissional, segmento, publico-alvo, cidade/regiao opcional, principal servico/produto, diferencial, link ou CTA desejado e tom de voz.
2. O resultado gera bio curta para Instagram, bio profissional para LinkedIn, descricao para Google Business Profile, headline curta, CTA para perfil e 5 palavras-chave de posicionamento.
3. O app respeita limites de tamanho por canal.
4. O historico salva o resultado por canal e permite duplicar para outro canal.
5. O resultado oferece acoes para criar calendario de conteudo, criar posts de apresentacao e criar FAQ do negocio.
6. O app usa o design system do pacote anterior e funciona bem no mobile.
7. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Persistir os blocos por canal em `output_data`.
- Marcar o canal principal em `metadataJson`.
- Permitir copia individual por bloco e duplicacao rapida.

### Technical Constraints

- Saida curta e estruturada.
- Limites especificos por canal.
- Sem publicacao automatica.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Bio Profissional`
- [x] Implementar formulario guiado por canal e posicionamento
- [x] Implementar schema de saida multicanal
- [x] Renderizar blocos por canal com CTA de copia
- [x] Persistir historico por canal
- [x] Implementar acoes derivadas para conteudo, posts e FAQ
- [x] Validar responsividade e escaneabilidade

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** bios sairem parecidas demais entre canais.
- **Mitigation:** reforcar limites e objetivos especificos por canal.
- **Verification:** revisar blocos de Instagram, LinkedIn e Google separadamente.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar historico para futura reativacao, se necessario.

### Safety Checks

- [ ] Respeito a limites por canal
- [ ] Sem publicacao automatica
- [ ] Sem regressao na foundation do `PRO`

---

## File List

- [ ] rota individual do app
- [ ] componente do mini-app
- [ ] prompt template versionado
- [ ] schema de saida multicanal
- [ ] adaptadores de proximas acoes

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

- [ ] Pre-Commit: validar limites por canal
- [ ] Pre-PR: validar legibilidade e copia por bloco

### CodeRabbit Focus Areas

- Distincao por canal
- Legibilidade no mobile
- Reuso com app de `Pitch`

---

## Definition of Done

- [ ] App gera bios e descricoes por canal
- [ ] Historico por canal salvo
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

- `lib/sextou-tools-pro/catalog.ts`: adicionar entrada do app na categoria `communication`.
- `app/sextou-tools-pro/[slug]/page.tsx`: substituir o placeholder por componente dedicado e mapear `subtitle` do historico para a bio mais representativa do canal principal.
- `components/sextou-tools-pro/tools/`: criar componente dedicado reutilizando shell, historico lateral e acoes padrao da suite.
- `lib/sextou-tools-pro/schemas.ts`: registrar schema com saidas separadas para Instagram, LinkedIn, Google Business Profile, headline e palavras-chave.
- `lib/sextou-tools-pro/prompts.ts`: adicionar prompt que respeite limite de canal e evite excesso de emoji.
- `lib/sextou-tools-pro/generation.ts`: extender `buildMockOutput` e persistencia usando a pipeline atual sem criar stack paralela.

### Implementation Notes

- As saidas por canal devem ser explicitamente separadas em cards para facilitar copia.
- A bio curta precisa conversar com `Pitch`, `FAQ` e `Calendario de Conteudo`, sem inventar SEO real.
- O app continua textual; nao inclui publicacao automatica nem auditoria externa.

### Testing

- Rodar `npm run lint`, `npm run typecheck` e `npm test`.
- Validar limites de tamanho e escaneabilidade das versoes por canal.
- Confirmar fluxo de gerar, copiar, favoritar, duplicar, arquivar e regenerar.
- Revisar comportamento mobile e leitura do historico por canal.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-06-16 | 1.1 | Ajuste de conformidade com PRD, foundation atual e handoff formal para QA/Dev. | Orion |
| 2026-06-16 | 1.2 | Implementacao da Sprint 6 no codigo, com validacao completa do projeto. | Dex |
| 2026-06-17 | 1.3 | Lane 0: CTA dedicado no resultado e fluxo explicito de duplicacao por canal. | Dex |

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`

### Completion Notes List

- App publicado com slug `professional-bio` na categoria `communication`.
- Renderizacao multicanal entregue para Instagram, LinkedIn e Google Business Profile, com headline e palavras-chave.
- Acoes derivadas para calendario, posts de apresentacao e FAQ foram expostas via copy briefs.
- Lane 0 fechou o gap de aceite com `profileCta` dedicado e duplicacao guiada de um canal para outro via brief rapido.

### File List

- `app/sextou-tools-pro/[slug]/page.tsx`
- `app/sextou-tools-pro/dashboard/page.tsx`
- `app/sextou-tools-pro/page.tsx`
- `components/sextou-tools-pro/tools/professional-bio-tool.tsx`
- `lib/sextou-tools-pro/catalog.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/schemas.ts`

## QA Results

### 2026-06-16 - Quinn

- Gate: PASS para prontidao da story e conformidade com o PRD.
- Rastreabilidade confirmada com `docs/SextouTools_PRO_PRD.md` App 04 e Fase 2 do roadmap.
- A story agora cobre integracao com a foundation, separacao de canais e testes de limite/legibilidade.
- Foco obrigatorio na implementacao: respeitar o limite especifico de cada canal e evitar texto inchado.

### 2026-06-16 - Quinn Review Pass

- Gate: CONCERNS.
- Evidencias executadas: `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd test` passaram.
- Conformidade confirmada para rota propria, geracao estruturada, historico, favoritos, duplicacao e acoes derivadas.
- Gap de aceite: o PRD e a story exigem `CTA para perfil`, mas o contrato de saida implementado nao possui campo dedicado para CTA. Evidencia em [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:148) e no componente [professional-bio-tool.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools/professional-bio-tool.tsx:21), que expõem `instagramBio`, `linkedinBio`, `googleBusinessDescription`, `shortHeadline` e `positioningKeywords`, sem `profileCta`.
- Gap de aceite: a story fala em salvar resultado por canal e permitir duplicar para outro canal, mas a UX atual duplica a geracao inteira sem fluxo especifico por canal.
- Recomendacao para fechar gate: adicionar `profileCta` ao schema/output/renderizacao e decidir se a duplicacao por canal sera implementada agora ou rebaixada explicitamente para follow-up aprovado por PM.
### 2026-06-17 - Quinn Revalidation Pass

- Gate: PASS.
- Evidencias executadas nesta revalidacao: `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd test` passaram apos o `Lane 0`.
- Gap anterior resolvido: o contrato agora inclui `profileCta`, e a UI renderiza o CTA dedicado com acao de copia individual.
- Gap anterior resolvido: a tela agora expoe fluxo explicito de `Duplicar para outro canal` por bloco de Instagram, LinkedIn e Google Business Profile, preservando headline e CTA como base de adaptacao.
- Conformidade atual confirmada para rota propria, saida multicanal, CTA de perfil, historico, duplicacao por canal e acoes derivadas previstas na story.
- Risco residual: a verificacao de limites exatos por canal continua dependente de teste funcional com resposta real do modelo, mas nao ha bloqueio aberto de conformidade para esta story.
