# SextouTools PRO - Ordem de Implementacao por Sprint

<!-- Source: docs/SextouTools_PRO_PRD.md + docs/stories/brownfield-sextou-tools-pro-*.md -->

**Status:** Completed  
**Last Updated:** 2026-06-16

---

## Premissas de Execucao

- Cada app do `SextouTools PRO` deve ter uma pagina propria e independente.
- O design system e o mesmo do pacote anterior.
- O MVP Core da Fase 1 continua com 5 apps:
  - `Respostas Prontas para WhatsApp`
  - `Gerador de Oferta Irresistivel`
  - `Calendario de Conteudo de 7 Dias`
  - `Proposta Comercial One-Page`
  - `Roteiro de Reels/Shorts de 30s`

---

## Sprint 0 - Decisoes Tecnicas Curtas

### Objetivo

Fechar os poucos pontos de arquitetura que impactam todas as stories.

### Entregas

- Definir namespace final do `PRO`
- Definir provider/modelo de LLM
- Definir schema Prisma do `PRO`
- Definir estrategia de prompt versionado

### Observacao

Se o time ja estiver alinhado nesses pontos, esta sprint pode ser absorvida no Sprint 1.

---

## Sprint 1 - Foundation de Navegacao e UX

### Objetivo

Publicar a casca navegavel da suite com paginas independentes por app.

### Stories

1. `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`
2. `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

### Definition of Done da Sprint

- Landing/hub publico do `PRO`
- Dashboard autenticado do `PRO`
- Catalogo separado
- Rota propria e independente para cada um dos 5 apps
- Shell visual compartilhado
- Estados amigaveis padronizados

---

## Sprint 2 - Foundation de Dados e Infra de Geracao

### Objetivo

Deixar historico, limites e pipeline compartilhado prontos para receber os apps.

### Stories

1. `brownfield-sextou-tools-pro-foundation-data-llm-history.md`

### Definition of Done da Sprint

- Persistencia estruturada do `PRO`
- Pipeline compartilhado de LLM
- Limites diarios e regeneracao
- Favoritos, arquivamento, exclusao logica e duplicacao
- Compatibilidade retroativa com o pacote anterior

---

## Sprint 3 - Apps de Maior Uso Diario

### Objetivo

Entregar os dois apps com uso mais frequente e maior valor imediato.

### Stories

1. `brownfield-sextou-tools-pro-whatsapp-replies.md`
2. `brownfield-sextou-tools-pro-offer-generator.md`

### Definition of Done da Sprint

- Dois apps `live`
- Cada app com pagina propria e independente
- Historico por app funcionando
- Acoes derivadas iniciais funcionando

---

## Sprint 4 - Conteudo e Video

### Objetivo

Entregar o fluxo editorial curto da suite.

### Stories

1. `brownfield-sextou-tools-pro-content-calendar-7-days.md`
2. `brownfield-sextou-tools-pro-reels-script-30s.md`

### Definition of Done da Sprint

- Calendario semanal `live`
- Roteiro de Reels `live`
- Handoff funcional entre calendario e reels
- Cada app com pagina propria e independente

---

## Sprint 5 - Proposta Comercial e Fechamento do MVP Core

### Objetivo

Fechar a Fase 1 do MVP Core com o app mais comercial do pacote.

### Stories

1. `brownfield-sextou-tools-pro-one-page-proposal.md`

### Definition of Done da Sprint

- Proposta One-Page `live`
- Distincao clara frente ao `gerador-orcamento-pdf` do pacote anterior
- 5 apps do MVP Core publicados

---

## Fechamento da Fase

- `Sprint 1` concluida
- `Sprint 2` concluida
- `Sprint 3` concluida
- `Sprint 4` concluida
- `Sprint 5` concluida
- Os 5 miniapps do `SextouTools PRO` estao publicados em paginas proprias e independentes
- Estados operacionais avancados ficaram persistidos via `metadataJson` sem quebrar o status macro do historico
- Quality gates do repositorio passaram a existir como scripts executaveis

---

## Ordem Recomendada Dentro de Cada Sprint

1. Rota e pagina propria do app
2. Formulario e validacao
3. Prompt e schema de saida
4. Renderizacao do resultado
5. Persistencia no historico
6. Acoes derivadas
7. QA mobile e regressao

---

## Dependencias Atualizadas

- Apps do MVP dependem de:
  - `brownfield-sextou-tools-pro-foundation-routing-dashboard.md`
  - `brownfield-sextou-tools-pro-foundation-data-llm-history.md`
  - `brownfield-sextou-tools-pro-foundation-shared-ux-actions.md`

---

## Riscos de Sequenciamento

- Nao iniciar implementacao de app antes de existir pagina propria, shell e pipeline compartilhado.
- Nao acoplar proposta one-page ao fluxo de PDF do pacote anterior.
- Nao misturar historico antigo com historico do `PRO` sem modelo dedicado.
