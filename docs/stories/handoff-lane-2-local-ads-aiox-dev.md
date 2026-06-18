# Handoff - Lane 2 - Sprint 7 - `aiox-dev 02`

## Agente alvo

- `aiox-dev 02`

## Story

- [brownfield-sextou-tools-pro-local-ads.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-local-ads.md:1)

## Contexto minimo obrigatorio

- Sprint 7 liberada: [brownfield-sextou-tools-pro-sprint-7-kickoff.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-sprint-7-kickoff.md:1)
- Wave board: [brownfield-sextou-tools-pro-next-dev-wave.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-next-dev-wave.md:1)
- Lane pack: [brownfield-sextou-tools-pro-sprint-7-lane-context-pack.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-sprint-7-lane-context-pack.md:1)

## Objetivo

Implementar o app `local-ads` completo dentro da foundation atual do `SextouTools PRO`.

## Escopo fechado

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
- Expor handoffs para:
  - `Plano de Lancamento`
  - `Oferta`
  - `Follow-up`
- Implementar status operacional `em uso` em `metadataJson` apenas se continuar leve e coerente com o padrao atual

## Fora de escopo

- configuracao de midia paga
- criativo visual
- setup de campanha
- qualquer expansao para ads manager

## Arquivos alvo principais

- [lib/sextou-tools-pro/catalog.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/catalog.ts:1)
- [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [lib/sextou-tools-pro/generation.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/generation.ts:1)
- [components/sextou-tools-pro/tools/](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools)
- [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [lib/sextou-tools-pro/history.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/history.ts:1)
- [lib/sextou-tools-pro/metadata.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/metadata.ts:1)

## Criticos de implementacao

- separar claramente anuncio principal, WhatsApp e panfleto
- limitar a `3` variacoes
- nao abrir escopo para midia paga ou criativo visual
- se houver `em uso`, persistir sem criar estado operacional complexo

## Validacao obrigatoria

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`

## Done binario

- app publicado em rota propria
- schema/prompt/mock/renderizacao implementados
- historico por campanha/canal funcionando
- handoffs previstos expostos
- status `em uso` implementado apenas se seguir leve
- validacoes obrigatorias passando

## Prompt de disparo

```text
*develop docs/stories/brownfield-sextou-tools-pro-local-ads.md

Implemente a story na foundation atual do SextouTools PRO. Entregue slug proprio, schema/prompt/mock, componente do app, historico por campanha/canal e handoffs para Plano de Lancamento, Oferta e Follow-up. Nao implemente midia paga nem criativo visual. Se o status operacional em uso couber no padrao atual de metadataJson sem inflar escopo, inclua. Feche com npm.cmd run lint, npm.cmd run typecheck e npm.cmd test.
```
