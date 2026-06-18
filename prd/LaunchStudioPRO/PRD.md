# 📋 PRD — Launch Studio PRO

> **Mini-App Premium da Suite Sextou.biz**
> Fábrica de Fórmulas de Lançamento baseada na *Product Launch Formula™* de Jeff Walker

---

## Frontmatter

```yaml
name: launch-studio-pro
version: 1.0.0
suite: Sextou.biz Premium Apps
owner: Sextou.biz
language: pt-BR
category: Marketing & Estratégia de Lançamento
requires_premium: true
access_gate: users.is_premium = TRUE
compatible_with:
  - Codex
  - Claude Code
  - Google Antigravity
skill_base: software-premium-params
```

---

## 0. Gate de acesso Premium

| Regra | Detalhe |
|---|---|
| **Suite** | Sextou.biz Premium Apps |
| **Acesso** | Exclusivo para usuários com `users.is_premium = TRUE` |
| **Middleware** | `premium_gate` aplicado em todas as rotas do app |
| **Comportamento** | Usuário não-premium é redirecionado para `/upgrade` com mensagem clara |
| **Fallback UI** | Banner "Recurso Premium" com CTA de upgrade |
| **Logs** | Tentativas de acesso negadas registradas em `premium_access_logs` |

### SQL do gate

```sql
-- Campo obrigatório na tabela base users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

CREATE INDEX idx_users_is_premium ON users(is_premium);

-- Tabela de auditoria de tentativas de acesso
CREATE TABLE premium_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  app_slug text NOT NULL DEFAULT 'launch-studio-pro',
  attempted_at timestamptz DEFAULT now(),
  granted boolean NOT NULL,
  ip_address inet,
  user_agent text
);
```

### Middleware (conceitual)

```ts
// middleware/premiumGate.ts
export async function premiumGate(req, res, next) {
  const user = await db.users.find(req.auth.uid);
  if (!user?.is_premium) {
    await db.premium_access_logs.insert({
      user_id: user?.id, granted: false, ...
    });
    return res.redirect('/upgrade?app=launch-studio-pro');
  }
  await db.premium_access_logs.insert({
    user_id: user.id, granted: true, ...
  });
  next();
}
```

---

## 1. Visão geral

| Campo | Valor |
|---|---|
| **Suite** | Sextou.biz Premium Apps |
| **Nome do App** | Launch Studio PRO |
| **Slug** | `launch-studio-pro` |
| **Categoria** | Marketing & Estratégia de Lançamento |
| **Usuário-alvo** | Empreendedores, infoprodutores, coaches, consultores, criadores de conteúdo e donos de pequenos/médios negócios que desejam planejar, estruturar e executar lançamentos de produtos ou serviços usando a metodologia *Product Launch Formula™* (PLF) de Jeff Walker. |
| **Dor principal** | Empreendedores criam produtos e campanhas no "Marketing da Esperança", sem roteiro de sequência, estímulos mentais, escassez real ou diálogo com o mercado — resultando em baixíssima conversão, listas frias e desperdício de tráfego. |
| **Promessa** | Em menos de 20 minutos de entrevista guiada, o usuário recebe um **Plano de Lançamento Completo** fiel à PLF: cronograma de Pré-Pré → Pré-Lançamento (PLC 1, 2 e 3) → Abertura do Carrinho → Fechamento, com copy pronta, estímulos mentais ativados, escassez desenhada, bônus, objeções respondidas e calendário de e-mails — pronto para ser executado. |
| **Artefato principal** | **Dossiê de Lançamento** (PDF + Markdown + JSON estruturado) contendo: Avatar, Oferta Irresistível, Sequência de Pré-Pré, PLC 1/2/3 com roteiros, Estratégia de Escassez, Cronograma de E-mails, Mapa de Estímulos Mentais, Plano de Lançamento Conjunto (quando aplicável) e Checklist de Execução. |
| **Multiusuário** | ✅ Sim — cada usuário tem workspace próprio com múltiplos projetos. |
| **Múltiplos projetos** | ✅ Sim — ilimitado conforme plano (Starter: 3, Pro: 25, Agency: ilimitado). |
| **Acesso** | 🔒 Exclusivo para usuários `is_premium = TRUE` |

---

## 2. Resultado esperado

### Artefatos gerados
- **Dossiê de Lançamento** (PDF profissional, Markdown, JSON, DOCX).
- **Calendário de execução** (CSV/ICS integrável ao Google Calendar).
- **Pack de e-mails prontos** (pré-pré, PLC 1/2/3, abertura, follow-ups, fechamento) — Markdown + HTML.
- **Scripts de vídeo** para PLC 1, 2 e 3 (roteiro palavra-por-palavra).
- **Página de vendas** (HTML/Copy estruturada em blocos).
- **Plano de Lançamento Conjunto** (lista de parceiros-alvo, script de abordagem, estrutura de comissão).
- **Mapa de estímulos mentais** por fase (visualização).
- **Checklist de execução** (Notion/Markdown).

### Formatos de exportação
PDF · DOCX · Markdown · JSON · CSV · ICS · HTML · ZIP (pack completo)

### Tempo esperado de geração
- Entrevista guiada: 8 a 18 minutos.
- Geração do dossiê completo: 90 a 180 segundos.

### Ações pós-resultado
Copiar · Baixar · Regenerar fase específica · Duplicar projeto · Compartilhar com equipe · Favoritar · Transformar em novo formato · Exportar para Notion/Trello/Asana.

---

## 3. Fluxo mobile-first

```
1. Login / Cadastro
2. Gate Premium (verifica users.is_premium = TRUE)
   ├── Se FALSE → redirect para /upgrade
   └── Se TRUE → continua
3. Dashboard — "Meus Lançamentos" (lista de projetos + CTA "+ Novo Lançamento")
4. Briefing inicial (3 campos: Nome · Público · Ideia)
5. Entrevista Multi-Step (10 etapas com coach tips)
6. Revisão do briefing antes de gerar
7. Geração Premium (orquestrador multi-LLM)
8. Preview do Dossiê (abas: Avatar · Oferta · Sequência · Copy · Cronograma · Estímulos)
9. Exportação (PDF, ZIP, Markdown)
10. Histórico, versões e regeneração por fase
```

---

## 4. Campos do formulário

### 4.1 Briefing inicial (tela 1)

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| Nome do Projeto | Texto curto | ✅ | Ex: "Lançamento Curso Violão Zero" |
| Público-Alvo (Avatar resumido) | Texto curto | ✅ | Ex: "Homens 35-55 que querem tocar violão" |
| Ideia do Produto & Campanha | Textarea livre | ✅ | Mínimo 80 caracteres |

### 4.2 Entrevista Multi-Step (10 etapas)

**Etapa 1 — Aprofundamento do Avatar**
- Dores que tiram o sono do avatar
- Sonhos e desejos
- Medos e objeções antecipadas
- Linguagem que o avatar usa (palavras-chave)
- Onde o avatar está (canais)

**Etapa 2 — A Transformação (Promessa)**
- Estado atual → Estado desejado
- Prazo realista da transformação
- Prova da transformação (estudos de caso)
- O que acontece se NÃO comprar

**Etapa 3 — A Oferta Irresistível**
- Produto principal (formato, duração, entrega)
- Bônus (até 5)
- Garantia
- Preço âncora vs. preço de lançamento
- Formas de pagamento

**Etapa 4 — Tipo de Lançamento**
- Seed Launch™ (começando do zero)
- Lançamento Interno (lista própria)
- Lançamento Conjunto (parceiros)
- Lançamento Perene (evergreen)
- Business Launch Formula™ (múltiplas ofertas encadeadas)

**Etapa 5 — Sequência de Pré-Pré-Lançamento**
- Tamanho atual da lista
- Canais disponíveis (e-mail, IG, YouTube, etc.)
- Top 3 perguntas que o avatar faz antes de comprar
- Tom de voz da marca

**Etapa 6 — PLC 1 — A Oportunidade ("Por quê?")**
- Qual a grande oportunidade que o produto abre?
- Por que o usuário deveria prestar atenção em você? (autoridade)
- Ensinamento rápido que será entregue
- Objeções que serão antecipadas

**Etapa 7 — PLC 2 — A Transformação ("Quê?")**
- Estudo de caso ou ensinamento prático
- Dica que o avatar pode aplicar HOJE
- Objeções que serão quebradas

**Etapa 8 — PLC 3 — A Experiência da Propriedade ("Como?")**
- Como a vida do avatar será após comprar
- Guinada suave para a oferta
- Escassez inicial

**Etapa 9 — Escassez & Fechamento**
- Tipo de escassez: preço sobe / bônus somem / oferta encerra
- Duração da abertura do carrinho (4 a 7 dias)
- E-mails de fechamento (últimas 24h)

**Etapa 10 — Estímulos Mentais & Parcerias**
- Estímulos prioritários (multi-select): Autoridade · Reciprocidade · Confiança · Expectativa · Empatia · Eventos · Comunidade · Escassez · Comprovação Social
- Pretensão de Lançamento Conjunto (sim/não)
- Nicho de parceiros-alvo

---

## 5. Configuração de LLMs

| Fase | Provedor sugerido | Modelo | Motivo | Fallback |
|---|---|---|---|---|
| `interview_coach` | Anthropic | Claude Sonnet | Empatia, condução de entrevista, tom humano | OpenAI GPT-5 |
| `planner` | OpenAI | GPT-5.1 | Decomposição estrutural do plano PLF | Claude Sonnet |
| `copywriter` | Anthropic | Claude Opus | Copy persuasiva fiel ao estilo Jeff Walker | Gemini 2.5 Pro |
| `avatar_researcher` | Perplexity | sonar-pro | Pesquisa de mercado e dores do avatar | Tavily + GPT-5 |
| `objection_handler` | Google | Gemini 2.5 Pro | Revisão crítica e quebra de objeções | Claude Sonnet |
| `reviewer` | Anthropic | Claude Sonnet | Revisão de fidelidade à PLF | GPT-5 |
| `exporter` | OpenAI | GPT-5-mini | Geração JSON estruturada para exportação | Claude Haiku |

**Routing profile:** `quality_first` (o usuário é premium e paga por estratégia de elite)
**Fallback strategy:** `same_modality_lower_cost`
**Idioma padrão:** pt-BR (com suporte a en-US, es-ES)

---

## 6. Agentes operacionais

| Agente | Função | Entrada | Saída |
|---|---|---|---|
| `interview_agent` | Conduz a entrevista multi-step com coach tips | Respostas do usuário | Próximas perguntas + resumos |
| `avatar_agent` | Monta perfil profundo do avatar | Briefing + respostas | JSON de avatar |
| `offer_architect` | Desenha a oferta irresistível | Respostas etapa 3 | Estrutura de oferta + bônus |
| `sequence_planner` | Monta PLC 1, 2, 3 + pré-pré + abertura | Briefing completo | Cronograma + roteiros |
| `trigger_mapper` | Distribui estímulos mentais em camadas | Tipo de lançamento | Mapa de estímulos por fase |
| `scarcity_designer` | Desenha escassez real e consequência negativa | Etapa 9 | Estratégia de fechamento |
| `copywriter_agent` | Gera e-mails, scripts e página de vendas | Sequência aprovada | Pack de copy |
| `jl_partner_advisor` | Sugere parceiros de Lançamento Conjunto | Nicho + avatar | Lista de perfis-alvo + script |
| `fidelity_reviewer` | Valida fidelidade à PLF (Jeff Walker) | Dossiê completo | Checklist + ajustes |
| `export_agent` | Gera PDF, DOCX, Markdown, ZIP | Dossiê validado | Arquivos finais |

---

## 7. APIs externas potencializadoras

| API | Uso | Obrigatória no MVP? | Custo/Risco | Fallback |
|---|---|---|---|---|
| Perplexity Sonar | Pesquisa de mercado e avatar | ✅ | Baixo | Tavily + GPT |
| Cloudflare R2 | Armazenamento de dossiês | ✅ | Baixo | Supabase Storage |
| DocRaptor / PDFShift | Geração de PDF profissional | ✅ | Médio | Puppeteer self-hosted |
| Resend | Envio do dossiê por e-mail | ❌ | Baixo | SendGrid |
| Google Calendar API | Exportar cronograma | ❌ | Zero | ICS file |
| Notion API | Exportar checklist | ❌ | Zero | Markdown |
| Stripe | Cobrança por plano/créditos | ✅ | Variável | Paddle |
| Sentry | Observabilidade | ✅ | Baixo | Logtail |

**Regra de escolha:** toda API melhora diretamente o artefato final, tem fallback, custo estimado por execução e não expõe chaves ao cliente.

---

## 8. Banco de dados

### 8.1 Tabelas base (obrigatórias pela skill base)

```sql
-- Tabela users com gate premium
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  is_premium boolean NOT NULL DEFAULT false,
  premium_plan_slug text, -- starter | pro | agency
  premium_since timestamptz,
  premium_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE mini_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  suite text NOT NULL DEFAULT 'Sextou.biz Premium Apps',
  requires_premium boolean NOT NULL DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE mini_app_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  app_id uuid NOT NULL REFERENCES mini_apps(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

### 8.2 Tabelas Premium específicas

```sql
-- Projetos de lançamento (multiusuário + múltiplos projetos)
CREATE TABLE launch_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  slug text NOT NULL,
  target_audience text NOT NULL,
  initial_briefing text NOT NULL,
  status text DEFAULT 'draft', -- draft | interviewing | planning | ready | launched | archived
  launch_type text, -- seed | internal | joint | evergreen | business
  fidelity_score numeric, -- 0-100 fidelidade à PLF
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Respostas da entrevista multi-step
CREATE TABLE launch_interview_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES launch_projects(id),
  step_number integer NOT NULL,
  step_slug text NOT NULL,
  answers jsonb NOT NULL,
  coach_tip_shown text,
  created_at timestamptz DEFAULT now()
);

-- Dossiês gerados
CREATE TABLE launch_dossiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES launch_projects(id),
  version integer DEFAULT 1,
  payload jsonb NOT NULL, -- avatar, offer, sequence, copy, triggers, calendar
  pdf_url text,
  zip_url text,
  markdown_url text,
  created_at timestamptz DEFAULT now()
);

-- Fases do plano PLF
CREATE TABLE launch_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES launch_dossiers(id),
  phase_slug text NOT NULL, -- pre_pre | plc1 | plc2 | plc3 | cart_open | cart_close
  scheduled_date date,
  triggers_activated text[],
  copy_blocks jsonb,
  status text DEFAULT 'planned'
);

-- Estímulos mentais ativados
CREATE TABLE launch_triggers_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES launch_dossiers(id),
  trigger_name text NOT NULL, -- authority | reciprocity | trust | anticipation | empathy | events | community | scarcity | social_proof
  phase_slug text NOT NULL,
  intensity integer DEFAULT 5,
  implementation_notes text
);

-- Logs de acesso premium (auditoria do gate)
CREATE TABLE premium_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  app_slug text NOT NULL DEFAULT 'launch-studio-pro',
  attempted_at timestamptz DEFAULT now(),
  granted boolean NOT NULL,
  ip_address inet,
  user_agent text
);
```

### 8.3 RLS (Row Level Security)

```sql
-- Política padrão: usuário só vê seus próprios projetos
ALTER TABLE launch_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY launch_projects_user_isolation
  ON launch_projects FOR ALL
  USING (user_id = auth.uid());

ALTER TABLE launch_interview_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_answers_user_isolation
  ON launch_interview_answers FOR ALL
  USING (
    project_id IN (
      SELECT id FROM launch_projects WHERE user_id = auth.uid()
    )
  );

ALTER TABLE launch_dossiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY launch_dossiers_user_isolation
  ON launch_dossiers FOR ALL
  USING (
    project_id IN (
      SELECT id FROM launch_projects WHERE user_id = auth.uid()
    )
  );

-- Gate premium aplicado via função
CREATE OR REPLACE FUNCTION require_premium()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_premium = TRUE
  );
$$ LANGUAGE sql STABLE;
```

### 8.4 Índices recomendados

- `(user_id, status)` em `launch_projects`
- `(project_id, step_number)` em `launch_interview_answers`
- `(dossier_id, version)` em `launch_dossiers`
- `(user_id, is_premium)` em `users`
- `(user_id, attempted_at)` em `premium_access_logs`

---

## 9. Prompt contracts

### 9.1 System prompt base

```
Você é um estrategista sênior da Launch Studio PRO (Suite Sextou.biz Premium),
especializado na Product Launch Formula™ de Jeff Walker. Sua missão é ajudar
empreendedores brasileiros a estruturar lançamentos que geram expectativa,
diálogo e conversão — nunca "Marketing da Esperança".

Regras inegociáveis:
1. Fidelidade total à PLF: Pré-Pré → PLC 1 (Oportunidade) →
   PLC 2 (Transformação) → PLC 3 (Propriedade) → Abertura → Fechamento.
2. Toda oferta deve responder: "Qual a transformação final?"
3. Todo lançamento precisa de escassez REAL (preço, bônus ou encerramento).
4. Estímulos mentais devem ser distribuídos em camadas, nunca isolados.
5. Nunca prometa resultados financeiros específicos.
6. Sempre inclua aviso: "Resultados variam conforme execução e mercado."
7. Responda em pt-BR, tom humano, direto, sem linguagem corporativa.
8. Saída sempre em JSON validável pelo schema fornecido.
```

### 9.2 Schema JSON de saída (dossiê)

```json
{
  "project": { "title": "", "slug": "", "launch_type": "" },
  "avatar": {
    "profile": {},
    "pains": [],
    "dreams": [],
    "fears": [],
    "objections": [],
    "language": []
  },
  "offer": {
    "transformation": "",
    "core_product": {},
    "bonuses": [],
    "guarantee": "",
    "anchor_price": 0,
    "launch_price": 0,
    "scarcity_type": "price_increase | bonus_removal | offer_ends | combined"
  },
  "sequence": {
    "pre_pre": { "strategy": "", "email_script": "", "survey_questions": [] },
    "plc1": { "theme": "Oportunidade", "script": "", "key_points": [], "cta": "" },
    "plc2": { "theme": "Transformação", "script": "", "teaching": "", "case_study": "" },
    "plc3": { "theme": "Propriedade", "script": "", "offer_tease": "", "scarcity_seed": "" },
    "cart_open": { "email_script": "", "sales_page_outline": [] },
    "cart_close": { "emails": [], "scarcity_amplification": "" }
  },
  "triggers_map": [
    { "trigger": "", "phase": "", "intensity": 0, "how_to_activate": "" }
  ],
  "calendar": [
    { "day": 0, "phase": "", "action": "", "asset": "" }
  ],
  "joint_launch": {
    "recommended": false,
    "partner_profile": "",
    "commission_structure": ""
  },
  "warnings": [],
  "fidelity_checklist": []
}
```

---

## 10. Controle de custo

| Item | Valor estimado |
|---|---|
| Custo por entrevista completa (10 steps) | ~$0.18 |
| Custo por geração de dossiê completo | ~$0.42 |
| Custo com pesquisa Perplexity | ~$0.05 |
| Custo com geração de PDF | ~$0.03 |
| **Total por projeto completo** | **~$0.68** |

**Limites por plano Premium:**
- **Starter**: 3 projetos/mês, 10 regenerações
- **Pro**: 25 projetos/mês, regenerações ilimitadas
- **Agency**: ilimitado + white-label

**Alertas:** admin notificado quando custo diário > $50 ou usuário > $20/mês.

**Bloqueio:** se usuário atingir limite do plano, exibir modal com CTA para upgrade — sem apagar projetos existentes.

---

## 11. Segurança e compliance

### 11.1 Gate Premium
- Todas as rotas do app passam pelo middleware `premiumGate`.
- Tentativas de acesso negado são registradas em `premium_access_logs`.
- Se padrão suspeito (múltiplas tentativas em curto espaço), acionar CAPTCHA.

### 11.2 Dados sensíveis
- Ideias de negócio, estratégias, preços — tratados como segredo comercial.
- Usuário pode apagar projeto a qualquer momento (soft delete + hard delete em 30 dias).

### 11.3 Avisos obrigatórios
- "Este plano é estratégico. Resultados dependem de execução, mercado e audiência."
- "Não há garantia de faturamento específico. Números do livro são ilustrativos."

### 11.4 Revisão humana
- Recomendada para lançamentos em nichos regulados (saúde, finanças, jurídico).
- Aviso explícito no preview: "Recomendamos revisão profissional antes da publicação."

### 11.5 Credenciais
- API keys apenas no servidor, nunca em logs ou artefatos exportáveis.
- Secrets separados por ambiente (`development`, `staging`, `production`).

### 11.6 Rate limit
- 5 gerações simultâneas por usuário.
- 50 gerações/dia por usuário (limite padrão do plano Pro).

---

## 12. Critérios de aceite

### Produto
- [ ] App pertence à **Suite Sextou.biz Premium Apps**
- [ ] Acesso restrito a `users.is_premium = TRUE`
- [ ] Middleware `premiumGate` aplicado em todas as rotas
- [ ] Tentativas de acesso negado registradas em `premium_access_logs`
- [ ] Gera dossiê de lançamento utilizável (PDF + pack de copy)
- [ ] Suporta múltiplos projetos por usuário
- [ ] Multiusuário com RLS
- [ ] Fidelidade total à PLF (Pré-Pré → PLC 1/2/3 → Abertura → Fechamento)
- [ ] Genérico para qualquer produto/serviço

### UX/UI
- [ ] Mobile-first (Design System v2 — Bricolage Grotesque + Inter + JetBrains Mono)
- [ ] Briefing inicial com apenas 3 campos
- [ ] Entrevista multi-step com coach tips
- [ ] Preview por abas antes de gerar
- [ ] Momento de celebração na entrega
- [ ] Histórico e versionamento
- [ ] Tela de upgrade clara para usuários não-premium

### LLM e agentes
- [ ] Múltiplos provedores (OpenAI, Anthropic, Google, Perplexity)
- [ ] Roteamento por fase
- [ ] Fallback automático
- [ ] Prompt contracts separados por agente
- [ ] Revisão de fidelidade à PLF automática

### Banco e histórico
- [ ] Campo `users.is_premium` com índice
- [ ] Salva projeto, entrevista, dossiê, fases, estímulos
- [ ] Versionamento de dossiês
- [ ] RLS por usuário
- [ ] Logs de acesso premium auditáveis

### Segurança
- [ ] Nenhuma API key no client
- [ ] Logs sanitizados
- [ ] Avisos de compliance visíveis
- [ ] Rate limit ativo
- [ ] Alertas de custo ativos
- [ ] Gate premium impossível de burlar no client

### Compatibilidade com agentes
- [ ] Codex, Claude Code e Antigravity conseguem implementar
- [ ] Skill escrita em Markdown com frontmatter
- [ ] Tarefas quebradas em passos verificáveis

---

## 13. App manifest

```yaml
app:
  name: "Launch Studio PRO"
  slug: "launch-studio-pro"
  suite: "Sextou.biz Premium Apps"
  category: "Marketing & Estratégia de Lançamento"
  requires_premium: true
  access_gate: "users.is_premium = TRUE"
  artifact_types:
    - launch_dossier_pdf
    - email_pack
    - video_scripts
    - sales_page_html
    - calendar_ics
    - checklist_markdown
    - triggers_map
  requires_auth: true
  mobile_first: true

llm:
  mode: premium_multi_model
  routing_profile: quality_first
  default_language: pt-BR
  supported_languages:
    - pt-BR
    - en-US
    - es-ES

agents:
  runtime:
    - interview_agent
    - avatar_agent
    - offer_architect
    - sequence_planner
    - trigger_mapper
    - scarcity_designer
    - copywriter_agent
    - jl_partner_advisor
    - fidelity_reviewer
    - export_agent

integrations:
  required:
    - llm_text_provider
    - perplexity_research
    - pdf_generator
    - storage_provider
  optional:
    - google_calendar
    - notion_export
    - resend_email

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
  human_review_recommended: true
  sensitive_category: false
  premium_gate_enforced: true
```

---

## 14. Checklist de implementação para agentes

### Para Codex
- [ ] Ler repositório e identificar stack, rotas, DB e design system
- [ ] Criar/alterar tabela `users` com campo `is_premium`
- [ ] Criar middleware `premiumGate`
- [ ] Criar tabelas Premium (`launch_projects`, `launch_dossiers`, etc.)
- [ ] Implementar rotas server-side com gate aplicado
- [ ] Integrar orquestrador multi-LLM
- [ ] Rodar lint, typecheck e testes

### Para Claude Code
- [ ] Usar leitura ampla de contexto (multi-arquivo)
- [ ] Criar subagentes: `architecture`, `backend`, `frontend`, `db`, `security`, `qa`
- [ ] Atualizar documentação do projeto
- [ ] Explicar riscos de custo antes de integrar APIs pagas
- [ ] Nunca expor chaves reais em prompts, commits ou logs

### Para Antigravity
- [ ] Produzir artifacts de verificação: plano, checklist, logs de testes
- [ ] Confirmar comandos destrutivos antes de executar
- [ ] Isolar ambiente de desenvolvimento ao rodar migrations
- [ ] Validar que gate premium funciona em staging antes de produção

---

## 15. Comando mental da skill

> Sempre que este mini-app for revisado ou expandido, pergunte:
> - O app gera um artefato real de lançamento?
> - Pertence à Suite Sextou.biz Premium?
> - Está protegido por login + gate `is_premium = TRUE`?
> - Usa Design System v2 e mobile-first?
> - Tem histórico e versionamento?
> - Quais LLMs são necessárias por etapa?
> - Qual é o custo por execução?
> - Existe fallback?
> - Existe risco jurídico/financeiro que exige aviso?
> - As chaves estão protegidas?
> - O resultado é exportável?
> - Codex, Claude Code e Antigravity conseguem implementar com passos claros?
>
> Se qualquer resposta crítica for "não", ajustar o plano antes de aprovar.

---

## 16. Regras finais

- Mini-app Premium deve parecer produto profissional, não experimento de IA.
- Não adicionar API paga sem justificar valor, custo e fallback.
- Não usar LLM para tarefas que podem ser resolvidas por código determinístico.
- Não enviar dados sensíveis para múltiplos provedores sem necessidade.
- Não gerar promessa de faturamento específico sem aviso de revisão profissional.
- Não esconder custos do administrador da suite.
- Não quebrar compatibilidade mobile-first.
- Não transformar o app em chat aberto quando o objetivo é gerar artefato.
- **Não permitir acesso a usuários não-premium sob nenhuma circunstância.**

---

**Fim do PRD — Launch Studio PRO**
*Suite Sextou.biz Premium Apps · v1.0.0 · skill `software-premium-params`*