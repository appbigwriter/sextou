# SextouTools PRO - Sprint 7 Lane Context Pack

**Status:** Ready for Dev  
**Last Updated:** 2026-06-17  
**Audience:** `aiox-dev` multi-agent lanes

---

## Shared Context

- Sprint liberada: [brownfield-sextou-tools-pro-sprint-7-kickoff.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-sprint-7-kickoff.md:1)
- Wave board: [brownfield-sextou-tools-pro-next-dev-wave.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-next-dev-wave.md:1)
- Foundation obrigatoria:
  - [lib/sextou-tools-pro/catalog.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/catalog.ts:1)
  - [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
  - [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
  - [lib/sextou-tools-pro/generation.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/generation.ts:1)
  - [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- Quality gate obrigatorio:
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd test`
- Regra de execucao:
  - trabalhar em worktree ou branch isolada por lane
  - nao alterar requisitos fora da story
  - atualizar apenas secoes permitidas da story quando a implementacao fechar

---

## Lane 1

### Identificacao

- Agente sugerido: `aiox-dev 01`
- Story: [brownfield-sextou-tools-pro-follow-up-5-messages.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-follow-up-5-messages.md:1)
- Status de entrada: `Approved`
- Gate de prontidao: `PASS`
- Prioridade: `Critical`

### Objetivo executavel

Implementar o app `follow-up-5-messages` completo dentro da foundation do `SextouTools PRO`, com estrutura fixa de 5 mensagens, marcacao por mensagem enviada em `metadataJson` e handoffs para `Objecoes`, `Proposta Comercial One-Page` e `Oferta`.

### Escopo fechado

- Criar slug `follow-up-5-messages`
- Implementar formulario por lead/canal
- Implementar schema de saida com:
  - `5` mensagens
  - intervalo sugerido entre mensagens
  - `CTA` de cada mensagem
  - versao curta da primeira mensagem
  - mensagem final de encerramento elegante
- Renderizar resultado com copia por mensagem e copia da sequencia completa
- Persistir historico por lead/campanha
- Persistir marcacao de mensagem enviada em `metadataJson`
- Expor acoes derivadas para:
  - resposta para objecao
  - proposta comercial
  - oferta melhorada

### Fora de escopo

- CRM
- envio automatico
- automacao de follow-up
- mudanca estrutural na pipeline do `PRO`

### Arquivos alvo obrigatorios

- [lib/sextou-tools-pro/catalog.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/catalog.ts:1)
- [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [lib/sextou-tools-pro/generation.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/generation.ts:1)
- [components/sextou-tools-pro/tools/](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools)
- [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [app/api/sextou-tools-pro/generations/[id]/route.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/app/api/sextou-tools-pro/generations/[id]/route.ts:1)
- [lib/sextou-tools-pro/history.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/history.ts:1)
- [lib/sextou-tools-pro/metadata.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/metadata.ts:1)

### Dependencias funcionais

- Reaproveitar favoritos, duplicacao, arquivamento e regeneracao do shell atual
- Manter coerencia com o app `respostas-prontas-whatsapp`
- Manter handoff com `proposta-comercial-one-page`

### Critico para QA

- tom etico, sem insistencia abusiva
- cardinalidade exata de `5` mensagens
- marcacao por mensagem persistindo e restaurando no historico

### Done binario

- app `follow-up-5-messages` publicado em rota propria
- schema/prompt/mock/renderizacao implementados
- historico salvo por lead/campanha
- marcacao por mensagem enviada funcionando
- handoffs previstos expostos
- `lint`, `typecheck` e `test` passando

### Prompt curto para delegacao

```text
Implemente a story brownfield-sextou-tools-pro-follow-up-5-messages.md na foundation atual do SextouTools PRO. Entregue slug proprio, schema/prompt/mock, componente do app, historico por lead/campanha, marcacao por mensagem enviada em metadataJson e handoffs para Objecoes, Proposta e Oferta. Nao crie CRM nem envio automatico. Feche com npm.cmd run lint, npm.cmd run typecheck e npm.cmd test.
```

---

## Lane 2

### Identificacao

- Agente sugerido: `aiox-dev 02`
- Story: [brownfield-sextou-tools-pro-local-ads.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-local-ads.md:1)
- Status de entrada: `Approved`
- Gate de prontidao: `PASS`
- Prioridade: `High`

### Objetivo executavel

Implementar o app `local-ads` completo dentro da foundation do `SextouTools PRO`, com saida curta multi-formato para anuncio local, WhatsApp, panfleto e 3 variacoes de abordagem, com handoffs para `Plano de Lancamento`, `Oferta` e `Follow-up`.

### Escopo fechado

- Criar slug `local-ads`
- Implementar formulario por campanha/canal
- Implementar schema de saida com:
  - headline
  - descricao
  - `CTA`
  - versao para WhatsApp
  - versao para panfleto
  - `3` variacoes de abordagem
- Renderizar blocos por formato de anuncio
- Persistir historico por campanha/canal
- Expor acoes derivadas para:
  - plano de lancamento
  - oferta irresistivel
  - sequencia de follow-up
- Implementar status operacional `em uso` em `metadataJson` se o corte continuar simples e aderente ao padrao existente

### Fora de escopo

- configuracao de midia paga
- criativo visual
- setup de campanha
- expansao de escopo para ads manager

### Arquivos alvo obrigatorios

- [lib/sextou-tools-pro/catalog.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/catalog.ts:1)
- [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [lib/sextou-tools-pro/generation.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/generation.ts:1)
- [components/sextou-tools-pro/tools/](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools)
- [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [lib/sextou-tools-pro/history.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/history.ts:1)
- [lib/sextou-tools-pro/metadata.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/metadata.ts:1)

### Dependencias funcionais

- Reaproveitar favoritos, duplicacao, arquivamento e regeneracao do shell atual
- Manter coerencia com `gerador-oferta-irresistivel`
- Manter handoff com `launch-plan-48h` e `follow-up-5-messages`

### Critico para QA

- separar claramente anuncio principal, WhatsApp e panfleto
- limitar a `3` variacoes
- nao abrir escopo para midia paga ou criativo visual
- se houver `em uso`, persistir sem criar estado operacional complexo

### Done binario

- app `local-ads` publicado em rota propria
- schema/prompt/mock/renderizacao implementados
- historico salvo por campanha/canal
- handoffs previstos expostos
- status `em uso` implementado apenas se ficar leve e coerente
- `lint`, `typecheck` e `test` passando

### Prompt curto para delegacao

```text
Implemente a story brownfield-sextou-tools-pro-local-ads.md na foundation atual do SextouTools PRO. Entregue slug proprio, schema/prompt/mock, componente do app, historico por campanha/canal e handoffs para Plano de Lancamento, Oferta e Follow-up. Nao implemente midia paga nem criativo visual. Se o status operacional em uso couber no padrao atual de metadataJson sem inflar escopo, inclua. Feche com npm.cmd run lint, npm.cmd run typecheck e npm.cmd test.
```
