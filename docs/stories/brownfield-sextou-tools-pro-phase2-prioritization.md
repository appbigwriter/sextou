# SextouTools PRO - Fase 2 Prioritizacao

<!-- Source: docs/SextouTools_PRO_PRD.md -->

**Status:** Draft  
**Last Updated:** 2026-06-16

---

## Objetivo

Priorizar os 10 mini-apps restantes do `SextouTools PRO` para completar a suite de 15 apps prevista no PRD.

---

## Principios de Priorizacao

1. Maximizar reutilizacao da foundation e dos apps da Fase 1.
2. Entregar primeiro os apps com maior recorrencia de uso semanal.
3. Favorecer apps com handoff natural entre si.
4. Adiar para depois os apps que exigem mais logica deterministica ou estados mais ricos.
5. Manter a regra de que cada app precisa ter pagina propria e independente.

---

## Priorizacao Recomendada

### Tier 1 - Alto impacto e baixa friccao

1. `Follow-up Comercial em 5 Mensagens`
2. `Bio Profissional para Instagram, Google e LinkedIn`
3. `Pitch de 30 Segundos`
4. `FAQ & Objeções do Cliente`

### Tier 2 - Alto impacto com boa sinergia comercial

5. `Gerador de Anuncios Locais`
6. `Diagnostico Express do Negocio`
7. `Plano de Lancamento em 48 Horas`

### Tier 3 - Valor alto, mas com mais regra de dominio

8. `Briefing de Logo, Site ou Material Grafico`
9. `Precificador Simples de Servicos`
10. `Ideias de Parcerias Locais`

---

## Justificativa Resumida por App

- `Follow-up Comercial`: reaproveita diretamente `WhatsApp`, `Oferta` e `Proposta`, com alta chance de uso recorrente.
- `Bio Profissional`: baixa complexidade, alto valor de onboarding e utilidade imediata em varios canais.
- `Pitch de 30 Segundos`: baixo custo de implementacao e forte efeito de ativacao para usuarios novos.
- `FAQ & Objeções`: alimenta `WhatsApp`, `Bio`, `Conteudo` e atendimento comercial.
- `Gerador de Anuncios Locais`: conecta com `Oferta`, `Reels` e campanhas de curta duracao.
- `Diagnostico Express`: bom app de entrada e de recomendacao para outros apps, mas pede mais cuidado com direcionamento.
- `Plano de Lancamento em 48 Horas`: muito valioso, mas depende de bons handoffs para `Anuncios`, `Reels` e `Follow-up`.
- `Briefing`: importante para monetizacao indireta, mas nao e o app de maior recorrencia semanal.
- `Precificador`: exige calculo deterministico e explicacao comercial, portanto merece sprint com mais atencao.
- `Ideias de Parcerias`: valor real, mas menos frequente no uso diario do que vendas, conteudo e atendimento.

---

## Dependencias Funcionais Mais Fortes

- `Follow-up` depende conceitualmente de `WhatsApp` e `Proposta`.
- `Anuncios Locais` depende conceitualmente de `Oferta`.
- `FAQ` reforca `WhatsApp`, `Bio` e `Conteudo`.
- `Plano de Lancamento` depende conceitualmente de `Anuncios`, `Reels` e `Follow-up`.
- `Precificador` conversa diretamente com `Proposta` e `Oferta`.
- `Briefing` gera ponte para servicos pagos e pode receber handoff de `Proposta`.

---

## Resultado Recomendado

- Comecar pela camada de comunicacao e follow-up.
- Fechar depois o pacote de acquisicao e campanha.
- Encerrar com os apps que exigem mais regra de negocio, calculo ou processo comercial mais longo.
