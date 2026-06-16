# Story: SextouTools PRO - Proposta Comercial One-Page

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app sobre a nova foundation do SextouTools PRO -->

**Status:** Draft  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a prestador de servico ou freelancer,  
I want gerar uma proposta comercial textual de uma pagina,  
so that eu consiga revisar e enviar rapidamente uma proposta mais profissional para clientes.

---

## Existing System Integration

- Este app nao substitui o gerador de orcamento PDF do pacote anterior; ele cobre uma necessidade diferente e mais leve.
- Reaproveita auth, historico, favoritos e acoes padrao do `PRO`.
- Conecta com proximas acoes para follow-up, oferta irresistivel e briefing visual.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O formulario coleta: nome do cliente opcional, nome do negocio/profissional, servico ou produto proposto, problema do cliente, escopo, prazo, valor opcional, condicoes de pagamento opcionais e garantias/observacoes.
2. O resultado gera: titulo da proposta, contexto do cliente, solucao proposta, escopo em bullets, prazo, investimento, proximos passos e mensagem de envio por WhatsApp ou e-mail.
3. A saida permanece limitada a uma pagina textual e nao tenta diagramar PDF no MVP.
4. O app nao gera clausulas juridicas complexas.
5. O historico salva a proposta por cliente e servico, com opcao de duplicar para novo cliente.
6. O resultado oferece acoes para criar follow-up da proposta, criar oferta irresistivel e criar briefing visual para apresentacao.
7. O app segue o design system do pacote anterior e funciona bem em mobile.
8. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Diferenciar claramente este app do `gerador-orcamento-pdf` existente no pacote anterior.
- Persistir campos de negocio relevantes no `input_data` para duplicacao posterior.
- Exibir o escopo como lista legivel, nao como bloco denso de texto.

### Technical Constraints

- Sem geracao de PDF no MVP inicial.
- Sem assinatura digital.
- Sem contrato juridico.

### Existing Pattern Reference

- Reaproveitar a ergonomia do shell atual do `Sextou Tools`, mas com saida mais editorial e comercial.

---

## Tasks / Subtasks

- [x] Criar catalogo e rota do app `Proposta Comercial One-Page`
- [x] Implementar formulario com campos de escopo e contexto
- [x] Implementar prompt e schema de saida textual estruturada
- [x] Renderizar proposta em secoes curtas com bullets
- [x] Persistir historico com duplicacao por cliente/servico
- [x] Implementar acoes derivadas para follow-up, oferta e briefing
- [x] Validar responsividade e copia/exportacao textual

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** confusao entre proposta comercial textual e orcamento PDF ja existente.
- **Mitigation:** diferenciar naming, posicionamento e escopo claramente no catalogo e no header do app.
- **Verification:** revisar copy do produto e fluxo dos dois tools.

### Rollback Plan

1. Remover rota e entrada de catalogo do `PRO`.
2. Manter intacto o `gerador-orcamento-pdf` atual.

### Safety Checks

- [x] O app nao chama geracao de PDF
- [x] O app nao sobrepoe ou altera o fluxo do pacote anterior
- [x] O output continua cabendo em uma pagina textual

---

## File List

- [x] [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [x] [components/sextou-tools-pro/tools/one-page-proposal-tool.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools/one-page-proposal-tool.tsx:1)
- [x] [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [x] [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [x] Duplicacao via historico compartilhado do `PRO`

---

## CodeRabbit Integration

### Story Type Analysis

- Primary Type: Integration
- Secondary Type(s): Frontend, API
- Complexity: Medium
- Risk Level: MEDIUM RISK
- Integration Points:
  - coexistencia com `gerador-orcamento-pdf`
  - historico com duplicacao
  - acoes derivadas para outros apps

### Specialized Agent Assignment

- Primary Agents:
  - `@dev`
  - `@ux-design-expert`
- Supporting Agents:
  - `@qa`

### Quality Gate Tasks

- [ ] Pre-Commit: validar distincao de escopo com o tool PDF existente
- [ ] Pre-PR: validar duplicacao, copia e legibilidade da proposta

### CodeRabbit Focus Areas

- Distincao semantica entre proposta textual e orcamento PDF
- Legibilidade e escopo em bullets
- Duplicacao segura no historico
- Acoes derivadas corretas

---

## Definition of Done

- [x] App gera proposta one-page com secoes exigidas
- [x] Historico por cliente/servico com duplicacao
- [x] App nao conflita com tool PDF existente
- [x] UX mobile e copy final aprovadas
