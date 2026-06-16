# Story: SextouTools PRO - Respostas Prontas para WhatsApp

<!-- Source: docs/SextouTools_PRO_PRD.md -->
<!-- Context: Brownfield mini-app sobre a nova foundation do SextouTools PRO -->

**Status:** Draft  
**Priority:** High  
**Depends On:** `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`, `brownfield-sextou-tools-pro-foundation-data-llm-history.md`, `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Story

As a empreendedor que vende e atende pelo WhatsApp,  
I want gerar respostas comerciais prontas para situacoes recorrentes,  
so that eu economize tempo e mantenha consistencia no atendimento.

---

## Existing System Integration

- Reaproveita auth, dashboard, shell, historico e limites definidos na foundation do `PRO`.
- Deve seguir o fluxo padrao de mini-app: coach tip, formulario, geracao, resultado, historico e proximas acoes.
- O resultado deve usar cards estruturados em vez de texto corrido solto.
- O app deve existir em pagina propria e independente dentro do namespace do `PRO`.

---

## Acceptance Criteria

1. O app coleta: tipo de negocio, situacao da resposta, tom desejado, informacoes especificas do caso e CTA desejado.
2. O app gera exatamente 5 blocos de saida: resposta curta, resposta completa, versao mais simpatica, versao mais firme e versao com CTA.
3. A resposta usa linguagem curta, comercial e nao agressiva, evitando linguagem juridica ou hostil.
4. O resultado salvo no historico usa titulo derivado da situacao informada e pode ser favoritado, arquivado, excluido e duplicado.
5. O app oferece acoes pos-resultado para: salvar como template, criar sequencia de follow-up e criar FAQ do negocio.
6. O app respeita o limite diario e as regras de regeneracao da suite.
7. O app funciona bem em celular e usa o mesmo design system do pacote anterior.
8. Nenhuma integracao real com WhatsApp ou envio automatico e introduzida no MVP.
9. O app e publicado em rota propria e independente.

---

## Dev Technical Guidance

### Integration Approach

- Tratar a saida da LLM como JSON com chaves fixas para os 5 tipos de resposta.
- Renderizar cada versao em card proprio com CTA de copiar.
- Salvar `situation`, `tone` e `business_type` em `input_data`.
- Salvar `output_text` consolidado e `output_data` estruturado.

### Technical Constraints

- Maximo de uma chamada principal de LLM por geracao.
- Respostas curtas por padrao.
- Sem integracao com API externa do WhatsApp.

### Existing Pattern Reference

- Seguir a experiencia de formulario + resultado + historico dos tools em `components/sextou-tools/tools/*`.
- Reaproveitar historico lateral e acoes do shell do pacote anterior, adaptadas ao `PRO`.

---

## Tasks / Subtasks

- [ ] Criar catalogo e rota do app `Respostas Prontas para WhatsApp`
- [ ] Implementar formulario com campos guiados e exemplos
- [ ] Implementar prompt fixo e schema de saida para 5 respostas
- [ ] Renderizar cards de resultado com acao de copiar
- [ ] Persistir historico por situacao
- [ ] Implementar favoritos, arquivamento e duplicacao
- [ ] Implementar acoes derivadas para follow-up e FAQ
- [ ] Validar responsividade e microcopy amigavel

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** gerar respostas genericas demais quando o input do usuario for fraco.
- **Mitigation:** adicionar coach tip, placeholders bons e validacoes minimas de contexto.
- **Verification:** revisar resultados com inputs curtos e inputs detalhados.

### Rollback Plan

1. Remover rota e entrada de catalogo do app.
2. Preservar historico global da suite.
3. Manter sem impacto os demais apps.

### Safety Checks

- [ ] O app nao expõe erros tecnicos do provider
- [ ] O app nao faz envio automatico
- [ ] O app nao quebra historico nem limites da suite

---

## File List

- [ ] rota individual do app
- [ ] componente do mini-app
- [ ] schema de entrada e saida
- [ ] template de prompt versionado
- [ ] endpoint de geracao correspondente

---

## CodeRabbit Integration

### Story Type Analysis

- Primary Type: Frontend
- Secondary Type(s): API, Integration
- Complexity: Medium
- Risk Level: MEDIUM RISK
- Integration Points:
  - foundation do `PRO`
  - pipeline de geracao
  - historico/favoritos

### Specialized Agent Assignment

- Primary Agents:
  - `@dev`
  - `@ux-design-expert`
- Supporting Agents:
  - `@qa`

### Quality Gate Tasks

- [ ] Pre-Commit: validar schema de saida estruturada e microcopy
- [ ] Pre-PR: validar mobile, favoritos, copiar e regenerar

### CodeRabbit Focus Areas

- Consistencia do resultado entre as 5 versoes
- UX de copia e historico
- Tratamento de input fraco
- Ausencia de integracao indevida com WhatsApp

---

## Definition of Done

- [ ] Formulario validado
- [ ] Saida com 5 versoes estruturadas
- [ ] Historico e favoritos funcionando
- [ ] Acoes derivadas expostas
- [ ] App alinhado ao design system v2
