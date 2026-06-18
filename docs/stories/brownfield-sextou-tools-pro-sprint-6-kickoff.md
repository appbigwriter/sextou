# SextouTools PRO - Kickoff Sprint 6

<!-- Source: docs/stories/brownfield-sextou-tools-pro-phase2-implementation-by-sprint.md + app stories da Sprint 6 -->

**Status:** Done  
**Last Updated:** 2026-06-17

---

## Objetivo

Executar a Sprint 6 com foco em apps de comunicacao basica e posicionamento, mantendo reaproveitamento total da foundation do `PRO` e reduzindo retrabalho entre prompts, schema e handoffs.

---

## Apps da Sprint

1. `Pitch de 30 Segundos`
2. `Bio Profissional`
3. `FAQ & Objecoes`

---

## Ordem de Execucao Sugerida

1. `Pitch de 30 Segundos`
2. `Bio Profissional`
3. `FAQ & Objecoes`

### Racional

- `Pitch` define a mensagem-base curta que alimenta a `Bio`.
- `Bio` consolida posicionamento por canal e prepara handoff para `FAQ`.
- `FAQ` fecha a camada de objecoes e respostas com contexto mais consistente depois de `Pitch` e `Bio`.

---

## Dependencias

### Dependencias comuns

- `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`
- `brownfield-sextou-tools-pro-foundation-data-llm-history.md`
- `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

### Dependencias de sequenciamento

- `Bio Profissional` deve reutilizar o posicionamento curto produzido em `Pitch`.
- `FAQ & Objecoes` deve expor handoff coerente com `Bio` e `WhatsApp`.
- Os 3 apps devem usar o mesmo shell visual, historico, favoritos, duplicacao e arquivamento do `PRO`.

---

## Criterio de Pronto por App

### Pitch de 30 Segundos

- Rota propria e independente publicada
- Formulario curto validado
- Resultado com pitch de 30s, versao de 10s, versao para WhatsApp, bio curta e frase de encerramento
- Historico por negocio salvo
- Acoes derivadas para `Bio Profissional`, video e descricao institucional
- Experiencia mobile e copia rapida validadas

### Bio Profissional

- Rota propria e independente publicada
- Formulario com contexto de posicionamento e canal
- Resultado com bio para Instagram, bio para LinkedIn, descricao para Google, headline, CTA e palavras-chave
- Limites por canal respeitados
- Historico por canal salvo
- Acoes derivadas para conteudo, posts de apresentacao e `FAQ`

### FAQ & Objecoes

- Rota propria e independente publicada
- Formulario com duvidas reais, objecoes, tom e canal
- Resultado com 10 FAQs, 5 objecoes, mensagem curta para WhatsApp e sugestao de uso
- Sem inventar politicas nao informadas pelo usuario
- Historico reutilizavel salvo
- Acoes derivadas para `WhatsApp`, `Bio` e conteudo educativo

---

## Checklist Operacional

- [x] Confirmar foundation do `PRO` utilizavel sem novo desvio de arquitetura
- [x] Implementar apps na ordem `Pitch -> Bio -> FAQ`
- [x] Fechar rota propria e catalogo de cada app antes de avancar para a proxima story
- [x] Validar prompt e schema de saida de cada app antes de ligar handoffs
- [x] Validar persistencia no historico por app antes de abrir QA final
- [x] Garantir copia, favoritos, duplicacao e arquivamento nos 3 apps
- [x] Garantir handoffs entre `Pitch`, `Bio`, `FAQ` e `WhatsApp`
- [x] Executar QA mobile e regressao ao final de cada app
- [x] Fechar a sprint somente com os 3 apps `live`

---

## Gate de Encerramento da Sprint

- 3 apps publicados em paginas proprias e independentes
- Historico por app funcionando
- Acoes compartilhadas do `PRO` funcionando
- Handoffs entre `Pitch`, `Bio`, `FAQ` e `WhatsApp` funcionando

---

## PM Decision

- Sprint 6 revisada apos revalidacao de QA em 2026-06-17.
- `Pitch de 30 Segundos`, `Bio Profissional` e `FAQ & Objecoes` atendem o escopo planejado do PRD para esta sprint.
- Gate final de produto: `DONE`.
