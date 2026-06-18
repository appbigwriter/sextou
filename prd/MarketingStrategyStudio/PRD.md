# Mini-App Premium PRD: Clareza — Gerador de Estratégia de Marketing (StoryBrand SB7)

> **Comando mental aplicado (software-premium-params §18):** este app gera um artefato real (uma estratégia de marca completa e exportável), pertence à suite Premium, exige login, usa o Design System v2, é mobile-first, tem histórico e versionamento, usa roteamento multi-LLM por etapa, estima custo por execução e protege as chaves no servidor.

---

## 0. Fundamento metodológico — o modelo SB7 (fidelidade ao livro)

O motor do produto é o framework **StoryBrand 7 (SB7)** de Donald Miller. A premissa: o marketing funciona como um roteiro de cinema. **O cliente é o herói, a marca é o guia.** Quando a comunicação confunde, a marca perde a venda — por isso o método existe para produzir **clareza**.

O app é fiel aos 7 elementos e aos seus subníveis. Toda geração precisa preencher, sem exceção, a estrutura abaixo (o "BrandScript"):

| # | Elemento | O que o app precisa definir | Subníveis obrigatórios |
| --- | --- | --- | --- |
| 1 | **O Personagem (Herói)** | Quem é o cliente e **o único desejo** relevante que o produto atende. | Desejo único e específico. Regra de ouro: a marca **nunca** é o herói. |
| 2 | **O Problema** | Os obstáculos do herói, nas três camadas do livro, e o "vilão" que os personifica. | **Externo** (o que quebrou / o problema tangível), **Interno** (como o cliente se sente), **Filosófico** (por que isso é injusto / "não deveria ser assim"). Vilão opcional, mas recomendado. |
| 3 | **O Guia** | Como a marca se posiciona como guia que já superou o problema. | **Empatia** (demonstra que entende a dor) + **Autoridade** (demonstra competência: provas, números, depoimentos, logos). |
| 4 | **O Plano** | Como remover o risco da compra com um caminho simples. | **Plano de processo** (3 passos do que fazer) + **Plano de acordo** (promessas que derrubam objeções e medos). |
| 5 | **Chamada para Ação** | Pedir a ação sem timidez. | **CTA direta** ("Comprar agora", "Agendar") + **CTA transicional** (oferta de baixo risco: PDF, diagnóstico, amostra) para nutrir quem ainda não decidiu. |
| 6 | **Aversão ao Fracasso (As Apostas)** | O que o cliente **perde** se não agir — o custo da inação. | Lista de consequências negativas. Usar com parcimônia (nem medo demais, nem ausência total de apostas). |
| 7 | **O Sucesso** | Como a vida do cliente melhora depois da solução. | Transformação concreta + transformação de identidade (de quem ele era → quem ele se torna). |

**Artefatos derivados do BrandScript (também fiéis à obra de Miller / "Marketing Made Simple"):**

1. **BrandScript completo** — os 7 elementos preenchidos.
2. **One-liner** — frase única no formato **Problema → Solução → Resultado**.
3. **Wireframe de site StoryBrand** — seções na ordem canônica: Header (oferta + CTA), As apostas, Proposta de valor, O guia, O plano, Parágrafo explicativo, CTA repetida, Gerador de leads (transicional) e Rodapé/"junk drawer".
4. **Gerador de leads** — conceito de isca digital (PDF/checklist/diagnóstico) coerente com a CTA transicional.
5. **Sequência de e-mails de nutrição** + **sequência de e-mails de vendas**.

> **Regra de fidelidade:** o app pode adaptar tom, idioma e nicho, mas **não** pode quebrar a estrutura SB7, inverter herói/guia, ou omitir qualquer um dos 7 elementos. O `reviewer_agent` reprova qualquer saída que viole isso.

---

## 1. Visão geral

- **Suite:** SextouTools Premium
- **Nome:** Clareza — Gerador de Estratégia de Marketing (SB7)
- **Slug:** `storybrand-strategy-generator`
- **Categoria:** Marketing
- **Usuário-alvo:** empreendedores, donos de pequenos negócios, profissionais de marketing e prestadores de serviço que precisam de uma mensagem clara e de materiais de marketing prontos — sem dominar copywriting.
- **Promessa:** transformar uma ideia confusa de negócio em uma estratégia de marca clara e pronta para usar, em minutos, aplicando o método StoryBrand SB7.
- **Dor principal:** "minha comunicação confunde e eu perco vendas; não sei o que dizer no meu site, nos meus anúncios e nos meus e-mails."
- **Artefato principal:** **Estratégia de Marca SB7** (BrandScript + one-liner + wireframe de site + isca de leads + sequências de e-mail), exportável.
- **Multiusuário:** sim. Autenticação obrigatória; todo dado é isolado por usuário via RLS.
- **Multiprojeto:** sim. Cada usuário cria e mantém **vários projetos** (uma marca/produto/serviço por projeto), cada um com seu histórico e suas versões de estratégia.
- **Genérico por design:** funciona para qualquer produto ou serviço (físico, digital, B2B, B2C, local ou online). Nenhuma lógica é amarrada a um nicho específico.

---

## 2. Resultado esperado

- **Artefatos gerados:** Estratégia de Marca SB7 contendo:
  - BrandScript (7 elementos + vilão);
  - One-liner;
  - Wireframe de homepage StoryBrand (copy seção a seção);
  - Conceito de isca digital (lead generator);
  - Sequência de e-mails de nutrição (4–6 e-mails);
  - Sequência de e-mails de vendas (3–5 e-mails);
  - Checklist de qualidade + avisos de compliance.
- **Formatos de exportação:** Markdown, PDF, DOCX, HTML (preview navegável). Copiar bloco individual também disponível.
- **Tempo esperado de geração:** entrevista < 3 min de preenchimento; geração da estratégia em 20–60s; export sob demanda.
- **Ações pós-resultado:** copiar, baixar, **regenerar uma seção** isolada, duplicar projeto, criar nova versão, favoritar, transformar em outro formato.

---

## 3. Fluxo mobile-first

Uma decisão por tela, CTA sempre alcançável com o polegar, alvos de toque ≥ 48px (Design System v2).

1. **Entrada** — login → lista de projetos do usuário (estado vazio didático se for o primeiro).
2. **Novo projeto** — formulário básico de 3 campos (ver §4.1).
3. **Análise da IA** — `planner_agent` lê os 3 campos e monta uma entrevista sob medida.
4. **Entrevista guiada (multi-step)** — 7 etapas espelhando o SB7, com sugestões pré-preenchidas e editáveis, dropdowns e coach tips (ver §4.2).
5. **Revisão antes de gerar** — resumo do que foi respondido + seleção de tom, idioma, canais e nível de qualidade.
6. **Geração Premium** — orquestrador roda as fases (`planning → generation → review → post_processing`).
7. **Preview** — estratégia renderizada (BrandScript, one-liner, wireframe, e-mails) com estados amigáveis de loading/erro.
8. **Exportação** — escolher formato; preview antes do download para artefatos visuais.
9. **Histórico e versões** — salvar, reabrir, comparar versões, regenerar seções, duplicar projeto.

---

## 4. Campos do formulário

### 4.1 Formulário básico (input mínimo — pré-entrevista)

Exatamente 3 campos. Baixíssimo atrito.

| Campo | Tipo | Obrigatório | Opções | Observação |
| --- | --- | --- | --- | --- |
| Nome do projeto | texto curto | Sim | — | Identifica a marca/produto. Único por usuário. |
| Público-alvo | texto curto | Sim | — | Quem é o cliente ideal, em uma frase. |
| Ideia do produto/empresa | texto livre | Sim | — | Descrição genérica e solta da ideia, do produto e da empresa. É o insumo que a IA usa para montar a entrevista. |

### 4.2 Entrevista guiada (gerada pela IA, multi-step)

A IA usa os 3 campos para **pré-preencher** sugestões; o usuário apenas confirma ou ajusta. Cada etapa = um elemento do SB7. Dropdowns e presets sempre que possível (princípio Premium §4.2).

| Etapa | Campo | Tipo | Obrigatório | Opções/Presets | Observação |
| --- | --- | --- | --- | --- | --- |
| 1 · Herói | O que seu cliente mais quer? | texto + sugestão IA | Sim | Categoria de desejo (dropdown): ganhar tempo / ganhar dinheiro / status / segurança / pertencimento / saúde / simplicidade | Foco no desejo único. |
| 2 · Problema | Problema externo | texto + sugestão IA | Sim | — | O obstáculo tangível. |
| 2 · Problema | Problema interno | texto + sugestão IA | Sim | Emoção (dropdown): frustração / medo / insegurança / vergonha / sobrecarga | Como o cliente se sente. |
| 2 · Problema | Problema filosófico | texto + sugestão IA | Sim | — | Por que é injusto. |
| 2 · Problema | Vilão | texto + sugestão IA | Não | — | Personifica o problema. |
| 3 · Guia | Provas de autoridade | multi-select + texto | Sim | Tipos (multi-select): depoimentos / nº de clientes / anos de experiência / prêmios / logos de clientes / dados de resultado | Competência. |
| 3 · Guia | Mensagem de empatia | texto + sugestão IA | Sim | — | "Entendemos como é…". |
| 4 · Plano | 3 passos do processo | 3 campos + sugestão IA | Sim | — | Caminho simples. |
| 4 · Plano | Promessas de acordo | multi-select + texto | Não | Presets: satisfação garantida / sem fidelidade / suporte humano / privacidade / sem taxas escondidas | Derruba objeções. |
| 5 · CTA | Oferta direta | texto | Sim | Verbo (dropdown): comprar / agendar / assinar / contratar / começar | "Compre agora". |
| 5 · CTA | Oferta transicional | texto + sugestão IA | Não | Tipo (dropdown): PDF gratuito / checklist / diagnóstico / aula / amostra | Baixo risco. |
| 6 · Apostas | O que o cliente perde se não agir | multi-select + texto | Sim | — | Custo da inação. |
| 7 · Sucesso | Como fica a vida depois | texto + sugestão IA | Sim | — | Transformação concreta + de identidade. |
| Voz | Tom de marca | dropdown | Sim | próximo / premium / divertido / técnico / inspirador / direto | Define a copy. |
| Voz | Idioma | dropdown | Sim | pt-BR / en-US / es | Default pt-BR. |
| Voz | Canais prioritários | multi-select | Não | site / Instagram / e-mail / WhatsApp / anúncios / LinkedIn | Orienta os artefatos. |
| Voz | Nível de qualidade | dropdown | Sim | rápido / equilibrado / máximo | Mapeia para o routing_profile. |

**Regras de UX da entrevista:** sugestão da IA sempre visível e editável; nenhum campo de sistema exposto; coach tip por etapa explicando o "porquê" daquele elemento do SB7; barra de progresso (stepper amigável); é possível voltar sem perder respostas.

---

## 5. Configuração de LLMs

Multi-model por etapa (Premium §7). O usuário escolhe apenas **nível de qualidade**, **tom** e **idioma** — nunca parâmetros técnicos. `routing_profile` derivado: rápido→`speed_first`, equilibrado→`balanced`, máximo→`quality_first`.

| Fase | Papel | Provedor sugerido | Capacidade exigida | Motivo | Fallback |
| --- | --- | --- | --- | --- | --- |
| `planning` | `planner` | Anthropic / OpenAI | raciocínio, long context, JSON schema | Ler os 3 campos e montar a entrevista SB7 + plano do artefato | Provedor alternativo, mesma modalidade texto |
| `generation` | `creator` | Anthropic (escrita) | escrita persuasiva, JSON schema | Redigir BrandScript, one-liner, wireframe e e-mails no tom escolhido | OpenAI / Gemini |
| `review` | `reviewer` | Google Gemini / OpenAI | checagem, JSON schema | Validar fidelidade ao SB7, clareza e risco de promessa exagerada | Mesmo provedor, modelo menor |
| `tool_enrichment` (opcional) | `researcher` | Perplexity / Tavily | web_search, citations | Insight de posicionamento/concorrência (off no MVP) | Pular etapa sem quebrar resultado |
| `post_processing` / `artifact_export` | `exporter` | código determinístico + LLM leve | — | Montar arquivos finais | Geração local sem LLM |

> **Configuração por app** vive em `premium_model_configs` (uma linha por papel). Nada hardcoded; provedores são extensíveis.

---

## 6. Agentes operacionais

Agentes **do produto** (server-side via APIs/filas) — distintos dos agentes de desenvolvimento (Codex/Claude Code/Antigravity), que só constroem o app.

| Agente | Função | Entrada | Saída | Ferramentas/APIs |
| --- | --- | --- | --- | --- |
| `planner_agent` | Cria a entrevista sob medida e o plano do artefato | 3 campos básicos | Lista de perguntas + sugestões pré-preenchidas (JSON) | LLM texto (planner) |
| `brandscript_agent` (creator) | Preenche os 7 elementos e o one-liner | respostas da entrevista | BrandScript JSON | LLM texto (creator) |
| `collateral_agent` | Gera wireframe, isca de leads e sequências de e-mail | BrandScript | Coleção de copy (JSON) | LLM texto (creator) |
| `compliance_agent` | Revisa claims, promessa exagerada e nichos sensíveis | artefato completo | warnings[] + flag de revisão humana | LLM texto (reviewer) |
| `quality_agent` | Checklist de qualidade e fidelidade ao SB7 antes de entregar | artefato completo | checklist + status approved/needs_fix | LLM texto (reviewer) |
| `export_agent` | Monta arquivos finais e salva metadados | artefato aprovado | arquivos (MD/PDF/DOCX/HTML) | conversor de documento / código |

Regras: papel claro, entrada/saída estruturadas, registra custo e status, nenhum acesso a API sem permissão da config do app, idempotência por etapa.

---

## 7. APIs externas potencializadoras

| API | Uso | Obrigatória no MVP? | Custo/Risco | Fallback |
| --- | --- | --- | --- | --- |
| LLM texto (Anthropic/OpenAI/Gemini) | Planejar, escrever e revisar a estratégia | **Sim** | Custo por token; baixo risco | Provedor alternativo com mesma modalidade |
| Conversor de documentos (DocRaptor/PDFShift/CloudConvert) | Export PDF/DOCX de alta fidelidade | Não (export local cobre o MVP) | Custo por arquivo | Geração local (md→pdf/docx em servidor) |
| Geração de imagem (OpenAI Images/Ideogram) | Capa da isca digital | Não | Custo por imagem | Capa template sem imagem |
| Pesquisa web (Perplexity/Tavily) | Insight de posicionamento/concorrência | Não | Custo por consulta; risco de dado desatualizado | Pular enriquecimento |
| Storage (Supabase Storage/R2/S3) | Guardar artefatos gerados | **Sim** | Custo de armazenamento | — |
| Analytics (PostHog) | Funil de uso do app | Não | Baixo | Desligar |
| Observabilidade (Sentry/Axiom) | Erros, traces e custo | **Sim** | Baixo | Logs estruturados próprios |

Toda API paga só entra se melhora o artefato, tem fallback e controle de custo (Premium §9.2).

---

## 8. Banco de dados

Reaproveita as tabelas base (`mini_apps`, `mini_app_runs`) e Premium (`premium_app_runs`, `premium_llm_calls`, `premium_tool_calls`, `generated_artifacts`, `artifact_versions`, `premium_cost_ledger`, `user_premium_limits`, `premium_model_configs`, `premium_api_integrations`).

**Tabelas específicas do app (núcleo multiprojeto + multiusuário):**

```sql
-- Um usuário tem muitos projetos. Um projeto = uma marca/produto/serviço.
create table sb7_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  app_id uuid not null references mini_apps(id),
  name text not null,
  target_audience text not null,
  raw_idea text not null,
  brand_voice text,
  language text default 'pt-BR',
  channels text[],
  status text default 'draft',          -- draft | interviewing | generated | archived
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, name)
);

-- Entrevista guiada gerada pela IA + respostas do usuário.
create table sb7_interview_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references sb7_projects(id) on delete cascade,
  user_id uuid not null,
  questions jsonb not null,             -- perguntas + sugestões pré-preenchidas
  answers jsonb,                        -- respostas do usuário
  status text default 'open',           -- open | completed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- O BrandScript: os 7 elementos + derivados. Versionado.
create table sb7_brandscripts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references sb7_projects(id) on delete cascade,
  user_id uuid not null,
  premium_run_id uuid references premium_app_runs(id),
  version integer not null default 1,
  -- 1. Herói
  hero_want text not null,
  -- 2. Problema
  problem_external text not null,
  problem_internal text not null,
  problem_philosophical text not null,
  villain text,
  -- 3. Guia
  empathy text not null,
  authority jsonb not null,             -- [{type, value}]
  -- 4. Plano
  plan_process jsonb not null,          -- ["passo 1","passo 2","passo 3"]
  plan_agreement jsonb,                 -- ["promessa 1", ...]
  -- 5. CTA
  cta_direct text not null,
  cta_transitional text,
  -- 6. Apostas
  stakes jsonb not null,                -- ["consequência 1", ...]
  -- 7. Sucesso
  success jsonb not null,               -- {concrete, identity}
  -- derivados
  one_liner text not null,
  is_current boolean default true,
  created_at timestamptz default now(),
  unique (project_id, version)
);

-- Materiais de marketing derivados (wireframe, isca, e-mails).
create table sb7_collateral (
  id uuid primary key default gen_random_uuid(),
  brandscript_id uuid not null references sb7_brandscripts(id) on delete cascade,
  user_id uuid not null,
  wireframe jsonb not null,             -- seções da homepage StoryBrand
  lead_generator jsonb,                 -- {title, format, outline}
  nurture_emails jsonb,                 -- [{subject, body}]
  sales_emails jsonb,                   -- [{subject, body}]
  created_at timestamptz default now()
);
```

- **Índices recomendados:** `sb7_projects(user_id)`, `sb7_brandscripts(project_id, is_current)`, `sb7_collateral(brandscript_id)`.
- **RLS/segurança:** política `user_id = auth.uid()` em todas as tabelas do app. Nenhum projeto é visível ou editável por outro usuário.
- **Versionamento:** nova geração cria novo `sb7_brandscripts.version`; `is_current` aponta a versão ativa; histórico preservado em `artifact_versions`.

---

## 9. Prompt contracts

Pipeline: `input → planner → creator → reviewer → exporter` (Premium §10). System prompt base da SextouTools PRO, idioma do usuário, sem expor raciocínio interno, aviso de revisão em nichos sensíveis.

- **Planner** — recebe os 3 campos; devolve a entrevista SB7 com sugestões pré-preenchidas. Saída: `{steps:[{element, question, suggestion, input_type, options}]}`.
- **Creator (brandscript)** — recebe respostas; devolve o BrandScript no schema abaixo. **Proibido** inverter herói/guia ou omitir elementos.
- **Creator (collateral)** — recebe o BrandScript; devolve wireframe + isca + e-mails.
- **Reviewer/Compliance** — valida fidelidade ao SB7, clareza, consistência de idioma e risco de promessa exagerada; devolve `{approved, fixes[], warnings[]}`.
- **Exporter** — monta arquivos; majoritariamente determinístico.

**JSON schema esperado (BrandScript):**

```json
{
  "artifact_title": "",
  "artifact_type": "sb7_brand_strategy",
  "language": "pt-BR",
  "hero": { "want": "" },
  "problem": { "external": "", "internal": "", "philosophical": "", "villain": "" },
  "guide": { "empathy": "", "authority": [{ "type": "", "value": "" }] },
  "plan": { "process": ["", "", ""], "agreement": [""] },
  "cta": { "direct": "", "transitional": "" },
  "stakes": [""],
  "success": { "concrete": "", "identity": "" },
  "one_liner": "",
  "collateral": {
    "homepage_wireframe": [{ "section": "", "copy": "" }],
    "lead_generator": { "title": "", "format": "", "outline": [""] },
    "nurture_emails": [{ "subject": "", "body": "" }],
    "sales_emails": [{ "subject": "", "body": "" }]
  },
  "quality_checklist": [""],
  "warnings": [""],
  "next_actions": [""]
}
```

---

## 10. Controle de custo

- **Custo estimado por execução:** mostrado antes de gerar (estimate_before_run). Uma estratégia completa = ~3 chamadas LLM principais (planner, creator x2, reviewer).
- **Limites por plano:** `user_premium_limits` (runs/mês, créditos/mês, storage, nº de versões por artefato).
- **Alertas:** alerta de custo ao admin da suite; bloqueio quando o limite do usuário é atingido (`block_when_user_limit_reached`).
- **Estratégia de fallback:** modelo equivalente → provedor alternativo → reduzir complexidade; tentativas falhas **não** são cobradas e ficam registradas em `premium_llm_calls`.

---

## 11. Segurança e compliance

- **Dados sensíveis:** o texto livre pode conter informações de negócio confidenciais. Reduzir retenção quando possível; permitir apagar projeto e histórico; nunca enviar a provedores desnecessários.
- **Avisos necessários:** estratégia de marketing **não** é aconselhamento jurídico, financeiro, médico ou de imigração. Para nichos regulados (saúde, finanças, imigração, suplementos), o `compliance_agent` insere aviso de revisão profissional e evita claims proibidos / promessas de resultado.
- **Revisão humana:** recomendada para esses nichos; sinalizada via `safety_level`.
- **Credenciais:** API keys só em secrets do servidor; nunca em `input_payload`, logs, prompts visíveis ou arquivos exportados; referência por `provider_slug`.
- **Logs:** IDs, status, provedor, modelo, fase, latência, custo, erro sanitizado. Nunca chaves ou conteúdo sensível integral.
- **Rate limit:** runs diários por usuário, máximo de caracteres no texto livre, captcha em atividade suspeita, alertas de custo ao admin.

---

## 12. Critérios de aceite

- [ ] Exige login.
- [ ] Suporta **múltiplos projetos** por usuário.
- [ ] É **multiusuário** com RLS por `user_id`.
- [ ] Usa o Design System v2.
- [ ] Funciona mobile-first (toque ≥ 48px, uma decisão por tela).
- [ ] Formulário básico de 3 campos como único input inicial.
- [ ] Entrevista multi-step gerada pela IA, elegante e fácil de responder.
- [ ] Preenche **todos** os 7 elementos SB7 + subníveis (externo/interno/filosófico; empatia/autoridade; processo/acordo; CTA direta/transicional).
- [ ] Gera one-liner, wireframe StoryBrand, isca de leads e sequências de e-mail.
- [ ] É genérico — funciona para qualquer produto ou serviço.
- [ ] Usa roteamento Premium de modelos por etapa.
- [ ] Registra LLM calls, tool calls e calcula custo.
- [ ] Salva histórico e permite reabrir e versionar.
- [ ] Permite regenerar uma seção isolada e duplicar projeto.
- [ ] Gera artefato exportável (MD/PDF/DOCX/HTML).
- [ ] Protege API keys; tem fallback; tem erro amigável.
- [ ] `reviewer_agent` reprova qualquer violação do modelo SB7.

---

## 13. App manifest Premium

```yaml
app:
  name: "Clareza — Gerador de Estratégia de Marketing (SB7)"
  slug: "storybrand-strategy-generator"
  suite: "SextouTools Premium"
  category: "Marketing"
  artifact_types:
    - sb7_brand_strategy
    - brandscript
    - one_liner
    - homepage_wireframe
    - email_sequence
  requires_auth: true
  requires_premium_plan: true
  mobile_first: true
  supports_multiple_projects: true

llm:
  mode: premium_multi_model
  routing_profile: balanced
  default_language: pt-BR
  supported_languages:
    - pt-BR
    - en-US
    - es

agents:
  runtime:
    - planner_agent
    - brandscript_agent
    - collateral_agent
    - compliance_agent
    - quality_agent
    - export_agent

integrations:
  required:
    - llm_text_provider
    - storage_provider
    - observability_provider
  optional:
    - document_export_provider
    - image_generation_provider
    - web_research_provider
    - analytics_provider

storage:
  save_inputs: true
  save_outputs: true
  save_files: true
  version_artifacts: true

cost_control:
  estimate_before_run: true
  record_actual_cost: true
  block_when_user_limit_reached: true

safety:
  pii_detection: true
  human_review_required: false        # true automaticamente para nichos regulados
  sensitive_category: false
```

---

## 14. Handoff para agentes de desenvolvimento (Codex / Claude Code / Antigravity)

Tarefas verificáveis, pequenas e revisáveis:

1. **DB & RLS** — criar tabelas do §8, políticas RLS por `user_id`, índices. *Evidência:* migration aplicada + teste de isolamento entre dois usuários.
2. **Auth guard & lista de projetos** — tela inicial com CRUD de projetos. *Evidência:* criar/editar/arquivar/duplicar projeto.
3. **Formulário básico (3 campos)** — validação server-side. *Evidência:* submit cria `sb7_projects`.
4. **planner_agent + entrevista multi-step** — gerar perguntas e renderizar stepper mobile-first. *Evidência:* entrevista responde aos 3 campos.
5. **Orquestrador + prompt contracts** — fases `planning→generation→review→export`, JSON schema validado. *Evidência:* BrandScript completo e válido.
6. **Roteamento multi-LLM + cost tracker + fallback** — `premium_model_configs`, registro em `premium_llm_calls`. *Evidência:* logs de custo e fallback simulado.
7. **collateral_agent** — wireframe, isca, e-mails. *Evidência:* coleção preenchida.
8. **compliance/quality agents** — checklist + warnings + bloqueio de violação SB7. *Evidência:* saída reprovada quando herói/guia invertidos.
9. **Preview + export (MD/PDF/DOCX/HTML)** — preview antes do download. *Evidência:* arquivos gerados + metadados em `generated_artifacts`.
10. **Versionamento + regenerar seção + favoritar.** *Evidência:* nova versão sem perder histórico.

> Regra de interoperabilidade: nenhuma etapa depende de uma ferramenta específica; cada uma tem critério de verificação claro.