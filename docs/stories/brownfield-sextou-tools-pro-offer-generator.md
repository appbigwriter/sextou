# Story: SextouTools PRO - Gerador de Oferta Irresistivel

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app sobre a nova foundation do SextouTools PRO -->

**Status:** Ready for Review  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que precisa vender melhor por canais digitais ou atendimento direto,  
I want transformar meu produto ou servico em uma oferta comercial clara e acionavel,  
so that eu consiga comunicar valor com mais facilidade.

---

## Existing System Integration

- Reaproveita auth, historico, limites e shell visual do `PRO`.
- Conecta com proximas acoes para `anuncio local`, `roteiro de reels` e `proposta comercial`.
- Deve herdar perfil/onboarding do usuario quando essa informacao ja existir.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta: produto ou servico, publico-alvo, problema que resolve, beneficio principal, preco opcional, bonus opcional, garantia opcional e tom de comunicacao.
2. O app gera: nome da oferta, headline principal, promessa clara, estrutura da oferta, bonus sugeridos, garantia sugerida, urgencia etica, CTA para WhatsApp e versao curta para post.
3. O app usa template fixo de oferta e produz, no maximo, 5 variacoes curtas quando houver regeneracao ou opcoes auxiliares.
4. O app nao gera promessas enganosas, garantia absoluta ou texto agressivo.
5. O historico permite marcar resultado como `ativa`, `testada` ou `arquivada`.
   `testada` fica persistido em metadados operacionais sem alterar o status macro da geracao.
6. O resultado exibe acoes para criar `anuncio local`, `roteiro de Reels` e `proposta comercial`.
7. O app usa o design system do pacote anterior e funciona bem no mobile.
8. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Persistir o status comercial da oferta no historico do `PRO`.
- Salvar `output_data` estruturado para permitir reaproveitamento por outros apps.
- A CTA para WhatsApp deve ser claramente separada do restante do texto.

### Technical Constraints

- Sem publicacao automatica em canais.
- Sem teste A/B automatizado.
- Sem calculo de margem dentro deste app.

### Existing Pattern Reference

- Reaproveitar o padrao de cards de resultado do `PRO` com uma secao final de proximas acoes.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Gerador de Oferta Irresistivel`
- [x] Implementar formulario guiado
- [x] Implementar prompt fixo versionado
- [x] Validar saida estruturada com todos os blocos exigidos
- [x] Persistir historico com status comercial da oferta
- [x] Implementar acoes derivadas para anuncio, reels e proposta
- [x] Validar limites, favoritos e responsividade

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** texto parecer generico e pouco diferenciado entre nichos.
- **Mitigation:** aproveitar contexto do onboarding e exigir problema + beneficio principal no formulario.
- **Verification:** revisar amostras em nichos diferentes.

### Rollback Plan

1. Remover rota e catalogo do app.
2. Preservar dados historicos sem renderizacao ativa, se necessario.

### Safety Checks

- [x] Sem promessas absolutas
- [x] Sem conflito com app futuro de proposta comercial
- [x] Sem regressao no dashboard do `PRO`

---

## File List

- [x] [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [x] [components/sextou-tools-pro/tools/offer-generator-tool.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools/offer-generator-tool.tsx:1)
- [x] [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [x] [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [x] [app/api/sextou-tools-pro/generate/route.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/app/api/sextou-tools-pro/generate/route.ts:1)

---

## CodeRabbit Integration

### Story Type Analysis

- Primary Type: Integration
- Secondary Type(s): Frontend, API
- Complexity: Medium
- Risk Level: MEDIUM RISK
- Integration Points:
  - pipeline de geracao
  - historico status-aware
  - handoff para outros apps do `PRO`

### Specialized Agent Assignment

- Primary Agents:
  - `@dev`
  - `@ux-design-expert`
- Supporting Agents:
  - `@qa`

### Quality Gate Tasks

- [ ] Pre-Commit: validar output estruturado e regras anti-promessa enganosa
- [ ] Pre-PR: validar UX de acoes derivadas e status da oferta

### CodeRabbit Focus Areas

- Estrutura clara da oferta
- Reaproveitamento do output em outros apps
- Microcopy e CTA de WhatsApp
- Seguranca contra saidas enganosas

---

## Definition of Done

- [x] App gera oferta completa com blocos exigidos
- [x] Historico com status `ativa/testada/arquivada`
- [x] Acoes derivadas expostas
- [x] App mobile-first e consistente com design v2
