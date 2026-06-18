# Mini-App Premium PRD: YouTube Growth Studio AI

## 1. Visão geral

- **Suite:** SextouTools Premium (Sextou.biz)
- **Slug:** `youtube-growth-studio`
- **Categoria:** Marketing / Creator Economy
- **Usuário-alvo:** Pequenos e médios empreendedores brasileiros nos EUA (contadores, imobiliárias, escolas, restaurantes, empresas de serviço, especialistas, coaches, clínicas, lojas) que querem transformar o YouTube em ativo de negócio.
- **Dor principal:** O empreendedor tem conhecimento e oferta, mas não consegue transformar isso em conteúdo consistente — falta plano, falta ideia, falta tempo, falta saber como vender sem parecer forçado.
- **Promessa:** *“Crie em minutos um plano completo para seu canal do YouTube, com vídeos, Shorts, posts, carrosséis, legendas, hashtags e artes sugeridas — tudo adaptado ao seu nicho, sua cidade e seu público nos Estados Unidos.”*
- **Artefato principal:** **Pacote editorial mensal** (calendário + roteiros + títulos + descrições + hashtags + posts + carrosséis + legendas + briefings de thumbnail) em um único pacote exportável.
- **Acesso:** restrito a usuários com `users.is_premium = TRUE`. Usuários não-premium veem tela de upgrade com preview do que perderam.

---

## 2. Resultado esperado

- **Artefatos gerados:**
  - Calendário editorial de 30 dias (vídeos longos, Shorts, lives, community posts).
  - Roteiros completos (abertura, gancho, desenvolvimento, CTA, fechamento).
  - 3 títulos alternativos por vídeo (curiosidade, autoridade, SEO, venda).
  - Descrição otimizada (resumo, timestamps, links, CTA, palavras-chave).
  - Pacote de hashtags por nicho, cidade e intenção.
  - Posts de divulgação para Instagram, Facebook, LinkedIn, WhatsApp e Comunidade YouTube.
  - Estrutura de carrosséis (5–10 slides) derivados do vídeo.
  - Legendas curtas, médias e longas para redes sociais.
  - Briefing visual de thumbnail + sugestão de arte.
  - Ideias de vídeos evergreen e trending para os próximos 90 dias.
- **Formatos de exportação:** PDF (plano completo), DOCX (roteiros), CSV (calendário), ZIP (pacote completo), Markdown (para Notion/Obsidian), JSON (para integração).
- **Tempo esperado de geração:** 45–90 segundos por pacote mensal completo.
- **Ações pós-resultado:** baixar, copiar, regenerar seção específica, favoritar, versionar, agendar no histórico, compartilhar link público opcional, transformar em campanha de e-mail.

---

## 3. Fluxo mobile-first (Design System v2)

1. **Onboarding de contexto** (1 tela) — nicho, cidade, oferta principal, público.
2. **Stepper amigável** (v2) — 5 fases: Contexto → Estratégia → Calendário → Roteiros → Pacote Final.
3. **Coach tips** em cada fase (ex: “Os 2 primeiros segundos decidem se o vídeo prende”).
4. **Dropdowns e presets** em tudo (nicho, cidade, tom, formato).
5. **Preview em tempo real** do calendário em cards.
6. **Geração Premium** com tela de progresso amigável (sem “HTTP 429”).
7. **Tela de celebração** (v2: gradiente, emoji 🎉, foco no download).
8. **Histórico e versões** acessíveis no rodapé.

**Regra v2:** uma decisão por tela, CTA principal em gradiente `#FF3D57 → #FF8C00` com altura 54px, toque mínimo 48px, tipografia `Bricolage Grotesque` em títulos.

---

## 4. Campos do formulário

| Campo | Tipo | Obrigatório | Opções | Observação |
|---|---|---|---|---|
| Nome do canal | text | ✅ | — | Máx 60 chars |
| Nicho / categoria | dropdown | ✅ | Contabilidade, Imobiliário, Educação, Restaurante, Serviços gerais, Saúde/Estética, Direito imigratório, Coaching, E-commerce, Igreja/ministério, Outros | Preset com ícones |
| Cidade / Estado | dropdown + text | ✅ | Lista das 30 maiores cidades BR nos EUA + “Outra” | Orlando, Miami, Boston, Newark, Framingham, etc. |
| Oferta principal | text | ✅ | — | Ex: “limpeza residencial em Orlando” |
| Público-alvo | dropdown múltiplo | ✅ | Brasileiros recém-chegados, Brasileiros estabelecidos, Mistos BR+gringos, Turistas, Empresários BR | |
| Tom de voz | dropdown | ✅ | Autoridade amigável, Educativo leve, Energético/viral, Sofisticado, Humor leve | |
| Objetivo do canal | dropdown | ✅ | Vender serviço, Gerar leads, Construir autoridade, Educar clientes, Recrutar, Misto | |
| Idioma do conteúdo | dropdown | ✅ | PT-BR, EN-US, Bilíngue (PT+EN) | |
| Frequência semanal | dropdown | ✅ | 1 vídeo, 2 vídeos, 3 vídeos, 4+ vídeos | |
| Incluir Shorts? | toggle | ✅ | — | Default ON |
| Incluir lives? | toggle | ❌ | — | Default OFF |
| Concorrentes / referências | text (opcional) | ❌ | — | Até 3 canais ou URLs |
| Palavras-chave foco | chips | ❌ | — | Sugestões automáticas via YouTube Data API |
| Restrições de conteúdo | chips múltiplos | ❌ | Sem política, Sem saúde sensível, Sem claims financeiros, Sem marcas concorrentes | Compliance |

---

## 5. Configuração de LLMs

| Fase | Provedor sugerido | Modelo/Capacidade | Motivo | Fallback |
|---|---|---|---|---|
| `planning` (estratégia + calendário) | Anthropic | `claude-sonnet-latest` | Contexto longo, raciocínio estrutural, bom em planejamento editorial | OpenAI `gpt-5.1` |
| `creator` (roteiros + copy) | Anthropic | `claude-sonnet-latest` | Tom natural em PT-BR, CTA sem parecer forçado | OpenAI `gpt-5.1` |
| `seo` (títulos, descrições, hashtags) | OpenAI | `gpt-5.1` | Forte em SEO e padrões de título do YouTube | Gemini `gemini-pro-latest` |
| `ideas` (ideias trending) | Google | `gemini-pro-latest` + Perplexity tool | Acesso a tendências atuais | OpenAI + Tavily |
| `visual_brief` (thumbnails) | OpenAI | `gpt-5.1-vision` | Analisa referências e gera briefing | Gemini vision |
| `thumbnail_gen` (imagem real) | OpenAI / Ideogram | image model | Gera thumbnail a partir do briefing | Stability AI |
| `reviewer` (qualidade + compliance) | Anthropic | `claude-sonnet-latest` | Revisão de tom, claims, adequação cultural BR-EUA | Gemini |
| `translator` (quando bilíngue) | DeepL / OpenAI | tradução assistida | Qualidade superior em PT↔EN | Google Translate |

**Routing profile padrão:** `balanced` (usuário pode escolher `quality_first` ou `cost_saver` em configurações avançadas — escondido atrás de “modo especialista”).

---

## 6. Agentes operacionais

| Agente | Função | Entrada | Saída | Ferramentas/APIs |
|---|---|---|---|---|
| `context_agent` | Valida e enriquece contexto do negócio | form input | `business_context` estruturado | YouTube Data API (valida nicho) |
| `trend_agent` | Busca tendências do nicho na região | nicho + cidade | lista de temas trending | Perplexity / Tavily / YouTube Data API |
| `planner_agent` | Gera calendário de 30 dias | contexto + tendências | `content_calendar` JSON | — |
| `scriptwriter_agent` | Escreve roteiros completos | calendário + tom | roteiros em JSON | — |
| `seo_agent` | Gera títulos, descrições, hashtags | roteiro + nicho | SEO pack JSON | YouTube Data API |
| `social_adapter_agent` | Deriva posts/carrosséis/legendas | roteiro | social pack JSON | — |
| `visual_brief_agent` | Gera briefing de thumbnail | roteiro + tom | brief JSON | — |
| `thumbnail_agent` | Gera imagem da thumbnail | brief | URL da imagem | Image API |
| `compliance_agent` | Revisa claims, tom, riscos | pacote final | warnings + ajustes | — |
| `export_agent` | Monta PDF/DOCX/CSV/ZIP | pacote aprovado | arquivos no storage | DocRaptor / PDFShift |
| `quality_agent` | Checklist final antes da entrega | pacote | score + go/no-go | — |

---

## 7. APIs externas potencializadoras

| API | Uso | Obrigatória no MVP? | Custo/Risco | Fallback |
|---|---|---|---|---|
| **YouTube Data API v3** | Buscar tendências, validar nicho, sugerir palavras-chave, analisar concorrentes | ✅ Sim | Baixo custo / risco baixo | Cache local + Perplexity |
| **Perplexity / Tavily** | Pesquisa web de tendências regionais (BR nos EUA) | ✅ Sim | Médio | Google Custom Search |
| **YouTube Analytics API** (opcional, com OAuth) | Personalizar sugestões com base em dados reais do canal do usuário | ❌ Fase 2 | Requer OAuth | — |
| **OpenAI Images / Ideogram** | Gerar thumbnails a partir do briefing | ❌ Opcional no MVP | $0.04–0.12/imagem | Stability AI |
| **DocRaptor / PDFShift** | Exportação PDF premium | ✅ Sim | $0.01–0.05/doc | Geração server-side com Puppeteer |
| **Cloudflare R2 / Supabase Storage** | Armazenar artefatos | ✅ Sim | Baixo | S3 |
| **DeepL** | Tradução PT↔EN quando bilíngue | ❌ Opcional | $0.0025/char | Google Translate |
| **Canva API** (futuro) | Exportar carrossel como design editável | ❌ Fase 3 | Variável | PDF estático |
| **PostHog** | Analytics de funil | ✅ Sim | Free tier | GA4 |
| **Sentry** | Observabilidade | ✅ Sim | Free tier | Logtail |

**Regra de escolha:** cada API acima responde “sim” para: melhora o artefato final, reduz trabalho manual real, tem fallback, custo controlado por execução.

---

## 8. Banco de dados

### Tabelas base (obrigatórias da suite)
- `users` (com campo `is_premium boolean`)
- `mini_apps`
- `mini_app_runs`

### Tabelas Premium (skill `software-premium-params`)
- `premium_model_providers`
- `premium_model_configs`
- `premium_api_integrations`
- `premium_app_runs`
- `premium_llm_calls`
- `premium_tool_calls`
- `generated_artifacts`
- `artifact_versions`
- `premium_cost_ledger`
- `user_premium_limits`

### Tabelas específicas do app

```sql
-- Perfil de canal do usuário (1 por usuário, reutilizável)
create table youtube_channels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  channel_name text not null,
  niche text not null,
  city text,
  state text,
  primary_offer text,
  target_audience text[],
  tone text,
  goal text,
  language text default 'pt-BR',
  weekly_frequency integer default 2,
  include_shorts boolean default true,
  include_lives boolean default false,
  competitor_channels text[],
  focus_keywords text[],
  content_restrictions text[],
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Plano editorial mensal (1 run = 1 plano)
create table youtube_content_plans (
  id uuid primary key default gen_random_uuid(),
  premium_run_id uuid not null references premium_app_runs(id),
  user_id uuid not null references users(id),
  channel_id uuid not null references youtube_channels(id),
  month integer not null,
  year integer not null,
  total_videos integer,
  total_shorts integer,
  total_posts integer,
  strategy_summary text,
  calendar_json jsonb not null,
  status text default 'draft', -- draft, approved, published
  created_at timestamptz default now()
);

-- Itens do calendário (cada vídeo/short/post)
create table youtube_content_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references youtube_content_plans(id),
  item_type text not null, -- video, short, live, community_post
  scheduled_date date not null,
  title text,
  hook text,
  script_json jsonb,
  seo_pack jsonb,        -- titles[], description, hashtags[]
  social_pack jsonb,     -- instagram, facebook, linkedin, whatsapp, community
  carousel_json jsonb,   -- slides[]
  captions_json jsonb,   -- short, medium, long
  thumbnail_brief jsonb,
  thumbnail_url text,
  cta text,
  quality_score numeric,
  warnings jsonb,
  created_at timestamptz default now()
);

-- Tendências cacheadas por nicho/cidade (reduz chamadas Perplexity)
create table youtube_trends_cache (
  id uuid primary key default gen_random_uuid(),
  niche text not null,
  city text,
  trend_data jsonb not null,
  fetched_at timestamptz default now(),
  expires_at timestamptz not null,
  unique(niche, city)
);
```

**Índices recomendados:**
- `youtube_channels(user_id)`
- `youtube_content_plans(user_id, month, year)`
- `youtube_content_items(plan_id, scheduled_date)`
- `youtube_trends_cache(niche, city, expires_at)`

**RLS:** todas as tabelas específicas devem ter política `user_id = auth.uid()`. Para `is_premium`, aplicar policy adicional que bloqueia INSERT/UPDATE em `youtube_content_plans` quando `users.is_premium = FALSE`.

---

## 9. Prompt contracts

### 9.1 System prompt padrão (skill Premium)
```
Você é um agente da SextouTools PRO executando o mini-app Premium YouTube Growth Studio AI.
Sua função é produzir artefatos comerciais profissionais para empreendedores brasileiros nos EUA que querem transformar o YouTube em ativo de negócio.
Siga exatamente o contrato de saída solicitado.
Não exponha raciocínio interno.
Não invente dados factuais sensíveis (leis, impostos, preços).
Quando houver risco jurídico, financeiro, médico ou imigratório, inclua aviso de revisão profissional.
Responda no idioma solicitado pelo usuário.
Considere contexto cultural BR-EUA (bilinguismo, sazonalidade americana, datas comemorativas da comunidade).
```

### 9.2 Planner contract
**Input:** `business_context` + `trends`
**Output:**
```json
{
  "strategy_summary": "...",
  "monthly_theme": "...",
  "content_pillars": [],
  "calendar": [
    {
      "date": "2026-07-03",
      "item_type": "video",
      "working_title": "...",
      "pillar": "...",
      "goal": "lead|authority|sale",
      "hook_suggestion": "..."
    }
  ]
}
```

### 9.3 Creator (roteiro) contract
**Output:**
```json
{
  "hook": "primeiros 2 segundos",
  "intro": "...",
  "sections": [
    {"title": "...", "talking_points": [], "duration_sec": 30}
  ],
  "cta": "...",
  "closing": "...",
  "broll_suggestions": [],
  "total_duration_sec": 480
}
```

### 9.4 SEO contract
**Output:**
```json
{
  "titles": [
    {"variant": "curiosity", "text": "...", "estimated_ctr": "high"},
    {"variant": "authority", "text": "..."},
    {"variant": "seo", "text": "..."}
  ],
  "description": {
    "summary": "...",
    "timestamps": [],
    "links": [],
    "keywords": []
  },
  "hashtags": {"primary": [], "local": [], "niche": []}
}
```

### 9.5 Social adapter contract
**Output:**
```json
{
  "instagram": {"caption": "...", "carousel_slides": []},
  "facebook": {"post": "..."},
  "linkedin": {"post": "..."},
  "whatsapp": {"message": "..."},
  "youtube_community": {"post": "..."},
  "captions": {"short": "...", "medium": "...", "long": "..."}
}
```

### 9.6 Reviewer contract
**Output:**
```json
{
  "quality_score": 8.7,
  "checks": [
    {"name": "hook_strength", "pass": true},
    {"name": "cultural_fit", "pass": true},
    {"name": "no_overclaim", "pass": true},
    {"name": "cta_clarity", "pass": true}
  ],
  "warnings": [],
  "suggested_edits": []
}
```

---

## 10. Controle de custo

- **Custo estimado por execução (plano mensal completo):**
  - LLMs: ~$0.18–$0.45 (planner + 8 roteiros + SEO + social + reviewer)
  - YouTube Data API: ~$0.00 (quota gratuita)
  - Perplexity/Tavily: ~$0.02–$0.05
  - Thumbnail (se gerada): ~$0.08
  - PDF export: ~$0.02
  - **Total estimado:** $0.30–$0.60 por plano mensal
- **Limites por plano Premium:**
  - 20 planos mensais/mês no plano Pro
  - 50 planos mensais/mês no plano Business
  - 100 thumbnails/mês
- **Alertas:**
  - 80% do limite mensal → notificação in-app
  - 100% → bloqueio com opção de upgrade
  - Custo diário anômalo (>5x média) → alerta admin
- **Estratégia de fallback:**
  - Se Anthropic falhar → OpenAI
  - Se Perplexity falhar → Tavily → cache local
  - Se Image API falhar → entregar só o briefing (sem imagem)
  - Se DocRaptor falhar → Puppeteer server-side

---

## 11. Segurança e compliance

- **Dados sensíveis:** o app pode receber nome de negócio, cidade, oferta — **não** coleta SSN, documentos, dados financeiros sensíveis.
- **Avisos necessários:**
  - “Conteúdo gerado por IA. Revise antes de publicar, especialmente claims sobre impostos, saúde, direito ou finanças.”
  - “Hashtags e tendências são sugestões — valide antes de usar.”
- **Revisão humana recomendada** quando:
  - Nicho = saúde, direito, contabilidade, imigração
  - Usuário marcar “content_restrictions” sensíveis
- **Retenção:**
  - Artefatos mantidos por 12 meses (ou conforme plano)
  - Usuário pode apagar histórico a qualquer momento (LGPD-friendly)
- **Chaves:** todas no servidor, via secrets. Nunca em client, logs ou export.
- **RLS:** obrigatório em todas as tabelas.
- **Rate limit:** 5 planos/máx 10 minutos por usuário; CAPTCHA em atividade suspeita.
- **Compliance BR-EUA:** respeitar LGPD e práticas de privacidade dos EUA; não enviar dados para provedores desnecessários.

---

## 12. Critérios de aceite

- [ ] Exige login.
- [ ] Bloqueia acesso quando `users.is_premium = FALSE` (mostra tela de upgrade).
- [ ] Usa Design System v2 (Bricolage Grotesque, Inter, JetBrains Mono, tema escuro, gradiente de marca).
- [ ] Funciona mobile-first (toque ≥ 48px, CTA 54px, uma decisão por tela).
- [ ] Usa stepper amigável da v2.
- [ ] Coach tips em cada fase.
- [ ] Usa dropdowns, presets e exemplos (nicho, cidade, tom).
- [ ] Usa roteamento Premium de modelos (múltiplos provedores).
- [ ] Registra `premium_llm_calls` e `premium_tool_calls`.
- [ ] Calcula custo por execução e grava no `premium_cost_ledger`.
- [ ] Salva histórico em `youtube_content_plans` e `youtube_content_items`.
- [ ] Permite versionar artefatos (`artifact_versions`).
- [ ] Gera artefato exportável (PDF, DOCX, CSV, ZIP, Markdown).
- [ ] Permite regenerar seção específica sem refazer tudo.
- [ ] Protege API keys (somente no servidor).
- [ ] Tem fallback para cada provedor crítico.
- [ ] Tem erro amigável (sem “HTTP 429”, com explicação e próximo passo).
- [ ] Tem tela de celebração na entrega (gradiente + emoji + foco no download).
- [ ] Tem aviso de revisão profissional para nichos sensíveis.
- [ ] RLS aplicado em todas as tabelas específicas.
- [ ] Respeita restrições de conteúdo marcadas pelo usuário.
- [ ] Funciona em PT-BR, EN-US e bilíngue.
- [ ] Integra YouTube Data API para tendências e palavras-chave.
- [ ] Codex, Claude Code e Antigravity conseguem implementar com passos claros.

---

## 13. App manifest Premium

```yaml
app:
  name: "YouTube Growth Studio AI"
  slug: "youtube-growth-studio"
  suite: "SextouTools Premium"
  category: "Marketing / Creator Economy"
  artifact_types:
    - content_calendar
    - video_script
    - seo_pack
    - social_posts
    - carousel
    - captions
    - thumbnail_brief
    - thumbnail_image
  requires_auth: true
  requires_premium_plan: true        # users.is_premium = TRUE
  mobile_first: true

llm:
  mode: premium_multi_model
  routing_profile: balanced
  default_language: pt-BR
  supported_languages: [pt-BR, en-US, bilingual]

agents:
  runtime:
    - context_agent
    - trend_agent
    - planner_agent
    - scriptwriter_agent
    - seo_agent
    - social_adapter_agent
    - visual_brief_agent
    - thumbnail_agent
    - compliance_agent
    - export_agent
    - quality_agent

integrations:
  required:
    - llm_text_provider
    - youtube_data_api
    - perplexity_or_tavily
    - storage_provider
  optional:
    - image_generation_provider
    - pdf_export_provider
    - deepl_translation
    - youtube_analytics_api   # fase 2

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
  human_review_required: false       # true para nichos sensíveis
  sensitive_category: conditional    # contabilidade, saúde, direito, imigração
```

---

## 14. Checklist de implementação (para Codex / Claude Code / Antigravity)

### Produto
- [ ] App pertence à suite SextouTools Premium
- [ ] Gera pacote editorial utilizável (não é chat)
- [ ] Promessa clara: “plano completo em minutos”
- [ ] Público definido: empreendedores BR nos EUA
- [ ] Bloqueio para `is_premium = FALSE` com tela de upgrade

### UX/UI (Design System v2)
- [ ] Mobile-first, toque ≥ 48px, CTA 54px
- [ ] Bricolage Grotesque em títulos, Inter no corpo, JetBrains Mono em dados
- [ ] Tema escuro + gradiente `#FF3D57 → #FF8C00` apenas em CTA, logo e entrega
- [ ] Stepper amigável substituindo barra densa
- [ ] Coach tips em cada fase
- [ ] Dropdowns com presets (nicho, cidade, tom)
- [ ] Preview em tempo real do calendário
- [ ] Tela de celebração com gradiente e foco no download
- [ ] Erros amigáveis (sem códigos técnicos)

### LLM e agentes
- [ ] Múltiplos provedores (Anthropic, OpenAI, Gemini)
- [ ] Roteamento por tarefa (planner, writer, SEO, reviewer)
- [ ] Fallback automático por modalidade
- [ ] Prompt contracts separados por fase
- [ ] Revisão automática via `compliance_agent` + `quality_agent`
- [ ] Registro de tokens, custo, latência e modelo em `premium_llm_calls`

### APIs externas
- [ ] YouTube Data API para tendências e palavras-chave
- [ ] Perplexity/Tavily para pesquisa regional
- [ ] Image API opcional para thumbnails
- [ ] DocRaptor/PDFShift para exportação
- [ ] Todas com fallback e custo estimado

### Banco e histórico
- [ ] Salva `mini_app_runs` + `premium_app_runs`
- [ ] Salva `youtube_channels` (perfil reutilizável)
- [ ] Salva `youtube_content_plans` + `youtube_content_items`
- [ ] Salva `generated_artifacts` + `artifact_versions`
- [ ] RLS por usuário em todas as tabelas
- [ ] Policy adicional bloqueia uso quando `is_premium = FALSE`

### Segurança
- [ ] API keys apenas no servidor
- [ ] Logs sanitizados (sem PII desnecessária)
- [ ] Detecção de nichos sensíveis → aviso de revisão
- [ ] Rate limit + CAPTCHA em abuso
- [ ] Alertas de custo anômalo para admin
- [ ] Usuário pode apagar histórico

### Compatibilidade com agentes de desenvolvimento
- [ ] Codex consegue ler o PRD e gerar schema + rotas + UI
- [ ] Claude Code consegue criar subagentes (architecture, backend, frontend, db, security, qa)
- [ ] Antigravity consegue executar com evidências (plano, checklist, logs)
- [ ] Skill não depende de ferramenta específica
- [ ] Tarefas quebradas em passos verificáveis

---

