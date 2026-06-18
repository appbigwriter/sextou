# Launch Studio PRO — Stories Breakdown

> **Autor:** Bob (Strategist / PM — Morgan)
> **Data:** 2026-06-18
> **Fonte:** `prd/LaunchStudioPRO/` (PRD.md, software-premium-params.md, design-system-v2.html, Fluxo, Prompt, Tabelas SQL, Output JSON, planilhas de apoio)
> **Princípio aplicado:** Article IV — No Invention. Toda story rastreia a um item explícito do PRD/params/design system. Onde houver `[AUTO-DECISION]`, está documentado o raciocínio.
> **Contexto:** Brownfield. O repositório já possui infraestrutura premium reusável (ver seção "Reuso vs. Criação").

---

## 1. Visão geral do produto

**Launch Studio PRO** é um mini-app **Premium** da Suite Sextou.biz que funciona como uma **fábrica de Fórmulas de Lançamento** baseada na *Product Launch Formula™* (PLF) de Jeff Walker.

| Dimensão | Resumo |
|---|---|
| **Promessa** | Em <20 min de entrevista guiada, o usuário recebe um **Dossiê de Lançamento** completo e fiel à PLF (Pré-Pré → PLC 1/2/3 → Abertura → Fechamento). |
| **Artefato principal** | Dossiê de Lançamento (PDF + Markdown + JSON + DOCX), pack de e-mails, scripts de vídeo PLC, página de vendas, calendário ICS, mapa de estímulos, checklist. |
| **Usuário-alvo** | Empreendedores/infoprodutores/coaches/consultores que usam PLF. |
| **Gate** | Exclusivo `users.is_premium = TRUE`; middleware `premiumGate` em todas as rotas; auditoria em `premium_access_logs`. |
| **Multiusuário** | Sim, com RLS por usuário e múltiplos projetos (Starter 3 / Pro 25 / Agency ilimitado). |
| **Orquestração** | Multi-LLM por fase (Anthropic, OpenAI, Google, Perplexity), routing `quality_first`, fallback `same_modality_lower_cost`. |
| **UX** | Mobile-first, Design System v2 (Bricolage Grotesque + Inter + JetBrains Mono), tema escuro com gradiente de marca. |

### Reuso vs. Criação (brownfield — Article IV-A: REUSE > ADAPT > CREATE)

Infraestrutura **já existente** no repositório que as stories devem reusar/adaptar:

| Ativo existente | Caminho | Estratégia |
|---|---|---|
| `User.isPremium` + Stripe (checkout/verify/webhook) | `prisma/schema.prisma`, `app/api/stripe/*`, `lib/stripe.ts` | **REUSE** para o gate e planos |
| Auth (`resolveToolkitUser`) | `lib/sextou-tools/auth.ts` | **REUSE** |
| Suite header + página de acesso premium | `components/sextou-tools-pro/suite-header.tsx`, `app/sextou-tools-pro/acesso/page.tsx` | **REUSE/ADAPT** |
| Padrão de geração / histórico / usage / prompts / schemas | `lib/sextou-tools-pro/*` | **ADAPT** (hoje single-shot OpenAI; LS PRO exige multi-fase multi-provider) |
| Roteamento `[slug]` e dashboard da suite | `app/sextou-tools-pro/*` | **ADAPT** (LS PRO é app dedicado, não single-page tool) |
| Models de usage/generation | `SextouToolsProGeneration`, `...UsageEvent` | **ADAPT** — LS PRO precisa de tabelas próprias (`launch_*`) por ser multi-entidade |

> **Atenção de escopo:** os mini-apps existentes são *single-shot* (1 input → 1 output OpenAI). Launch Studio PRO é *multi-step + multi-phase + multi-provider* com versionamento de dossiê. Por isso a maioria das tabelas e do orquestrador é **CREATE** (justificado: capacidade nova), reusando apenas auth, gate, storage e padrões de UI.

---

## 2. Épicos (visão macro)

| # | Épico | Objetivo | Stories | Peso relativo |
|---|---|---|---|---|
| **E1** | Fundação, Gate Premium & Dados | Schema `launch_*`, gate `is_premium`, RLS, planos/limites, auditoria | 6 | M-L |
| **E2** | Workspace & Projetos | Dashboard "Meus Lançamentos", CRUD de projetos, briefing inicial | 4 | M |
| **E3** | Entrevista Guiada Multi-Step | 10 etapas com coach tips, persistência, revisão pré-geração | 5 | L |
| **E4** | Orquestrador Multi-LLM Premium | Roteamento por fase, fallback, cost tracker, safety, logging | 5 | XL |
| **E5** | Agentes Operacionais & Geração do Dossiê | 10 agentes PLF, schema JSON, fidelity reviewer, versionamento | 7 | XL |
| **E6** | Preview, Exportação & Pós-resultado | Preview por abas, PDF/ZIP/MD/DOCX/ICS, regeneração por fase, ações | 6 | L |
| **E7** | Custo, Limites & Compliance | Estimativa/registro de custo, limites por plano, avisos, rate limit, alertas | 4 | M |
| **E8** | Qualidade, Observabilidade & Aceite | Sentry, testes, lint/typecheck, validação dos critérios de aceite | 3 | M |

**Total: 8 épicos, 40 stories.**

---

## 3. Stories por épico

> Legenda complexidade: **S** (≤0,5d) · **M** (~1-2d) · **L** (~3-4d) · **XL** (~5d+ / quebrar se necessário).
> Critérios de aceite abaixo são de **alto nível** (detalhamento fica para o `@sm` na criação das stories).

### Épico E1 — Fundação, Gate Premium & Dados

| ID | Título | Descrição | Critérios de aceite (alto nível) | Compl. | Depende |
|---|---|---|---|---|---|
| **1.1** | Migração schema `launch_*` | Criar tabelas `launch_projects`, `launch_interview_answers`, `launch_dossiers`, `launch_phases`, `launch_triggers_map` (PRD §8.2, Tabelas SQL). | Migration aplicável; tipos/índices conforme PRD §8.4; soft delete em projects. | M | — |
| **1.2** | Tabela e middleware do Gate Premium | `premium_access_logs` + middleware `premiumGate` em todas as rotas do app (PRD §0, §11.1). | Não-premium → redirect `/upgrade?app=launch-studio-pro`; tentativas logadas (granted true/false, ip, ua). | M | 1.1 |
| **1.3** | RLS por usuário | Políticas RLS em `launch_projects`, `launch_interview_answers`, `launch_dossiers` + função `require_premium()` (PRD §8.3). | Usuário só acessa seus projetos; gate via função SQL; testes de isolamento. | M | 1.1 |
| **1.4** | Planos premium & limites | Campos `premium_plan_slug/since/expires_at` em users + `user_premium_limits` (params §11.10). Starter/Pro/Agency (PRD §1, §10). | Limites por plano persistidos; índice `(user_id,is_premium)`. | M | 1.1 |
| **1.5** | Tela de upgrade para não-premium | Página `/upgrade` + fallback UI "Recurso Premium" com CTA (PRD §0, §12 UX). | Mensagem clara; CTA leva ao checkout Stripe existente; mobile-first DS v2. | M | 1.2 |
| **1.6** | Registro do app no manifest da suite | Inserir `launch-studio-pro` em `mini_apps` + app manifest (PRD §13). | App ativo, `requires_premium=true`, artifact_types listados. | S | 1.1 |

### Épico E2 — Workspace & Projetos

| ID | Título | Descrição | Critérios de aceite | Compl. | Depende |
|---|---|---|---|---|---|
| **2.1** | Dashboard "Meus Lançamentos" | Lista de projetos do usuário + CTA "+ Novo Lançamento" (PRD §3.3, Fluxo). | Lista por status; estados vazio/loading; mobile-first DS v2. | M | 1.1, 1.3 |
| **2.2** | CRUD de projetos | Criar, duplicar, arquivar, soft-delete + hard-delete em 30 dias (PRD §2 ações, §11.2). | Status lifecycle (draft→...→archived); duplicar projeto; soft delete. | M | 2.1 |
| **2.3** | Briefing inicial (3 campos) | Tela 1: Nome · Público · Ideia (mín. 80 chars) (PRD §4.1). | Validação dos 3 campos; persiste em `launch_projects`; avança p/ entrevista. | S | 2.2 |
| **2.4** | Multi-projeto por plano | Aplicar limite de projetos do plano (3/25/∞) sem apagar existentes (PRD §10). | Bloqueio com modal de upgrade ao exceder; respeita plano. | M | 2.2, 1.4 |

### Épico E3 — Entrevista Guiada Multi-Step

| ID | Título | Descrição | Critérios de aceite | Compl. | Depende |
|---|---|---|---|---|---|
| **3.1** | Engine de entrevista multi-step | Componente de wizard de 10 etapas com navegação/progresso (PRD §4.2, §3.5). | 10 etapas configuráveis; salvar/retomar; barra de progresso; mobile-first. | L | 2.3 |
| **3.2** | Definição das 10 etapas PLF | Configurar campos das etapas 1-10 (Avatar, Transformação, Oferta, Tipo, Pré-Pré, PLC1/2/3, Escassez, Estímulos) (PRD §4.2). | Todos os campos do PRD presentes; dropdowns/multi-select onde aplicável. | L | 3.1 |
| **3.3** | Coach tips por etapa | Exibir e persistir coach tip mostrado (`coach_tip_shown`) (PRD §4.2, §6 interview_agent). | Tip contextual por etapa; persistido em `launch_interview_answers`. | M | 3.2 |
| **3.4** | Persistência de respostas | Salvar `answers` (jsonb) por etapa com retomada (PRD §8.2). | Auto-save por etapa; reabrir entrevista do ponto onde parou. | M | 3.2 |
| **3.5** | Revisão do briefing antes de gerar | Tela de revisão consolidada das respostas antes da geração (PRD §3.6, Fluxo). | Resumo editável; confirmação explícita antes de disparar geração. | M | 3.4 |

### Épico E4 — Orquestrador Multi-LLM Premium

| ID | Título | Descrição | Critérios de aceite | Compl. | Depende |
|---|---|---|---|---|---|
| **4.1** | Tabelas de orquestração premium | `premium_model_providers`, `premium_model_configs`, `premium_app_runs`, `premium_llm_calls`, `premium_tool_calls` (params §11). | Migrations aplicadas; configs por fase/role. | L | 1.1 |
| **4.2** | Roteador de modelos por fase | Mapear cada fase ao provedor/modelo (PRD §5) com `routing_profile=quality_first`. | Seleção por capacidade, não por nome (params §7.4); config por ambiente. | L | 4.1 |
| **4.3** | Fallback automático | Estratégia `same_modality_lower_cost` com tentativas registradas (PRD §5, params §7.5). | Cadeia de fallback por fase; toda tentativa em `premium_llm_calls`. | M | 4.2 |
| **4.4** | Cost tracker por execução | Registrar tokens, custo estimado/real, latência por chamada (params §6, §11.5; PRD §10). | `premium_app_runs` e `premium_llm_calls` populados; estimativa antes de rodar. | M | 4.1 |
| **4.5** | Safety checks & sanitização de logs | PII detection, sem API key em logs/prompts/artefatos (PRD §11.5, params §12). | Logs sanitizados; keys só no servidor; secrets por ambiente. | M | 4.2 |

### Épico E5 — Agentes Operacionais & Geração do Dossiê

| ID | Título | Descrição | Critérios de aceite | Compl. | Depende |
|---|---|---|---|---|---|
| **5.1** | System prompt base & contratos | System prompt PLF + prompt contracts por agente (PRD §9.1, Prompt.txt; params §10). | Regras inegociáveis PLF aplicadas; contratos separados por etapa. | M | 4.2 |
| **5.2** | Schema JSON do dossiê & validação | Validar saída contra schema (PRD §9.2, Output JSON). | Saída sempre JSON validável; rejeição/retry em saída inválida. | M | 5.1 |
| **5.3** | Agentes de avatar & oferta | `avatar_agent`, `offer_architect` (PRD §6). | JSON de avatar e estrutura de oferta+bônus conforme schema. | M | 5.2 |
| **5.4** | Sequence planner (PLC 1/2/3 + pré-pré + abertura/fechamento) | `sequence_planner` gera cronograma + roteiros (PRD §6, §9.2 sequence). | Pré-Pré → PLC1/2/3 → cart_open → cart_close com scripts. | L | 5.2 |
| **5.5** | Trigger mapper & scarcity designer | `trigger_mapper` (estímulos por fase) + `scarcity_designer` (escassez real) (PRD §6, §4.2 et.9-10). | `launch_triggers_map` populado; escassez com consequência negativa. | M | 5.4 |
| **5.6** | Copywriter & joint-launch advisor | `copywriter_agent` (e-mails, scripts, página) + `jl_partner_advisor` (PRD §6, §2). | Pack de copy + lista de parceiros/script/comissão quando aplicável. | L | 5.4 |
| **5.7** | Fidelity reviewer & persistência do dossiê | `fidelity_reviewer` calcula `fidelity_score` + grava `launch_dossiers`/`launch_phases` versionados (PRD §6, §8.2). | Checklist de fidelidade; versão incrementada; momento de celebração na entrega (PRD §12 UX). | L | 5.3, 5.5, 5.6 |

### Épico E6 — Preview, Exportação & Pós-resultado

| ID | Título | Descrição | Critérios de aceite | Compl. | Depende |
|---|---|---|---|---|---|
| **6.1** | Preview por abas | Abas Avatar · Oferta · Sequência · Copy · Cronograma · Estímulos (PRD §3.8). | Render do dossiê por aba; mobile-first; aviso de compliance visível. | L | 5.7 |
| **6.2** | Storage de artefatos | `generated_artifacts` + `artifact_versions` + R2/Supabase Storage (params §11.7-8, §13.2; PRD §7). | Caminho previsível (params §13.2); metadados salvos. | M | 5.7 |
| **6.3** | Exportação PDF/DOCX/MD | Gerar PDF profissional (DocRaptor/PDFShift, fallback Puppeteer) + DOCX + Markdown (PRD §2, §7). | Preview antes do download; arquivos no storage. | L | 6.2 |
| **6.4** | Pack de e-mails, scripts e página (ZIP) | Empacotar e-mails (MD/HTML), scripts PLC, página de vendas, checklist em ZIP (PRD §2). | ZIP completo com todos os assets do dossiê. | M | 6.2 |
| **6.5** | Calendário ICS/CSV | Exportar cronograma como ICS/CSV (Google Calendar opcional) (PRD §2, §7). | ICS válido importável; CSV; fallback sem Google API. | M | 6.2 |
| **6.6** | Regeneração por fase & ações pós-resultado | Regenerar fase específica, duplicar, favoritar, copiar, baixar (PRD §2 ações, §3.10). | Regeneração isolada por fase; ações funcionais; respeita limite de regenerações. | M | 6.1, 7.x |

### Épico E7 — Custo, Limites & Compliance

| ID | Título | Descrição | Critérios de aceite | Compl. | Depende |
|---|---|---|---|---|---|
| **7.1** | Estimativa & registro de custo | `premium_cost_ledger`; estimar antes, registrar real (PRD §10, params §11.9). | Estimativa exibida antes da geração; ledger populado por execução. | M | 4.4 |
| **7.2** | Limites por plano & bloqueio | Bloquear ao atingir limite do plano com modal de upgrade, sem apagar projetos (PRD §10, §12). | Limites Starter/Pro/Agency; modal de upgrade; projetos preservados. | M | 7.1, 1.4 |
| **7.3** | Rate limit & anti-abuso | 5 gerações simultâneas, 50/dia; CAPTCHA em padrão suspeito (PRD §11.6, §11.1). | Limites aplicados server-side; CAPTCHA acionável. | M | 7.2 |
| **7.4** | Avisos de compliance & revisão humana | Avisos obrigatórios + recomendação de revisão em nichos regulados (PRD §11.3-4). | Avisos visíveis no preview e exportações; sem promessa de faturamento. | S | 6.1 |

### Épico E8 — Qualidade, Observabilidade & Aceite

| ID | Título | Descrição | Critérios de aceite | Compl. | Depende |
|---|---|---|---|---|---|
| **8.1** | Observabilidade (Sentry) | Integrar Sentry (fallback Logtail) p/ erros e traces (PRD §7). | Erros capturados; logs sanitizados; sem PII desnecessária. | S | 4.5 |
| **8.2** | Testes & verificações | Testes unitários/integração das fases críticas + lint/typecheck (PRD §14). | `npm run lint` e typecheck OK; testes do gate, RLS, orquestrador, exportação. | M | todas |
| **8.3** | Validação dos critérios de aceite | Rodar checklist completo do PRD §12 (Produto/UX/LLM/Banco/Segurança/Compat). | Todos os itens do §12 verificados; gate impossível de burlar no client. | M | todas |

---

## 4. Roadmap sugerido (sequência de implementação)

O roadmap segue dependências técnicas e entrega valor incremental verificável.

| Onda | Foco | Stories | Marco / valor entregue |
|---|---|---|---|
| **Onda 0 — Fundação** | DB + Gate + Acesso | 1.1 → 1.2 → 1.3 → 1.6 → 1.4 → 1.5 | App protegido por premium, schema pronto, RLS ativa. |
| **Onda 1 — Workspace** | Projetos + Briefing | 2.1 → 2.2 → 2.3 → 2.4 | Usuário cria/gerencia projetos e inicia briefing. |
| **Onda 2 — Entrevista** | Wizard 10 etapas | 3.1 → 3.2 → 3.3 → 3.4 → 3.5 | Entrevista guiada completa, persistida, revisável. |
| **Onda 3 — Orquestrador** | Multi-LLM core | 4.1 → 4.2 → 4.3 → 4.4 → 4.5 | Infra de geração multi-provider com custo/fallback/safety. |
| **Onda 4 — Geração** | Agentes + Dossiê | 5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6 → 5.7 | **Dossiê PLF gerado end-to-end** (marco crítico do MVP). |
| **Onda 5 — Entrega** | Preview + Export | 6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6 | Artefatos exportáveis, regeneração por fase. |
| **Onda 6 — Governança** | Custo + Compliance | 7.1 → 7.2 → 7.3 → 7.4 | Limites por plano, anti-abuso, avisos legais. |
| **Onda 7 — Hardening** | Qualidade + Aceite | 8.1 → 8.2 → 8.3 | Observabilidade, testes, aceite formal §12. |

**Caminho crítico para o primeiro dossiê funcional (MVP demonstrável):**
`1.1 → 1.2 → 1.3 → 2.x → 3.1-3.5 → 4.1-4.4 → 5.1-5.7 → 6.1 → 6.3`

> **Nota de paralelização:** após a Onda 0, E2 (Workspace) e E4 (Orquestrador, exceto 4.x que depende só de 1.1) podem avançar em paralelo. E7 (custo) pode iniciar 7.1 assim que 4.4 existir.

---

## 5. Riscos & pontos de atenção técnicos

> Cada recomendação estratégica acompanha avaliação de risco (princípio do PM).

| # | Risco | Severidade | Impacto | Mitigação recomendada |
|---|---|---|---|---|
| **R1** | **Gap arquitetural multi-provider.** A lib `lib/sextou-tools-pro/generation.ts` atual é single-shot OpenAI. LS PRO exige 4+ provedores (Anthropic, OpenAI, Google, Perplexity) por fase. | **Alta** | Pode forçar reescrita do orquestrador se tratado como "adaptar levemente". | Tratar E4 como CREATE justificado (capacidade nova), reusando apenas auth/storage/usage. Validar contratos de provider em spike antes da Onda 3. |
| **R2** | **Custo de APIs pagas em geração multi-fase.** ~$0.68/projeto com 7 agentes + Perplexity + PDF. Abuso ou loop de regeneração eleva custo rápido. | **Alta** | Estouro de orçamento, alerta de custo. | Implementar 7.1/7.4 (cost ledger + estimativa) cedo; alertas admin (>$50/dia, >$20/usuário/mês); rate limit (7.3) antes de liberar produção. |
| **R3** | **Conflito entre dois conceitos de "gate premium".** O PRD usa `is_premium`; a página `acesso` existente usa "anúncios ativos". | **Média** | Lógica de acesso divergente entre apps da suite. | `[AUTO-DECISION]` Seguir o PRD (`is_premium = TRUE`) como fonte de verdade para LS PRO. Razão: PRD §0 é explícito e inegociável (§16). Alinhar com PO se a suite exigir unificação. |
| **R4** | **PDF profissional depende de API paga (DocRaptor/PDFShift).** Risco de qualidade/custo médio. | **Média** | Artefato principal (dossiê PDF) pode ficar fraco com fallback. | Story 6.3 deve validar fallback Puppeteer self-hosted; preview HTML antes do PDF reduz retrabalho. |
| **R5** | **Fidelidade à PLF é critério de aceite subjetivo.** `fidelity_score` e `fidelity_reviewer` precisam de definição clara de "fiel". | **Média** | Critério de aceite §12 difícil de verificar objetivamente. | Story 5.7 deve materializar o `fidelity_checklist` do schema (Output JSON) como itens binários verificáveis. |
| **R6** | **RLS + middleware: dupla camada de segurança.** Gate no client é insuficiente (PRD §16: "impossível de burlar no client"). | **Alta** | Vazamento de dados entre usuários / acesso indevido. | RLS (1.3) + middleware server-side (1.2) obrigatórios; story 8.3 testa explicitamente o bypass no client. |
| **R7** | **Volume de stories XL (E4, E5).** Risco de stories grandes demais para um ciclo. | **Média** | Atraso, dificuldade de QA. | Na criação pelo `@sm`, considerar dividir 5.4, 5.6, 5.7 e 4.2 se passarem de ~1 ciclo. Marcadas como L/XL aqui. |
| **R8** | **Schema duplicado vs. tabelas premium genéricas.** PRD define `launch_*`; params define `premium_*`. Há sobreposição (runs, cost). | **Média** | Modelagem redundante. | `[AUTO-DECISION]` Usar `launch_*` para domínio PLF e `premium_*` para telemetria/custo transversal da suite. Razão: separa domínio de negócio (versionável) de infraestrutura (reutilizável entre apps). |
| **R9** | **Multilíngue (pt-BR/en-US/es-ES).** PRD §13 prevê 3 idiomas; não há story dedicada. | **Baixa** | Escopo oculto. | `[AUTO-DECISION]` MVP em pt-BR (idioma padrão §5). i18n tratado como enhancement pós-MVP — não invento story sem demanda explícita (Article IV). Sinalizado ao PO. |

### Decisões automáticas registradas

- `[AUTO-DECISION]` **Fonte de verdade do gate** → `users.is_premium` conforme PRD §0 (reason: PRD é inegociável; página "acesso" por anúncios é de outro app da suite).
- `[AUTO-DECISION]` **Separação de schema** → `launch_*` (domínio) + `premium_*` (telemetria) (reason: evita redundância e maximiza reuso entre apps premium).
- `[AUTO-DECISION]` **Escopo de idioma no MVP** → apenas pt-BR (reason: idioma padrão §5; i18n não está nos critérios de aceite §12; evitar invenção de escopo).
- `[AUTO-DECISION]` **40 stories / 8 épicos** → granularidade que mantém a maioria das stories em S/M, isolando os pontos XL para o `@sm` quebrar (reason: stories menores = QA mais previsível).

---

## 6. Próximos passos

1. **Deliberar este breakdown** (ajustar épicos/sequência conforme prioridade de negócio).
2. **Resolver R3** (conceito de gate) com o PO antes da Onda 0.
3. **Spike de orquestrador multi-provider** (R1) antes de iniciar a Onda 3.
4. Aprovado o breakdown → handoff para `@sm` criar as stories individuais (`{epic}.{story}.story.md`) na ordem do roadmap.

> Os arquivos de story individuais **ainda não foram criados** — aguardando deliberação, conforme solicitado.
