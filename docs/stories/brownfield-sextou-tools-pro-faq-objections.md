# Story: SextouTools PRO - FAQ & Objecoes do Cliente

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app da Fase 2 sobre a foundation existente do SextouTools PRO -->

**Status:** Done  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que responde sempre as mesmas duvidas,  
I want gerar um FAQ com respostas curtas e objecoes comuns,  
so that eu consiga educar melhor meus clientes e vender com menos atrito.

---

## Existing System Integration

- Reaproveita foundation do `PRO`, historico e acoes padrao.
- Recebe handoff natural de `WhatsApp` e `Bio`.
- Conecta com `Respostas de WhatsApp`, `Calendario de Conteudo` e `Bio Profissional`.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta tipo de negocio, produto ou servico, principais duvidas conhecidas, principais objecoes, tom de resposta e canal de uso.
2. O resultado gera 10 perguntas frequentes com respostas curtas, 5 objecoes comuns com respostas, mensagem curta para WhatsApp e sugestao de uso no site ou perfil.
3. O app nao inventa politicas especificas nao informadas pelo usuario.
4. O historico salva o FAQ do negocio e permite editar e manter como base reutilizavel.
5. O resultado oferece acoes para criar respostas de WhatsApp, criar bio/descricao do negocio e criar calendario de conteudo educativo.
6. O app usa o design system do pacote anterior e funciona bem no mobile.
7. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Salvar perguntas frequentes e objecoes em listas separadas.
- Permitir copia por pergunta, por objecao e por bloco inteiro.
- Tratar o canal de uso como contexto de adaptacao, nao como fluxo separado.

### Technical Constraints

- Numero fixo de perguntas e objecoes.
- Respostas curtas.
- Sem publicacao automatica.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `FAQ & Objecoes`
- [x] Implementar formulario guiado por duvidas e objecoes
- [x] Implementar schema com 10 FAQs e 5 objecoes
- [x] Renderizar blocos escaneaveis com copia por item
- [x] Persistir historico reutilizavel
- [x] Implementar acoes derivadas para WhatsApp, Bio e Conteudo
- [x] Validar experiencia mobile e de copia

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** FAQ inventar politica ou condicao nao confirmada.
- **Mitigation:** reforcar restricao no prompt e exigir duvidas reais do usuario.
- **Verification:** revisar cenarios de garantia, prazo e atendimento.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar a base historica para futura reativacao.

### Safety Checks

- [ ] Sem politicas inventadas
- [ ] Sem publicacao automatica
- [ ] Sem regressao no historico do `PRO`

---

## File List

- [ ] rota individual do app
- [ ] componente do mini-app
- [ ] prompt template versionado
- [ ] schema de saida do FAQ
- [ ] adaptadores para apps derivados

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

- [ ] Pre-Commit: validar que o app nao inventa politicas
- [ ] Pre-PR: validar utilidade das respostas no contexto de venda

### CodeRabbit Focus Areas

- Confiabilidade das respostas
- Escaneabilidade
- Handoff para `WhatsApp`

---

## Definition of Done

- [ ] App gera FAQ e objecoes com estrutura fixa
- [ ] Historico reutilizavel salvo
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
- `app/sextou-tools-pro/[slug]/page.tsx`: substituir o placeholder pela tela real e mapear `subtitle` do historico para uma pergunta-chave ou resumo do FAQ salvo.
- `components/sextou-tools-pro/tools/`: criar componente proprio seguindo o padrao dos apps `live`.
- `lib/sextou-tools-pro/schemas.ts`: registrar schema com `10` perguntas frequentes, respostas curtas, `5` objecoes, respostas de objecao, mensagem curta de WhatsApp e sugestao de uso.
- `lib/sextou-tools-pro/prompts.ts`: adicionar prompt especifico para FAQ curto, sem inventar politica comercial nao informada.
- `lib/sextou-tools-pro/generation.ts`: extender `buildMockOutput` e manter persistencia na pipeline existente.

### Implementation Notes

- Priorizar saida em secoes curtas, com cards facilmente copiaveis por pergunta ou objecao.
- Reforcar handoff para `WhatsApp`, `Bio` e `Calendario de Conteudo`.
- O app nao publica em site nem cria base de conhecimento conversacional no MVP.

### Testing

- Rodar `npm run lint`, `npm run typecheck` e `npm test`.
- Validar cardinalidade exata das listas fixas do PRD.
- Confirmar gerar, copiar, favoritar, duplicar, arquivar e regenerar.
- Revisar legibilidade em mobile e coerencia das respostas curtas.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-06-16 | 1.1 | Ajuste de conformidade com PRD, foundation atual e handoff formal para QA/Dev. | Orion |
| 2026-06-16 | 1.2 | Implementacao da Sprint 6 no codigo, com validacao completa do projeto. | Dex |
| 2026-06-17 | 1.3 | Lane 0: reuso editavel do historico implementado para fechar o gate de QA. | Dex |

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`

### Completion Notes List

- App publicado com slug `faq-objections` na categoria `communication`.
- Estrutura fixa entregue com 10 FAQs, 5 objecoes, mensagem curta para WhatsApp e uso sugerido.
- Acoes derivadas para WhatsApp, Bio e calendario educativo foram expostas via copy briefs.
- Lane 0 adicionou carregamento de item salvo no formulario para editar e regenerar o FAQ como base reutilizavel.

### File List

- `app/sextou-tools-pro/[slug]/page.tsx`
- `app/sextou-tools-pro/dashboard/page.tsx`
- `app/sextou-tools-pro/page.tsx`
- `components/sextou-tools-pro/tools/faq-objections-tool.tsx`
- `lib/sextou-tools-pro/catalog.ts`
- `lib/sextou-tools-pro/generation.ts`
- `lib/sextou-tools-pro/prompts.ts`
- `lib/sextou-tools-pro/schemas.ts`

## QA Results

### 2026-06-16 - Quinn

- Gate: PASS para prontidao da story e conformidade com o PRD.
- Rastreabilidade confirmada com `docs/SextouTools_PRO_PRD.md` App 12 e Fase 2 do roadmap.
- A story agora explicita listas fixas, integracao com a pipeline atual e testes de cardinalidade.
- Foco obrigatorio na implementacao: nao inventar regras ou politicas nao fornecidas pelo usuario.

### 2026-06-16 - Quinn Review Pass

- Gate: CONCERNS.
- Evidencias executadas: `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd test` passaram.
- Conformidade confirmada para cardinalidade fixa de `10` FAQs e `5` objecoes, rota propria, historico, favoritos, duplicacao e acoes derivadas.
- Gap de aceite: a story pede que o historico permita `editar e manter como base reutilizavel`, mas o app atual nao expõe carregamento de uma geracao anterior para edicao. A UX implementada cobre duplicar/favoritar/arquivar, mas nao editar um FAQ salvo a partir do historico.
- Evidencia de escopo atual: o componente [faq-objections-tool.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools/faq-objections-tool.tsx:1) trabalha apenas com formulario em branco + duplicacao generica, e nao busca um registro do historico para rehidratar o formulario.
- Recomendacao para fechar gate: implementar reuso editavel do historico ou alinhar a acceptance criterion com PM para aceitar duplicacao/regeneracao como estrategia oficial de reutilizacao.
### 2026-06-17 - Quinn Revalidation Pass

- Gate: PASS.
- Evidencias executadas nesta revalidacao: `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd test` passaram apos o `Lane 0`.
- Gap anterior resolvido: o historico agora expoe `Editar base`, busca a geracao por `id`, reidrata o formulario com `inputData` salvo e permite gerar nova versao a partir da base reutilizavel.
- Conformidade atual confirmada para cardinalidade fixa de `10` FAQs e `5` objecoes, rota propria, historico editavel, favoritos, duplicacao e acoes derivadas previstas na story.
- Risco residual: a utilidade comercial e a ausencia de politicas inventadas continuam dependentes de amostragem funcional com respostas reais do modelo, mas nao ha bloqueio aberto de conformidade para esta story.
