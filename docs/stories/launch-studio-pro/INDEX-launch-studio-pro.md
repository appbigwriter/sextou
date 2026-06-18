# Launch Studio PRO — Índice de Stories

> **Produto:** Launch Studio PRO (Suite Sextou.biz Premium Apps)
> **Fonte:** `prd/LaunchStudioPRO/` (PRD.md, STORIES-BREAKDOWN.md, software-premium-params.md)
> **Gerado por:** River (@sm) · 2026-06-18
> **Total:** 41 stories · 8 épicos · 8 ondas

---

## Decisao de Negocio — Gate de Acesso R3 (PO, 2026-06-18)

**Opcao C adotada — Gate em camadas com OR centralizado:**

- Acesso PRO = `is_premium OR hasActiveAds`, sempre via o helper central `resolveSextouToolsProUser` em `lib/sextou-tools/auth.ts` (NUNCA checar um flag isolado).
- `is_premium = TRUE` = assinatura premium paga (planos Starter/Pro/Agency do PRD §10).
- `hasActiveAds = TRUE` = acesso de cortesia para anunciante ativo.
- O PRD §0 ("exclusivo is_premium = TRUE") e reinterpretado como "premium da acesso", NAO "apenas premium da acesso".
- O helper central ja implementa essa logica OR (linha ~111 de `lib/sextou-tools/auth.ts`).
- Story **1.7** criada como pre-requisito para ativar o caminho `is_premium` de ponta a ponta (Stripe checkout de assinatura → webhook → `is_premium=true`).

---

## Roadmap por Onda

| Onda | Foco | Marco |
|------|------|-------|
| **Onda 0** | DB + Gate + Acesso | App protegido, schema pronto, RLS ativa |
| **Onda 1** | Workspace + Projetos | Usuário cria e gerencia projetos |
| **Onda 2** | Entrevista Guiada | Wizard de 10 etapas completo |
| **Onda 3** | Orquestrador Multi-LLM | Infra multi-provider com custo/fallback/safety |
| **Onda 4** | Agentes + Dossiê | **Dossiê PLF gerado end-to-end (MVP crítico)** |
| **Onda 5** | Preview + Export | Artefatos exportáveis, regeneração por fase |
| **Onda 6** | Governança | Limites por plano, anti-abuso, avisos legais |
| **Onda 7** | Hardening | Observabilidade, testes, aceite formal |

---

## Épico E1 — Fundação, Gate Premium & Dados (Onda 0)

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [1.1](./1.1.story.md) | Migração Schema `launch_*` | Draft | @data-engineer | — | M |
| [1.2](./1.2.story.md) | Tabela e Middleware do Gate Premium | Draft | @dev | 1.1 | M |
| [1.3](./1.3.story.md) | RLS por Usuário | Draft | @data-engineer | 1.1 | M |
| [1.6](./1.6.story.md) | Registro do App no Manifest da Suite | Draft | @dev | 1.1 | S |
| [1.4](./1.4.story.md) | Planos Premium e Limites | Draft | @data-engineer | 1.1 | M |
| [1.5](./1.5.story.md) | Tela de Upgrade para Não-Premium | Draft | @dev | 1.2 | M |
| [1.7](./1.7.story.md) | Integração Stripe — Ativação de Assinatura Premium | Draft | @dev | 1.4, 1.2 | M |

> Ordem de implementação: 1.1 → 1.2 → 1.3 → 1.6 → 1.4 → 1.5 → 1.7
>
> **Nota:** 1.7 é pré-requisito para que o acesso via assinatura premium funcione de ponta a ponta. Sem ela, `is_premium` permanece órfão. O acesso via `hasActiveAds` já funciona independentemente (aprovação de anúncio existente).

---

## Épico E2 — Workspace & Projetos (Onda 1)

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [2.1](./2.1.story.md) | Dashboard "Meus Lançamentos" | Draft | @dev | 1.1, 1.3 | M |
| [2.2](./2.2.story.md) | CRUD de Projetos | Draft | @dev | 2.1 | M |
| [2.3](./2.3.story.md) | Briefing Inicial (3 Campos) | Draft | @dev | 2.2 | S |
| [2.4](./2.4.story.md) | Multi-Projeto por Plano | Draft | @dev | 2.2, 1.4 | M |

---

## Épico E3 — Entrevista Guiada Multi-Step (Onda 2)

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [3.1](./3.1.story.md) | Engine de Entrevista Multi-Step | Draft | @dev | 2.3 | L |
| [3.2](./3.2.story.md) | Definição das 10 Etapas PLF | Draft | @dev | 3.1 | L |
| [3.3](./3.3.story.md) | Coach Tips por Etapa | Draft | @dev | 3.2, 3.4 | M |
| [3.4](./3.4.story.md) | Persistência de Respostas | Draft | @dev | 3.2 | M |
| [3.5](./3.5.story.md) | Revisão do Briefing Antes de Gerar | Draft | @dev | 3.4 | M |

---

## Épico E4 — Orquestrador Multi-LLM Premium (Onda 3)

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [4.1](./4.1.story.md) | Tabelas de Orquestração Premium | Draft | @data-engineer | 1.1 | L |
| [4.2](./4.2.story.md) | Roteador de Modelos por Fase | Draft | @dev | 4.1 | L |
| [4.3](./4.3.story.md) | Fallback Automático | Draft | @dev | 4.2 | M |
| [4.4](./4.4.story.md) | Cost Tracker por Execução | Draft | @dev | 4.1, 4.2 | M |
| [4.5](./4.5.story.md) | Safety Checks e Sanitização de Logs | Draft | @dev | 4.2 | M |

> Nota: 4.1 pode iniciar em paralelo com E2 (depende apenas de 1.1).

---

## Épico E5 — Agentes Operacionais & Geração do Dossiê (Onda 4) ⭐ MARCO CRÍTICO

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [5.1](./5.1.story.md) | System Prompt Base e Contratos | Draft | @dev | 4.2 | M |
| [5.2](./5.2.story.md) | Schema JSON do Dossiê e Validação | Draft | @dev | 5.1 | M |
| [5.3](./5.3.story.md) | Agentes de Avatar e Oferta | Draft | @dev | 5.2 | M |
| [5.4](./5.4.story.md) | Sequence Planner (PLC 1/2/3 + Pré-Pré) | Draft | @dev | 5.2 | L |
| [5.5](./5.5.story.md) | Trigger Mapper e Scarcity Designer | Draft | @dev | 5.4 | M |
| [5.6](./5.6.story.md) | Copywriter e Joint-Launch Advisor | Draft | @dev | 5.4 | L |
| [5.7](./5.7.story.md) | Fidelity Reviewer e Persistência do Dossiê | Draft | @dev | 5.3, 5.5, 5.6 | L |

> 5.3 e 5.4 podem rodar em paralelo (ambos dependem de 5.2).

---

## Épico E6 — Preview, Exportação & Pós-resultado (Onda 5)

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [6.1](./6.1.story.md) | Preview por Abas | Draft | @dev | 5.7 | L |
| [6.2](./6.2.story.md) | Storage de Artefatos | Draft | @dev | 5.7 | M |
| [6.3](./6.3.story.md) | Exportação PDF/DOCX/MD | Draft | @dev | 6.2 | L |
| [6.4](./6.4.story.md) | Pack de E-mails, Scripts e Página (ZIP) | Draft | @dev | 6.2 | M |
| [6.5](./6.5.story.md) | Calendário ICS/CSV | Draft | @dev | 6.2 | M |
| [6.6](./6.6.story.md) | Regeneração por Fase e Ações Pós-Resultado | Draft | @dev | 6.1, 7.x | M |

> 6.1 e 6.2 podem iniciar em paralelo. 6.3, 6.4, 6.5 dependem de 6.2.

---

## Épico E7 — Custo, Limites & Compliance (Onda 6)

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [7.1](./7.1.story.md) | Estimativa e Registro de Custo | Draft | @dev | 4.4 | M |
| [7.2](./7.2.story.md) | Limites por Plano e Bloqueio | Draft | @dev | 7.1, 1.4 | M |
| [7.3](./7.3.story.md) | Rate Limit e Anti-Abuso | Draft | @dev | 7.2 | M |
| [7.4](./7.4.story.md) | Avisos de Compliance e Revisão Humana | Draft | @dev | 6.1 | S |

> 7.1 pode iniciar assim que 4.4 existir (paralelizável com Onda 5).

---

## Épico E8 — Qualidade, Observabilidade & Aceite (Onda 7)

| Story | Título | Status | Executor | Dependências | Complexidade |
|-------|--------|--------|----------|-------------|-------------|
| [8.1](./8.1.story.md) | Observabilidade (Sentry) | Draft | @dev | 4.5 | S |
| [8.2](./8.2.story.md) | Testes e Verificações | Draft | @dev | todas | M |
| [8.3](./8.3.story.md) | Validação dos Critérios de Aceite | Draft | @qa | todas | M |

---

## Caminho Crítico (MVP demonstrável)

```
1.1 → 1.2 → 1.3 → 2.x → 3.1-3.5 → 4.1-4.4 → 5.1-5.7 → 6.1 → 6.3
```

**Gate funcional de ponta a ponta (via assinatura):**
```
1.1 → 1.4 → 1.7 → (is_premium setado) → 1.2 gate libera acesso
```

---

## Riscos e Decisões

| # | Risco | Sinalizado em | Decisão |
|---|-------|--------------|---------|
| R1 | Gap arquitetural multi-provider | 4.2 | CREATE justificado (capacidade nova) |
| R2 | Custo de APIs pagas | 4.4, 7.1 | Cost ledger + alertas admin |
| R3 | Conflito de gate premium | 1.2, 1.5, 1.7 | **Opcao C (2026-06-18): `is_premium OR hasActiveAds` via `resolveSextouToolsProUser`** |
| R4 | PDF via API paga | 6.3 | Fallback Puppeteer obrigatório |
| R5 | Fidelidade PLF subjetiva | 5.7 | Checklist binário programático |
| R6 | Gate no client insuficiente | 8.3 | Teste de bypass explícito |
| R7 | Stories XL | 5.4, 5.6, 5.7, 4.2 | Quebrável se passar de 1 ciclo |
| R8 | Schema duplicado | 4.1 | `launch_*` (domínio) + `premium_*` (telemetria) |
| R9 | Multilíngue | — | MVP em pt-BR; i18n pós-MVP |
| R10 | `is_premium` orfao | 1.7 | Story 1.7 criada para corrigir: Stripe assinatura → webhook → `is_premium=true` |

---

## Dívida Técnica Pré-existente (fora do escopo LS PRO)

> **Item:** Corrigir StoryBrand Strategy Generator para usar o gate central `resolveSextouToolsProUser`
> **Descricao:** O StoryBrand Strategy Generator verifica apenas `isPremium` isoladamente, sem passar pelo helper central `resolveSextouToolsProUser` de `lib/sextou-tools/auth.ts`. Como `is_premium` esta atualmente orfao (nenhuma rota o seta), o app esta inacessivel para todos os usuarios, incluindo anunciantes ativos que deveriam ter acesso. Corrigir apos concluir Onda 0 do LS PRO.
> **Executores sugeridos:** @dev
> **Referencia:** Decisao R3-C (2026-06-18)

---

## Estatísticas

| Épico | Stories | Status | Ondas |
|-------|---------|--------|-------|
| E1 Fundação | 7 | Draft | 0 |
| E2 Workspace | 4 | Draft | 1 |
| E3 Entrevista | 5 | Draft | 2 |
| E4 Orquestrador | 5 | Draft | 3 |
| E5 Agentes | 7 | Draft | 4 |
| E6 Preview/Export | 6 | Draft | 5 |
| E7 Limites | 4 | Draft | 6 |
| E8 Qualidade | 3 | Draft | 7 |
| **Total** | **41** | **Draft** | **8 ondas** |
