# Story: SextouTools PRO - Gerador de Anuncios Locais

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app da Fase 2 sobre a foundation existente do SextouTools PRO -->

**Status:** Ready for Review  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a negocio local que precisa divulgar uma oferta,  
I want gerar textos curtos de anuncio para varios canais,  
so that eu consiga promover meu negocio sem montar campanha do zero.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico e acoes padrao.
- Recebe handoff natural de `Oferta` e `Plano de Lancamento`.
- Conecta com `Follow-up`, `Reels` e `Oferta`.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta nome do negocio, produto ou servico, cidade/regiao, publico-alvo, oferta ou promocao, diferencial, canal do anuncio e CTA.
2. O resultado gera texto curto de anuncio, headline, descricao, CTA, versao para WhatsApp, versao para panfleto e 3 variacoes de abordagem.
3. O app nao configura campanha paga nem cria criativo visual.
4. O historico salva o anuncio por campanha e canal e permite marcar como em uso.
5. O resultado oferece acoes para criar plano de lancamento, criar oferta irresistivel e criar sequencia de follow-up.
6. O app usa o design system do pacote anterior e funciona bem no mobile.
7. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Salvar as 3 abordagens em `output_data`.
- Persistir status operacional `em uso` em `metadataJson`.
- Separar claramente versao de anuncio, versao de WhatsApp e versao de panfleto.

### Technical Constraints

- Sem configuracao de midia paga.
- Maximo de 3 variacoes.
- Sem criativos visuais.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Gerador de Anuncios Locais`
- [x] Implementar formulario por campanha e canal
- [x] Implementar schema de saida com 3 variacoes
- [x] Renderizar blocos por formato de anuncio
- [x] Persistir historico por campanha/canal
- [x] Implementar acoes derivadas para lancamento, oferta e follow-up
- [x] Validar leitura e copia no mobile

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** texto ficar repetitivo entre canais.
- **Mitigation:** exigir canal e CTA no input e separar formatos na saida.
- **Verification:** revisar saidas para redes, WhatsApp e panfleto.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar registros historicos para reativacao futura, se necessario.

### Safety Checks

- [x] Sem configuracao de midia paga
- [x] Sem criativos visuais
- [ ] Sem regressao na suite `PRO`

---

## File List

- [x] rota individual do app
- [x] componente do mini-app
- [x] prompt template versionado
- [x] schema de saida dos anuncios
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

- [x] Pre-Commit: validar distincao entre canais e formatos
- [x] Pre-PR: validar status `em uso` e UX de copia

### CodeRabbit Focus Areas

- Variacoes de abordagem
- Distincao entre formatos
- Persistencia do status operacional

---

## Definition of Done

- [x] App gera anuncios com blocos exigidos
- [x] Historico por campanha/canal salvo
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

- `lib/sextou-tools-pro/catalog.ts`: adicionar entrada do app na categoria `content` ou `sales` conforme decisao final do dashboard, mantendo coerencia com o agrupamento do PRD.
- `app/sextou-tools-pro/[slug]/page.tsx`: substituir o placeholder e mapear `subtitle` do historico para headline ou CTA da campanha.
- `components/sextou-tools-pro/tools/`: criar componente dedicado com saida por canal e variacoes de abordagem.
- `lib/sextou-tools-pro/schemas.ts`: registrar schema com headline, descricao, CTA, versao WhatsApp, versao panfleto e 3 variacoes.
- `lib/sextou-tools-pro/prompts.ts`: adicionar prompt especifico para anuncios locais sem configurar midia paga.
- `lib/sextou-tools-pro/generation.ts`: extender `buildMockOutput`, persistencia e eventualmente `metadataJson` para marcar campanha `em uso` quando for aprovado no design do app.

### Implementation Notes

- O app gera apenas texto e estrutura; nao cria criativo visual nem setup de campanha paga.
- Reforcar o handoff com `Oferta`, `Reels` e `Plano de Lancamento`.
- Se a marcacao `em uso` for implementada nesta historia, seguir o mesmo padrao de `metadataJson` usado em outros apps operacionais.

### Testing

- Rodar `npm run lint`, `npm run typecheck` e `npm test`.
- Validar as 3 variacoes maximas e a presenca das versoes por canal.
- Confirmar gerar, copiar, favoritar, duplicar, arquivar e regenerar.
- Revisar legibilidade em mobile, especialmente nos blocos headline, descricao e CTA.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-06-16 | 1.1 | Ajuste de conformidade com PRD, foundation atual e handoff formal para QA/Dev. | Orion |
| 2026-06-17 | 1.2 | Implementacao do mini-app `local-ads` concluida no Lane 2 com formulario, historico, status operacional e acoes derivadas. | Dex |

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run lint` ✅
- `npm.cmd run typecheck` ✅
- `npm.cmd test` ⚠️ bloqueado por build externo em `app/api/zapleads/whatsapp/extract/route.ts` via `whatsapp-web.js` / `puppeteer-core`

### Completion Notes List

- Catalogo do `PRO` atualizado com o app `local-ads` em categoria `sales` e handoffs coerentes com PRD.
- Schema, prompt e mock output implementados para headline, descricao, CTA, versao WhatsApp, versao panfleto e 3 variacoes.
- UI dedicada criada com formulario por campanha/canal, copia por bloco, historico recente, favoritar, duplicar, arquivar e exclusao.
- Marcacao operacional `EM_USO` reutiliza o fluxo foundation existente via `set-operational-status`.
- Integracao de rota feita em `app/sextou-tools-pro/[slug]/page.tsx` com subtitle do historico pela `headline`.

### File List

- `app/sextou-tools-pro/[slug]/page.tsx`
- `components/sextou-tools-pro/tools/local-ads-tool.tsx`
- `lib/sextou-tools-pro/catalog.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/schemas.ts`

## QA Results

### 2026-06-16 - Quinn

- Gate: PASS para prontidao da story e conformidade com o PRD.
- Rastreabilidade confirmada com `docs/SextouTools_PRO_PRD.md` App 07 e Fase 2 do roadmap.
- A story agora distingue com clareza o que e texto de anuncio e o que esta fora de escopo de midia paga e criativo visual.
- Foco obrigatorio na implementacao: manter saida multi-canal curta e sem abrir escopo para campaign setup.

### 2026-06-17 - Quinn

- Gate da story: PASS para conformidade funcional do app `local-ads`.
- Gate da Sprint 7: CONCERNS. O escopo desta story esta implementado e rastreavel, mas o gate global da sprint nao sobe para PASS porque `npm.cmd test` falha no workspace por regressao externa.
- Rastreabilidade tecnica confirmada em:
  - `app/sextou-tools-pro/[slug]/page.tsx` para rota propria, historico e montagem do app.
  - `components/sextou-tools-pro/tools/local-ads-tool.tsx` para formulario por campanha/canal, blocos por formato, copia e handoffs.
  - `lib/sextou-tools-pro/schemas.ts`, `lib/sextou-tools-pro/prompts.ts` e `lib/sextou-tools-pro/generation.ts` para headline, descricao, CTA, WhatsApp, panfleto e 3 variacoes.
  - `lib/sextou-tools-pro/metadata.ts` e `lib/sextou-tools-pro/history.ts` para status operacional `EM_USO` sem inflar o padrao atual de `metadataJson`.
- Evidencia de gate executada nesta revalidacao:
  - `npm.cmd run lint`: PASS
  - `npm.cmd run typecheck`: PASS
  - `npm.cmd test`: FAIL fora do escopo desta story, durante `next build`, em `app/api/zapleads/whatsapp/extract/route.ts` via `lib/whatsapp.ts` importando `whatsapp-web.js` / `puppeteer-core`
- Risco residual:
  - a story esta conforme com o PRD e respeita o corte sem midia paga nem criativo visual, mas a sprint continua com gate global pendente ate a regressao externa de build ser saneada.
