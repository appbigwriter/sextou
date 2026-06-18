# Handoff - Lane 1 - Sprint 7 - `aiox-dev 01`

## Agente alvo

- `aiox-dev 01`

## Story

- [brownfield-sextou-tools-pro-follow-up-5-messages.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-follow-up-5-messages.md:1)

## Contexto minimo obrigatorio

- Sprint 7 liberada: [brownfield-sextou-tools-pro-sprint-7-kickoff.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-sprint-7-kickoff.md:1)
- Wave board: [brownfield-sextou-tools-pro-next-dev-wave.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-next-dev-wave.md:1)
- Lane pack: [brownfield-sextou-tools-pro-sprint-7-lane-context-pack.md](/abs/path/C:/Projetos/2SextaEmpreendedor/docs/stories/brownfield-sextou-tools-pro-sprint-7-lane-context-pack.md:1)

## Objetivo

Implementar o app `follow-up-5-messages` completo dentro da foundation atual do `SextouTools PRO`.

## Escopo fechado

- Criar slug `follow-up-5-messages`
- Implementar formulario por lead/canal
- Implementar schema de saida com:
  - `5` mensagens
  - intervalo sugerido entre mensagens
  - `CTA` por mensagem
  - versao curta da primeira mensagem
  - mensagem final de encerramento elegante
- Renderizar copia por mensagem e copia da sequencia completa
- Persistir historico por lead/campanha
- Persistir marcacao de mensagem enviada em `metadataJson`
- Expor handoffs para:
  - `Objecoes`
  - `Proposta Comercial One-Page`
  - `Oferta`

## Fora de escopo

- CRM
- envio automatico
- automacao de follow-up
- qualquer stack paralela fora da pipeline atual

## Arquivos alvo principais

- [lib/sextou-tools-pro/catalog.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/catalog.ts:1)
- [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [lib/sextou-tools-pro/generation.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/generation.ts:1)
- [components/sextou-tools-pro/tools/](/abs/path/C:/Projetos/2SextaEmpreendedor/components/sextou-tools-pro/tools)
- [app/sextou-tools-pro/[slug]/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/sextou-tools-pro/[slug]/page.tsx:1)
- [app/api/sextou-tools-pro/generations/[id]/route.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/app/api/sextou-tools-pro/generations/[id]/route.ts:1)
- [lib/sextou-tools-pro/history.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/history.ts:1)
- [lib/sextou-tools-pro/metadata.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/metadata.ts:1)

## Criticos de implementacao

- Manter tom etico e nao insistente
- Garantir cardinalidade exata de `5`
- Persistir e restaurar marcacao por mensagem enviada
- Reaproveitar favoritos, duplicacao, arquivamento e regeneracao

## Validacao obrigatoria

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`

## Done binario

- app publicado em rota propria
- schema/prompt/mock/renderizacao implementados
- historico por lead/campanha funcionando
- marcacao por mensagem enviada funcionando
- handoffs previstos expostos
- validacoes obrigatorias passando

## Prompt de disparo

```text
*develop docs/stories/brownfield-sextou-tools-pro-follow-up-5-messages.md

Implemente a story na foundation atual do SextouTools PRO. Entregue slug proprio, schema/prompt/mock, componente do app, historico por lead/campanha, marcacao por mensagem enviada em metadataJson e handoffs para Objecoes, Proposta e Oferta. Nao crie CRM nem envio automatico. Feche com npm.cmd run lint, npm.cmd run typecheck e npm.cmd test.
```
