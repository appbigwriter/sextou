# Story: Brazilian Business Toolkit - Documento de Execucao Brownfield

<!-- Source: docs/SextouTools.md + docs/design-system-v2.html + codebase atual -->
<!-- Context: Brownfield enhancement para incluir Sextou Tools no site existente -->

**Version:** 1.0.0
**Last Updated:** 2026-06-15
**Status:** Draft

---

## Overview

Este documento organiza a execucao para incluir um novo item de menu no sistema `Sextou Tools`, criar a pagina hub `Brazilian Business Toolkit` e entregar cada mini-app como pagina independente dentro do site atual.

O plano foi derivado de:

- `docs/SextouTools.md`
- `docs/design-system-v2.html`
- estrutura real do projeto em `app/`, `components/`, `lib/` e `prisma/`

---

## Objetivo

Entregar uma nova area do produto com estas capacidades:

1. Novo item de navegacao `Sextou Tools`
2. Pagina indice com o titulo `Brazilian Business Toolkit`
3. Menu de mini-apps com cards e status por modulo
4. Uma rota independente para cada mini-app
5. Acesso restrito a usuarios autenticados
6. Historico salvo por usuario no banco
7. Botao de compartilhar em todos os mini-apps
8. Botao de voltar para a lista em todos os mini-apps
9. UI alinhada ao `design-system-v2`

---

## Estado Atual do Sistema

### Pontos reais de integracao no codigo

- Navegacao publica principal em [app/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/page.tsx:23)
- Menu mobile reutilizavel em [components/layout/mobile-menu.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/components/layout/mobile-menu.tsx:12)
- Dashboard autenticado em [app/dashboard/page.tsx](/abs/path/C:/Projetos/2SextaEmpreendedor/app/dashboard/page.tsx:124)
- Autenticacao via NextAuth em [lib/auth.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/auth.ts:1)
- Persistencia atual via Prisma em [prisma/schema.prisma](/abs/path/C:/Projetos/2SextaEmpreendedor/prisma/schema.prisma:1)

### Leitura tecnica do estado atual

- O projeto ja usa App Router do Next.js, entao o encaixe natural e criar novas rotas em `app/sextou-tools/`
- O schema atual nao possui modelos para catalogo, execucao ou historico dos mini-apps
- O dashboard ja exige login e e o melhor ponto para descoberta recorrente das ferramentas
- O visual atual do site usa `Inter` + `Outfit` e tema claro em varias telas, enquanto o `design-system-v2` define uma linguagem dark, com `Bricolage Grotesque`, `Inter`, `JetBrains Mono`, gradiente vermelho-laranja e CTAs maiores mobile-first

---

## Conflitos e Decisoes Necessarias

### Conflito de requisito encontrado

O documento `docs/SextouTools.md` define ao mesmo tempo:

- regra global: todos os mini-apps devem exigir login e salvar historico em banco
- criterios de aceite individuais de alguns modulos: QR Code, Calculadora de Preco, ROI e Checklist funcionam sem login ou com `localStorage`

### Diretriz para execucao

Para implementacao no site atual, o plano deve seguir a regra global como fonte principal:

- mini-apps acessados apenas por usuario logado
- historico salvo por usuario no banco
- `localStorage` pode existir apenas como autosave temporario de formulario, nunca como persistencia oficial

### Decisoes de produto que precisam ficar explicitas antes do build completo

- Se o menu `Sextou Tools` sera publico com CTA para login ou totalmente escondido para anonimos
- Se a fase 1 entra no menu principal publico, no dashboard, ou nos dois
- Se o hub mostrara modulos futuros como `Em breve` ou apenas modulos liberados
- Se o compartilhamento sera por `Web Share API`, copia de link ou ambos

---

## Escopo Recomendado

### Fase 1 - Foundation obrigatoria

- Navegacao e descoberta do `Sextou Tools`
- Rota hub `app/sextou-tools/page.tsx`
- Layout compartilhado para mini-apps
- Guard de autenticacao
- Persistencia de historico por usuario
- Catalogo de apps com metadados centralizados
- Componentes compartilhados: header da suite, card de app, botao share, botao back, empty state, historico

### Fase 2 - Quick wins recomendados por prioridade

1. Gerador de QR Code
2. Calculadora de Preco de Servico
3. Calculadora de ROI de Campanha
4. Checklist de Abertura de Empresa

### Fase 3 - Documentos e gestao comercial

5. Gerador de Orcamento em PDF
6. Gerenciador de Oportunidades - Leads
7. Gerador de Invoice com envio por e-mail

### Fase 4 - Operacao e comunidade

8. Gerenciador de Projetos e Tarefas
9. Diretorio de Empresas Brasileiras

---

## Backlog de Execucao em 4 Fases

## Fase 1 - Fundacao da Suite

### Objetivo

Preparar arquitetura, dados, autenticacao e design base para que todos os mini-apps usem o mesmo padrao.

### Tasks / Subtasks

- [ ] Criar namespace de rotas `app/sextou-tools/`
- [ ] Adicionar item `Sextou Tools` na navegacao publica em `app/page.tsx`
- [ ] Adicionar item `Sextou Tools` no menu mobile em `components/layout/mobile-menu.tsx`
- [ ] Adicionar entrada de descoberta no dashboard em `app/dashboard/page.tsx`
- [ ] Criar configuracao central de catalogo dos mini-apps com `slug`, titulo, descricao, status e prioridade
- [ ] Criar layout compartilhado da suite com heading, navegacao secundaria e estados vazios
- [ ] Criar guard server-side baseado em `auth()` para todas as rotas da suite
- [ ] Modelar persistencia Prisma para historico de execucoes por usuario
- [ ] Definir convencao de share links e deep links por mini-app
- [ ] Aplicar tokens visuais do `design-system-v2` na suite sem quebrar o restante do site

### Definition of Done

- Existe uma rota base navegavel para `Sextou Tools`
- Usuario anonimo nao consegue usar mini-app
- Usuario autenticado acessa o hub e ve o catalogo
- Existe estrutura de banco para historico por usuario
- Componentes compartilhados evitam repeticao entre modulos

---

## Fase 2 - Hub + Quick Wins

### Macro-objetivo

Entregar o hub `Brazilian Business Toolkit` e publicar os 4 mini-apps de entrada da suite.

### Bloco 2.1 - Hub Brazilian Business Toolkit

### Objetivo

Entregar a pagina indice da suite como menu de mini-apps, com visual consistente e pronto para crescer.

### Tasks / Subtasks

- [ ] Criar pagina hub com titulo `Brazilian Business Toolkit`
- [ ] Exibir cards por mini-app com CTA de entrada
- [ ] Exibir estado `Disponivel`, `Em breve` ou `Beta`
- [ ] Exibir descricao curta e beneficio de negocio por app
- [ ] Incluir indicador de login e historico recente do usuario
- [ ] Incluir busca ou filtro simples se o numero de apps publicados justificar
- [ ] Validar responsividade mobile-first com alvos de toque de 48px/54px
- [ ] Aplicar tipografia `Bricolage Grotesque` para titulos da suite
- [ ] Aplicar CTAs e cards derivados de `btn-grad`, `btn-cta`, `--r-xl`, `--r-2xl`, `--grad-brand`

### Definition of Done

- O hub funciona como pagina de entrada unica da suite
- Todos os mini-apps publicados aparecem como itens independentes
- O visual do hub conversa com o `design-system-v2`

---

### Bloco 2.2 - Infra compartilhada por Mini-App

### Objetivo

Padronizar a experiencia de uso para qualquer mini-app da suite.

### Tasks / Subtasks

- [ ] Criar shell de mini-app com breadcrumb simples ou botao `Voltar para ferramentas`
- [ ] Criar botao compartilhado de share
- [ ] Criar area padrao de formulario + resultado + historico
- [ ] Criar feedbacks de loading, sucesso e erro no mesmo padrao visual
- [ ] Criar persistencia padrao de execucao para todos os mini-apps
- [ ] Criar convencao para salvar `input`, `output`, `metadata` e `createdAt`
- [ ] Criar telemetria minima de uso por modulo se o projeto ja possuir observabilidade compativel

### Definition of Done

- Todo mini-app consegue reutilizar o mesmo shell
- Todo mini-app possui `Share` e `Voltar`
- Todo mini-app pode registrar historico por usuario

---

### Bloco 2.3 - Quick Wins sem dependencias pesadas

### 4.1 Gerador de QR Code

- [ ] Criar rota independente do modulo
- [ ] Implementar seletor de tipo de QR
- [ ] Implementar formulario dinamico por tipo
- [ ] Gerar preview em tempo real
- [ ] Permitir download PNG
- [ ] Permitir download SVG se a biblioteca adotada suportar
- [ ] Persistir historico por usuario
- [ ] Implementar share e voltar

### 4.2 Calculadora de Preco de Servico

- [ ] Criar rota independente do modulo
- [ ] Implementar campos de custo, hora, taxas e margem
- [ ] Calcular custo base, preco minimo e preco ideal
- [ ] Exibir memoria de calculo
- [ ] Permitir copiar resumo
- [ ] Persistir historico por usuario
- [ ] Implementar share e voltar

### 4.3 Calculadora de ROI de Campanha

- [ ] Criar rota independente do modulo
- [ ] Implementar campos de investimento, leads, vendas, ticket e margem
- [ ] Calcular CPL, conversao, receita, lucro, ROI e ROAS
- [ ] Exibir diagnostico textual
- [ ] Permitir copiar resumo
- [ ] Persistir historico por usuario
- [ ] Implementar share e voltar

### 4.4 Checklist de Abertura de Empresa

- [ ] Criar rota independente do modulo
- [ ] Implementar selecao de perfil
- [ ] Exibir checklist por etapas
- [ ] Salvar progresso e notas por usuario
- [ ] Exibir progresso percentual
- [ ] Preparar exportacao futura
- [ ] Implementar share e voltar

### Definition of Done

- Os 4 modulos de fase 1 funcionam com o mesmo shell
- Todos salvam historico ou progresso em banco
- Todos obedecem o padrao de navegacao da suite

---

## Fase 3 - Documentos e Gestao Comercial

### Modulos

- [ ] Gerador de Orcamento em PDF
- [ ] Gerenciador de Oportunidades - Leads
- [ ] Gerador de Invoice com envio por e-mail

### Dependencias adicionais

- [ ] Estrategia de PDF consistente
- [ ] Estrategia de status por documento
- [ ] Estrategia de envio de e-mail
- [ ] Estrategia de relacionamento entre lead -> quote -> invoice

---

## Fase 4 - Operacao e Comunidade

### Modulos

- [ ] Gerenciador de Projetos e Tarefas
- [ ] Diretorio de Empresas Brasileiras

### Dependencias adicionais

- [ ] Modelagem relacional mais rica
- [ ] Permissoes por dono e visibilidade publica
- [ ] Fluxo administrativo para moderacao do diretorio

---

## Estrutura Tecnica Recomendada

### Rotas

- `app/sextou-tools/page.tsx` - hub da suite
- `app/sextou-tools/[slug]/page.tsx` - pagina individual de cada mini-app

### Componentes compartilhados

- `components/sextou-tools/toolkit-header.tsx`
- `components/sextou-tools/tool-card.tsx`
- `components/sextou-tools/tool-shell.tsx`
- `components/sextou-tools/share-button.tsx`
- `components/sextou-tools/history-list.tsx`

### Servicos e tipos

- `lib/sextou-tools/catalog.ts`
- `lib/sextou-tools/auth.ts`
- `lib/sextou-tools/history.ts`
- `types/sextou-tools.ts`

### Dados

- Prisma: modelos dedicados para suite, apps e historico de execucoes

Obs.: os nomes finais podem variar, mas a separacao por dominio deve ser preservada.

---

## Requisitos de Design extraidos do design-system-v2

- Tipos: `Bricolage Grotesque` para titulos, `Inter` para UI, `JetBrains Mono` para dados
- Cores: base dark com gradiente `#FF3D57 -> #FF8C00`
- CTA principal: estilo `btn-grad`
- CTA secundaria: estilo `btn-cta`
- Campos: labels upper, foco com halo de destaque e altura minima de toque
- Cards: `--r-xl` ou `--r-2xl`, bordas suaves e contraste alto
- Mobile-first: toque minimo `48px`, CTA principal `54px`

### Risco de integracao visual

O site atual nao segue esse design system em todas as paginas. Para reduzir regressao visual:

- aplicar o design v2 primeiro apenas dentro do namespace `Sextou Tools`
- evitar refatorar a home inteira junto com esta entrega

---

## Riscos e Mitigacoes

### Risco 1 - Escopo excessivo

- **Risco:** tentar entregar os 9 mini-apps de uma vez
- **Mitigacao:** liberar por fases, com foundation + 4 quick wins primeiro

### Risco 2 - Conflito entre requisito global e criterios individuais

- **Risco:** implementacao inconsistente entre apps
- **Mitigacao:** padronizar login + historico em banco como regra de produto para o site

### Risco 3 - Regressao visual

- **Risco:** misturar visual atual do site com design-system-v2 sem camada de isolamento
- **Mitigacao:** encapsular a identidade visual no dominio `Sextou Tools`

### Risco 4 - Modelagem insuficiente para fases 2 e 3

- **Risco:** criar schema simplista que nao suporta quote, invoice, lead e projeto
- **Mitigacao:** desenhar a camada de historico generica na fundacao e modelos especificos por dominio nas fases posteriores

---

## File List Inicial Esperada

- [ ] `app/sextou-tools/page.tsx`
- [ ] `app/sextou-tools/[slug]/page.tsx`
- [ ] `components/sextou-tools/*`
- [ ] `lib/sextou-tools/*`
- [ ] `types/sextou-tools.ts`
- [ ] `prisma/schema.prisma`
- [ ] `app/page.tsx`
- [ ] `app/dashboard/page.tsx`
- [ ] `components/layout/mobile-menu.tsx`

---

## Sequencia Recomendada de Implementacao

1. Fundacao de rotas, auth e schema
2. Hub `Brazilian Business Toolkit`
3. Shell compartilhado de mini-app
4. QR Code
5. Calculadora de Preco
6. Calculadora de ROI
7. Checklist de Abertura
8. Validacao UX mobile e persistencia
9. Orcamentos, leads e invoices
10. Projetos e diretorio

---

## Resumo Executivo das 4 Fases

### Fase 1

Base tecnica da suite: navegacao, auth, banco, catalogo e layout compartilhado.

### Fase 2

Entrega publica da experiencia principal: hub `Brazilian Business Toolkit` + 4 mini-apps iniciais.

### Fase 3

Ferramentas com maior dependencia de documentos, historico operacional e fluxo comercial.

### Fase 4

Ferramentas de operacao continua e construcao de comunidade.

---

## Criterios de Aceite do Documento

- [x] O plano referencia o estado real do codigo
- [x] O plano traduz os requisitos do `SextouTools.md` em backlog executavel
- [x] O plano explicita conflitos de requisito antes da implementacao
- [x] O plano incorpora os tokens principais do `design-system-v2`
- [x] O plano define uma ordem de entrega pragmatica

---

_Last Updated: 2026-06-15 | AIOX Brownfield Story Draft_
