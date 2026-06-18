# SextouTools PRO - Fase 2 Ordem de Implementacao por Sprint

<!-- Source: docs/SextouTools_PRO_PRD.md + priorizacao fase 2 -->

**Status:** In Progress  
**Last Updated:** 2026-06-17

---

## Premissas

- Cada app do `SextouTools PRO` deve ter pagina propria e independente.
- O design system continua o mesmo do pacote anterior e da Fase 1 do `PRO`.
- A foundation atual de auth, historico, limites, duplicacao, favoritos e pipeline LLM deve ser reaproveitada.
- Sempre que possivel, estados avancados devem ser persistidos em `metadataJson` sem quebrar o modelo macro ja existente.

---

## Sprint 6 - Comunicacao Basica e Posicionamento

### Objetivo

Entregar os apps de menor friccao e maior utilidade imediata para onboarding e comunicacao comercial.

### Stories

1. `brownfield-sextou-tools-pro-pitch-30-seconds.md`
2. `brownfield-sextou-tools-pro-professional-bio.md`
3. `brownfield-sextou-tools-pro-faq-objections.md`

### Sprint Status

- `DONE` em 2026-06-17 apos implementacao, revalidacao de QA e revisao final de PM.

### Definition of Done da Sprint

- 3 apps `live`
- Cada app com pagina propria e independente
- Historico por app funcionando
- Copia, favoritos, duplicacao e arquivamento funcionando
- Handoffs entre `Pitch`, `Bio`, `FAQ` e `WhatsApp`

---

## Sprint 7 - Recuperacao Comercial e Anuncios

### Objetivo

Fechar o fluxo de conversao curta para leads, propostas e campanhas simples.

### Stories

1. `brownfield-sextou-tools-pro-follow-up-5-messages.md`
2. `brownfield-sextou-tools-pro-local-ads.md`

### Sprint Status

- `READY FOR EXECUTION` em 2026-06-17 apos fechamento da Sprint 6.
- Ordem recomendada de implementacao: `Follow-up Comercial em 5 Mensagens` -> `Gerador de Anuncios Locais`.

### Definition of Done da Sprint

- `Follow-up` live
- `Anuncios Locais` live
- Handoff funcional com `Oferta`, `Proposta` e `WhatsApp`
- Marcacoes operacionais persistidas quando fizer sentido

---

## Sprint 8 - Estrategia Rapida

### Objetivo

Entregar os apps que organizam direcao de negocio e campanhas de curto prazo.

### Stories

1. `brownfield-sextou-tools-pro-business-diagnosis.md`
2. `brownfield-sextou-tools-pro-launch-plan-48h.md`

### Definition of Done da Sprint

- `Diagnostico Express` live
- `Plano de Lancamento 48h` live
- Proximos apps recomendados renderizados no resultado
- Handoffs para `Oferta`, `Conteudo`, `Anuncios`, `Reels` e `Follow-up`

---

## Sprint 9 - Servicos e Comercial Consultivo

### Objetivo

Entregar os apps de organizacao de servicos e formacao de preco.

### Stories

1. `brownfield-sextou-tools-pro-creative-brief.md`
2. `brownfield-sextou-tools-pro-service-pricing.md`

### Definition of Done da Sprint

- `Briefing` live
- `Precificador` live
- Calculos deterministicos do `Precificador` funcionando
- Handoffs para `Proposta`, `Oferta`, `Anuncios` e CTA de servico

---

## Sprint 10 - Crescimento Local e Fechamento da Suite

### Objetivo

Fechar os 15 apps do PRD e consolidar a Fase 2 da suite completa.

### Stories

1. `brownfield-sextou-tools-pro-local-partnerships.md`

### Definition of Done da Sprint

- `Parcerias Locais` live
- Dashboard com 15 apps publicados
- Categorias do PRD refletidas no dashboard
- Historico e recomendacoes coerentes com os 15 apps

---

## Ordem Recomendada Dentro de Cada Sprint

1. Rota individual do app
2. Formulario validado
3. Prompt e schema de saida
4. Renderizacao do resultado
5. Persistencia no historico
6. Acoes derivadas
7. QA mobile e regressao

---

## Resultado Final Esperado

- 10 novos apps publicados
- 15 apps totais no `SextouTools PRO`
- Dashboard completo conforme PRD
- Foundation reutilizada sem criar segunda stack paralela
