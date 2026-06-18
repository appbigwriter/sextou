# SextouTools PRO - Kickoff Sprint 7

<!-- Source: docs/stories/brownfield-sextou-tools-pro-phase2-implementation-by-sprint.md + app stories da Sprint 7 -->

**Status:** Ready for Execution  
**Last Updated:** 2026-06-17

---

## Objetivo

Executar a Sprint 7 com foco em recuperacao comercial e anuncios locais, reaproveitando a foundation existente do `PRO` e preservando o fluxo de handoff com `WhatsApp`, `Oferta` e `Proposta`.

---

## Apps da Sprint

1. `Follow-up Comercial em 5 Mensagens`
2. `Gerador de Anuncios Locais`

---

## Ordem de Execucao Sugerida

1. `Follow-up Comercial em 5 Mensagens`
2. `Gerador de Anuncios Locais`

### Racional

- `Follow-up` fecha o gap de retomada comercial apos proposta ou contato inicial.
- `Anuncios Locais` reaproveita melhor os insumos de `Oferta`, `Follow-up` e `Plano de Lancamento`.

---

## Dependencias

### Dependencias comuns

- `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`
- `brownfield-sextou-tools-pro-foundation-data-llm-history.md`
- `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

### Dependencias de sequenciamento

- `Follow-up` deve manter handoff coerente com `WhatsApp`, `Objecoes` e `Proposta Comercial One-Page`.
- `Anuncios Locais` deve expor handoff coerente com `Oferta`, `Follow-up` e `Plano de Lancamento`.
- Os 2 apps devem usar o mesmo shell visual, historico, favoritos, duplicacao e arquivamento do `PRO`.

---

## Criterio de Pronto por App

### Follow-up Comercial em 5 Mensagens

- Rota propria e independente publicada
- Formulario por lead/campanha validado
- Resultado com 5 mensagens, intervalos sugeridos, CTA por mensagem, versao curta inicial e encerramento elegante
- Historico com marcacao por mensagem enviada salvo em `metadataJson`
- Acoes derivadas para `Objecoes`, `Proposta Comercial One-Page` e `Oferta`
- Experiencia mobile e copia rapida validadas

### Gerador de Anuncios Locais

- Rota propria e independente publicada
- Formulario por campanha e canal validado
- Resultado com headline, descricao, CTA, versao WhatsApp, versao panfleto e 3 variacoes
- Historico por campanha/canal salvo
- Marcacao operacional `em uso` implementada se entrar no corte final da story
- Acoes derivadas para `Plano de Lancamento`, `Oferta` e `Follow-up`

---

## Checklist Operacional

- [ ] Confirmar foundation do `PRO` reutilizavel para marcacoes operacionais leves
- [ ] Implementar apps na ordem `Follow-up -> Anuncios Locais`
- [ ] Fechar rota propria e catalogo de cada app antes de avancar para QA
- [ ] Validar prompt e schema de saida de cada app antes de ligar handoffs
- [ ] Validar persistencia no historico e em `metadataJson` quando aplicavel
- [ ] Garantir copia, favoritos, duplicacao e arquivamento nos 2 apps
- [ ] Garantir handoffs entre `Follow-up`, `Anuncios Locais`, `Oferta`, `Proposta` e `WhatsApp`
- [ ] Executar QA mobile e regressao ao final de cada app
- [ ] Fechar a sprint somente com os 2 apps `live`

---

## Gate de Encerramento da Sprint

- 2 apps publicados em paginas proprias e independentes
- Historico por app funcionando
- Acoes compartilhadas do `PRO` funcionando
- Handoffs de `Follow-up` e `Anuncios Locais` funcionando

---

## PM Decision

- Sprint 7 liberada para execucao em 2026-06-17.
- Stories de entrada:
  - `brownfield-sextou-tools-pro-follow-up-5-messages.md`
  - `brownfield-sextou-tools-pro-local-ads.md`
