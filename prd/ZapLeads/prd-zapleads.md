# Mini-App Premium PRD: Sextou ZapLeads — CRM de WhatsApp com Funil Frio→Quente

> **Status:** Draft v1.0 · pronto para handoff de desenvolvimento
> **Suite:** SextouTools Premium
> **Skill base:** `software-premium-params` v1.0.0
> **Design System:** v2 (SextouViral / SextouTools Premium)
> **Idioma do produto:** pt-BR (UI), multilíngue na geração de mensagens

---

## ⚠️ Aviso de viabilidade legal e técnica (ler antes de tudo)

Este produto envolve **dados pessoais de terceiros** e **automação do WhatsApp**. Há dois riscos materiais que moldam todo o desenho do PRD e **não podem ser ignorados**:

1. **Termos de Uso do WhatsApp / Meta.** A extração automatizada de membros de grupos e o disparo em massa por automação de WhatsApp Web (bibliotecas tipo `whatsapp-web.js` / Baileys) **violam os Termos do WhatsApp** e expõem o número a **banimento**. A API oficial (WhatsApp Business Cloud API) **não permite** ler a lista de membros de grupos nem disparo frio sem opt-in via template aprovado.
2. **LGPD (Lei 13.709/2018).** Coletar telefone + nome de pessoas em grupos e usá-los para prospecção é **tratamento de dado pessoal**. Exige base legal (legítimo interesse ou consentimento), finalidade declarada, direito de oposição (opt-out) e registro. Disparo frio sem cuidado pode configurar infração e gerar denúncia/ANPD.

**Decisão de produto:** o ZapLeads é entregue com **dois modos de operação** e o compliance é parte do núcleo, não um adendo:

| Modo | Canal | Extração de grupo | Disparo | Risco | Uso recomendado |
| --- | --- | --- | --- | --- | --- |
| **Modo Web (não oficial)** | WhatsApp Web automatizado | Sim (o que o usuário pediu) | Frio possível | **Alto** (ban + LGPD) | Número secundário, volume baixo, sob aceite de risco |
| **Modo Oficial (recomendado)** | WhatsApp Business Cloud API | Não (proibido) | Só com opt-in/template | Baixo | Escala e operação séria |

O PRD especifica o **Modo Web** porque foi o pedido explícito, mas trata o **Modo Oficial** como caminho de maturidade e mantém *opt-out, consentimento e limites* obrigatórios nos dois modos. Isto está alinhado aos princípios 4.9 (human-in-the-loop) e seção 12 (segurança/compliance) da skill base.

---

## 1. Visão geral

- **Nome:** Sextou ZapLeads
- **Suite:** SextouTools Premium
- **Slug:** `zapleads-crm`
- **Categoria:** CRM / Vendas / Prospecção
- **Usuário-alvo:** Empreendedores brasileiros (inclusive nos EUA), infoprodutores, prestadores de serviço, imobiliárias, agências e times de vendas pequenos que prospectam via WhatsApp e participam de grupos do nicho.
- **Dor principal:** Os prospects estão "soltos" em grupos de WhatsApp e em conversas avulsas. Não há banco organizado, não dá para saber quem é frio, quem respondeu, em que etapa cada um está, e o follow-up se perde. Planilha não escala e não avisa quando um contato esquenta.
- **Promessa:** *"Transforme grupos de WhatsApp em um funil de vendas vivo: extraia contatos frios, e no segundo em que alguém te responde, ele vira lead quente no topo da sua lista — com o próximo passo já sugerido pela IA."*
- **Artefato principal:** **Funil de leads qualificado e acionável** (banco de contatos frios → leads com status → exportações e mensagens prontas). Artefatos secundários: listas exportáveis (CSV/XLSX), mensagens de abordagem geradas por IA, resumos de conversa e relatórios de pipeline.

---

## 2. Resultado esperado

- **Artefatos gerados:**
  - Banco de **contatos frios** importados de grupos (com origem rastreável).
  - **Leads** classificados por status, com histórico e score de intenção.
  - **Mensagens de abordagem / follow-up** personalizadas por IA (multilíngue).
  - **Resumos de conversa** e **next-best-action** por lead.
  - **Relatórios de pipeline** e **exportações** (CSV, XLSX, JSON, integração CRM externo).
- **Formatos de exportação:** CSV, XLSX, JSON, Markdown (resumo), e push para HubSpot/Pipedrive via API (opcional).
- **Tempo esperado:**
  - Importar membros de um grupo: segundos a poucos minutos (depende do tamanho/limites).
  - Promoção frio→quente: **tempo real** (evento de mensagem recebida).
  - Geração de mensagem por IA: 2–8s.
- **Ações pós-resultado:** copiar, baixar, regenerar mensagem, mover de etapa, agendar follow-up, favoritar, exportar, descadastrar (opt-out), arquivar.

---

## 3. Fluxo mobile-first

O fluxo segue o stepper amigável do Design System v2 (uma decisão por tela, toque ≥48px, CTA gradiente só na ação-chave).

1. **Entrada / Login** — autenticação obrigatória (suite Premium).
2. **Conectar WhatsApp** — QR code (Modo Web) ou onboarding da Cloud API (Modo Oficial). Aceite de risco no Modo Web.
3. **Escolher grupos** — lista de grupos de que o usuário participa; seleção de quais extrair.
4. **Configurar extração** — filtros (excluir admins, excluir já existentes, limite por execução), e **aceite de finalidade/consentimento**.
5. **Revisar antes de importar** — preview da contagem e dos campos; aviso de privacidade.
6. **Importar (Premium run)** — extração com limites e barra de progresso amigável.
7. **Banco de frios** — contatos entram como `frio`. Coach tip orienta a primeira abordagem.
8. **Abordagem** — escolher template ou gerar mensagem por IA; disparo com cadência segura (anti-ban).
9. **Esquenta automático** — qualquer resposta/interação promove o contato a **lead quente** e o joga no topo do funil, com celebração e som leve.
10. **Funil / Kanban** — acompanhar status, ver resumo da conversa, aceitar próxima ação sugerida.
11. **Histórico & versões** — toda execução, mensagem e mudança de status ficam salvas e reabríveis.
12. **Exportação** — listas, relatórios e push para CRM externo.

> **Princípio de UX (v2):** falha é direção. Se um disparo falha por limite/ban, a mensagem explica o que houve e o próximo passo ("aguarde X min, não foi cobrado"). Nada de erro de sistema cru na cara do usuário.

---

## 4. Campos do formulário

### 4.1 Conexão do WhatsApp
| Campo | Tipo | Obrigatório | Opções | Observação |
| --- | --- | --- | --- | --- |
| Modo de operação | dropdown | Sim | Web (não oficial) · Oficial (Cloud API) | Default: Oficial. Web exige aceite de risco. |
| Número/sessão | leitura (QR) | Sim | — | Modo Web: pareamento via QR. Oficial: WABA/phone_id. |
| Aceite de risco | checkbox | Sim (Web) | — | Texto de risco de ban + LGPD; registra consentimento. |

### 4.2 Extração de grupo
| Campo | Tipo | Obrigatório | Opções | Observação |
| --- | --- | --- | --- | --- |
| Grupo(s) | multi-select | Sim | lista de grupos do usuário | Só grupos de que ele participa. |
| Finalidade declarada | dropdown | Sim | Prospecção · Convite evento · Pós-venda · Pesquisa | Base de legítimo interesse/consentimento (LGPD). |
| Excluir admins | toggle | Não | on/off | Default: on. |
| Excluir já no banco | toggle | Não | on/off | Default: on (evita duplicar). |
| Limite por execução | dropdown | Sim | 50 · 100 · 250 · 500 | Anti-ban e controle de custo. |
| Tags iniciais | input/chips | Não | livre | Ex.: "grupo imobiliária SP". |

### 4.3 Abordagem / mensagem
| Campo | Tipo | Obrigatório | Opções | Observação |
| --- | --- | --- | --- | --- |
| Objetivo da mensagem | dropdown | Sim | Apresentar · Oferta · Convite · Reativar · Qualificar | Vira contexto do prompt. |
| Tom | dropdown | Sim | Próximo · Profissional · Direto · Consultivo | |
| Idioma | dropdown | Sim | pt-BR · en-US · es | Default pt-BR. |
| Template base | dropdown | Não | biblioteca de templates | Editável; presets reduzem decisão. |
| Personalização por contato | toggle | Não | on/off | Usa nome/origem do grupo. |
| Janela de envio | dropdown | Sim | Agora · Horário comercial · Agendar | Cadência segura. |

### 4.4 Funil / lead
| Campo | Tipo | Obrigatório | Opções | Observação |
| --- | --- | --- | --- | --- |
| Status | dropdown | Sim | ver §4.5 | Mudança gera histórico. |
| Responsável | dropdown | Não | usuários da conta | Para times. |
| Próximo follow-up | date/time | Não | — | Lembrete. |
| Valor estimado | número | Não | — | Pipeline/forecast. |
| Notas | textarea | Não | — | |

### 4.5 Status do funil (máquina de estados)
`frio` → `contatado` → **`quente`** (gatilho: respondeu/interagiu) → `qualificado` → `em_negociacao` → `ganho` | `perdido`
Estados transversais: `opt_out` (descadastrado — terminal para abordagem), `invalido` (número inexistente), `arquivado`.

> O coração do produto é a transição automática **→ `quente`**: qualquer mensagem recebida, reação ou clique de um contato no banco dispara um evento que promove o registro a lead quente, recalcula o score e o move para o topo do funil.

---

## 5. Configuração de LLMs

`llm_mode: premium_multi_model` · `routing_strategy: balanced` · `fallback_strategy: same_modality_lower_cost`

| Fase | Provedor sugerido | Modelo/Capacidade | Motivo | Fallback |
| --- | --- | --- | --- | --- |
| **classifier** (esquenta/intenção) | OpenAI | modelo rápido + JSON schema | Classificar resposta recebida: intenção, sentimento, "quente/morno/frio", objeção | Gemini Flash / Claude Haiku |
| **writer** (abordagem & follow-up) | Anthropic | Claude Sonnet (latest) | Copy natural, multilíngue, tom de marca | GPT-4o-mini / Gemini Pro |
| **summarizer** (resumo de conversa) | Google | Gemini Pro (long context) | Resumir threads longas + next action | Claude Haiku |
| **enrichment** (persona pelo grupo) | OpenAI | modelo barato + JSON | Inferir persona/segmento a partir do nome do grupo e perfil | regras determinísticas |
| **reviewer** (compliance da mensagem) | Google | Gemini Pro | Checar claim proibido, spam, tom agressivo, idioma | Claude Sonnet |

**Regra (princípio 4.4 / 19):** não usar LLM para o que código resolve. Deduplicação, normalização de telefone (E.164), detecção de opt-out por palavra-chave e roteamento de status são **determinísticos**. LLM só onde há linguagem natural ou julgamento.

---

## 6. Agentes operacionais

| Agente | Função | Entrada | Saída | Ferramentas/APIs |
| --- | --- | --- | --- | --- |
| `extraction_agent` | Lê membros do grupo e normaliza | group_id, filtros | contatos normalizados (E.164) | WhatsApp (Web/Cloud), regras |
| `dedupe_agent` | Remove duplicados e inválidos | contatos brutos | contatos limpos + flags | determinístico |
| `enrichment_agent` | Infere persona/segmento | contato + contexto grupo | tags/persona | LLM enrichment |
| `outreach_agent` | Gera mensagem de abordagem | objetivo, tom, idioma, contato | texto + variações | LLM writer + reviewer |
| `dispatch_agent` | Envia com cadência segura | mensagem, fila, limites | status de envio | WhatsApp + rate limiter |
| `heat_agent` | Detecta interação e promove a quente | evento inbound | novo status + score | classifier LLM + regras |
| `summarizer_agent` | Resume conversa e sugere próxima ação | thread | resumo + next action | LLM summarizer |
| `compliance_agent` | Opt-out, PII, consentimento, limites | qualquer evento | bloqueio/aviso/log | regras + reviewer LLM |

**Regras (§8.4):** cada agente tem papel claro, entrada/saída estruturadas, registra custo e status; nenhum agente acessa API sem permissão da config do app; etapas de fila idempotentes; nenhum comando de sistema no runtime do produto.

---

## 7. APIs externas potencializadoras

| API | Uso | Obrigatória no MVP? | Custo/Risco | Fallback |
| --- | --- | --- | --- | --- |
| **WhatsApp Web (não oficial)** | Extração de grupo + envio (Modo Web) | Sim (modo pedido) | **Alto: ban + ToS + LGPD** | Migrar p/ Cloud API |
| **WhatsApp Business Cloud API** | Envio com opt-in (Modo Oficial) | Recomendada | Custo por conversa; sem extração de grupo | Modo Web |
| LLM texto (OpenAI/Anthropic/Gemini) | Classificação, copy, resumo | Sim | Custo por token | Provedor alternativo |
| Supabase / Cloudflare R2 / S3 | Storage de exports e mídia | Sim | Baixo | — |
| Sentry / Axiom | Erros, traces, logs sanitizados | Sim | Baixo | Logtail |
| PostHog | Funil de uso e métricas de produto | Não | Baixo | GA4 |
| HubSpot / Pipedrive | Exportar leads para CRM externo | Não | Médio | CSV/XLSX |
| Validação de número (ex. Twilio Lookup) | Marcar inválidos antes de enviar | Não | Baixo | heurística |

**Regra de escolha (§9.2):** nenhuma API paga entra no MVP sem melhorar o artefato, ter fallback e custo estimável. Validação de número e enrichment ficam como *enhancers* opcionais.

---

## 8. Banco de dados

### 8.1 Tabelas base (skill base)
`mini_apps`, `mini_app_runs` — registro do app na suite e de cada execução.

### 8.2 Tabelas Premium (herdadas da skill)
`premium_app_runs`, `premium_llm_calls`, `premium_tool_calls`, `generated_artifacts`, `artifact_versions`, `premium_cost_ledger`, `user_premium_limits`, `premium_model_providers`, `premium_model_configs`, `premium_api_integrations`.

### 8.3 Tabelas específicas do ZapLeads

```sql
-- Conexões de WhatsApp do usuário (sessão Web ou WABA oficial)
create table zap_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  mode text not null check (mode in ('web','official')),
  display_number text,
  waba_phone_id text,           -- modo oficial
  session_ref text,             -- modo web: referência opaca à sessão (NUNCA credencial em claro)
  status text default 'disconnected',
  risk_acknowledged_at timestamptz, -- aceite de risco (modo web)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Grupos do usuário e execuções de extração
create table zap_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid references zap_connections(id),
  external_group_id text not null,
  name text,
  member_count integer,
  last_extracted_at timestamptz,
  created_at timestamptz default now()
);

create table zap_group_extractions (
  id uuid primary key default gen_random_uuid(),
  premium_run_id uuid references premium_app_runs(id),
  user_id uuid not null,
  group_id uuid references zap_groups(id),
  declared_purpose text not null,   -- finalidade LGPD
  limit_applied integer,
  total_found integer,
  total_imported integer,
  total_skipped integer,
  created_at timestamptz default now()
);

-- Banco de CONTATOS FRIOS
create table contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  phone_e164 text not null,
  display_name text,
  source_type text default 'group',     -- group | manual | import
  source_group_id uuid references zap_groups(id),
  persona text,
  tags text[],
  is_valid boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, phone_e164)           -- dedupe por usuário
);

-- LEADS (contato promovido ao funil)
create table leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  contact_id uuid not null references contacts(id),
  status text not null default 'frio'
    check (status in ('frio','contatado','quente','qualificado','em_negociacao','ganho','perdido','opt_out','invalido','arquivado')),
  heat_score integer default 0,          -- 0..100
  owner_id uuid,                         -- responsável (times)
  estimated_value numeric,
  next_followup_at timestamptz,
  first_contacted_at timestamptz,
  became_hot_at timestamptz,             -- carimbo do esquenta
  last_interaction_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Histórico de mudança de status (auditoria do funil)
create table lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  from_status text,
  to_status text not null,
  reason text,                           -- 'inbound_reply','manual','auto_heat','optout'
  changed_by uuid,                       -- null = sistema
  created_at timestamptz default now()
);

-- Eventos/interações que esquentam o lead
create table lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  user_id uuid not null,
  event_type text not null,              -- 'inbound_message','reaction','link_click','call'
  payload jsonb,
  detected_intent text,                  -- da classificação LLM
  sentiment text,
  created_at timestamptz default now()
);

-- Mensagens trocadas (thread por lead)
create table messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  user_id uuid not null,
  direction text not null check (direction in ('out','in')),
  channel text default 'whatsapp',
  body text,
  template_id uuid,
  ai_generated boolean default false,
  status text,                           -- queued|sent|delivered|read|failed
  external_message_id text,
  created_at timestamptz default now()
);

create table message_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  objective text,
  tone text,
  language text default 'pt-BR',
  body text not null,                    -- com placeholders {{nome}}
  is_approved boolean default false,     -- aprovado p/ Cloud API
  created_at timestamptz default now()
);

-- Consentimento e opt-out (LGPD) — terminal para abordagem
create table consent_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  contact_id uuid references contacts(id),
  action text not null,                  -- 'purpose_declared','opt_out','opt_in'
  basis text,                            -- 'legitimate_interest','consent'
  source text,
  created_at timestamptz default now()
);
```

### 8.4 Índices recomendados
- `contacts (user_id, phone_e164)` único; `contacts (user_id, source_group_id)`.
- `leads (user_id, status)`; `leads (user_id, heat_score desc)`; `leads (user_id, next_followup_at)`.
- `lead_events (lead_id, created_at desc)`; `messages (lead_id, created_at)`.
- `consent_log (contact_id, action)`.

### 8.5 RLS / segurança
- RLS por `user_id` em **todas** as tabelas; em times, escopo por conta + `owner_id`.
- `session_ref` e qualquer credencial **nunca** em claro; só referência a secret no servidor.
- `consent_log` e `lead_status_history` são *append-only* (auditoria).

---

## 9. Prompt contracts

Pipeline: `input → classifier → writer → reviewer → exporter`. Evitar prompt único gigante. Saída **JSON validável** sempre que possível.

### 9.1 System prompt padrão
```text
Você é um agente da SextouTools PRO executando o mini-app Premium "Sextou ZapLeads".
Sua função é apoiar prospecção e relacionamento comercial de forma ética e eficaz.
Siga exatamente o contrato de saída solicitado. Não exponha raciocínio interno.
Nunca produza mensagem enganosa, spam agressivo, falsa urgência ilegal ou claim proibido.
Respeite opt-out e a finalidade declarada. Responda no idioma solicitado; se ausente, pt-BR.
Quando houver risco jurídico, financeiro, médico ou de compliance, inclua aviso de revisão.
```

### 9.2 Classifier (esquenta) — saída JSON
```json
{
  "is_hot": true,
  "heat_score": 0,
  "intent": "interesse|duvida|objecao|agendamento|recusa|spam|fora_de_escopo",
  "sentiment": "positivo|neutro|negativo",
  "suggested_status": "quente|contatado|qualificado|perdido|opt_out",
  "optout_detected": false,
  "next_action_hint": ""
}
```

### 9.3 Writer (abordagem/follow-up) — saída JSON
```json
{
  "language": "pt-BR",
  "variants": [
    { "label": "Próximo", "body": "" },
    { "label": "Direto", "body": "" }
  ],
  "personalization_used": ["nome","grupo_origem"],
  "warnings": []
}
```

### 9.4 Reviewer (compliance da mensagem)
```text
Revisar a mensagem para: claim proibido, promessa exagerada, tom agressivo/spam,
consistência de idioma, presença de identificação e caminho de opt-out.
Retornar: { "approved": bool, "issues": [], "fixed_body": "" }.
```

### 9.5 Summarizer (resumo de conversa)
```json
{ "summary": "", "stage_guess": "", "next_best_action": "", "objections": [] }
```

### 9.6 Revisão automática obrigatória
Toda mensagem gerada passa por reviewer: clareza, adequação ao público, tom de marca, idioma, risco de promessa exagerada, presença de opt-out. App **não** é chat aberto: o foco é gerar e mover leads.

---

## 10. Controle de custo

- **Custo estimado por execução:**
  - Extração de grupo: custo de infraestrutura desprezível; custo de risco (ban) é o relevante → mitigado por limites.
  - Classificação de inbound: ~1 chamada LLM curta por mensagem recebida.
  - Geração de abordagem: 1 writer + 1 reviewer por mensagem.
  - Resumo: 1 chamada por solicitação (não automática em toda mensagem).
- **Limites por plano (`user_premium_limits`):** runs/mês, contatos importados/mês, mensagens IA/mês, storage MB, versões de artefato.
- **Alertas:** alerta ao admin da suite em pico de custo; alerta ao usuário ao se aproximar do limite (mensagem amigável, não "quota exceeded" cru).
- **Estratégia de fallback:** classifier cai para modelo mais barato; writer cai de provedor; se LLM indisponível, abordagem usa template determinístico e marca para revisão.
- **Anti-abuso/anti-ban:** rate limit de envio por minuto/hora/dia, warming de número, intervalo aleatório entre mensagens, captcha em atividade suspeita, bloqueio ao atingir limite.

---

## 11. Segurança e compliance

- **Dados sensíveis:** telefones e nomes de terceiros (PII). Tratar como dado pessoal sob LGPD.
- **Bases e finalidade:** registrar finalidade declarada por extração; base legal (legítimo interesse ou consentimento). Sem finalidade, não importa.
- **Opt-out obrigatório:** detecção automática de palavras de descadastro ("pare", "sair", "não quero", "remover") → status `opt_out` terminal; nenhum disparo posterior. Mensagens de abordagem incluem caminho de saída.
- **Avisos necessários:** aviso de risco de ban (Modo Web), aviso de privacidade na importação, aviso de que prospecção fria tem risco regulatório.
- **Revisão humana:** disparo em massa exige confirmação humana (human-in-the-loop) antes de enfileirar. Reviewer LLM não substitui o aceite do usuário.
- **Credenciais:** API keys e sessão WhatsApp só em secrets do servidor; nunca em client, logs, prompts, exports ou histórico. Usar `provider_slug`/`secret_ref`.
- **Logs:** IDs, status, provedor, modelo, fase, latência, custo, erro sanitizado. **Sem** PII desnecessária, sem credencial, sem conteúdo integral sensível.
- **Retenção:** permitir apagar contatos/leads e histórico; respeitar pedido de exclusão (direito do titular).
- **Não fazer:** vender/compartilhar a base com terceiros; usar dados fora da finalidade; disparar para `opt_out`/`invalido`.

> **Posição honesta para o stakeholder:** o Modo Web atende ao pedido, mas é frágil (ban) e arriscado (LGPD). Para operar com segurança em escala, o caminho é **Cloud API + opt-in**. O produto deve empurrar o usuário para a prática conforme, não apenas viabilizar a arriscada.

---

## 12. Critérios de aceite

- [ ] Exige login (suite Premium).
- [ ] Usa o Design System v2 (tema escuro, Bricolage/Inter/Mono, gradiente de marca só em CTA/entrega).
- [ ] Funciona mobile-first (toque ≥48px, uma decisão por tela, stepper).
- [ ] Usa roteamento Premium de modelos por fase, com fallback.
- [ ] Registra LLM calls (`premium_llm_calls`).
- [ ] Registra tool calls / chamadas WhatsApp (`premium_tool_calls`).
- [ ] Calcula e mostra custo por execução; respeita `user_premium_limits`.
- [ ] Salva histórico (execuções, mensagens, mudanças de status).
- [ ] Gera artefatos exportáveis (CSV/XLSX/JSON + push CRM opcional).
- [ ] Permite reabrir, regenerar e versionar mensagens/relatórios.
- [ ] Protege API keys e sessão (nada no client/logs).
- [ ] Tem fallback de modelo e de canal.
- [ ] Tem erros amigáveis (sem "HTTP 429" cru).
- [ ] **Promoção frio→quente em tempo real** funciona em qualquer interação inbound.
- [ ] **Opt-out** detectado e respeitado de forma terminal.
- [ ] Aceite de risco + finalidade registrados antes de extrair/disparar.

---

## 13. App manifest

```yaml
app:
  name: "Sextou ZapLeads"
  slug: "zapleads-crm"
  suite: "SextouTools Premium"
  category: "CRM"
  artifact_types:
    - lead_funnel
    - contact_export
    - outreach_message
    - conversation_summary
    - pipeline_report
  requires_auth: true
  requires_premium_plan: true
  mobile_first: true

llm:
  mode: premium_multi_model
  routing_profile: balanced
  default_language: pt-BR
  supported_languages: [pt-BR, en-US, es]

agents:
  runtime:
    - extraction_agent
    - dedupe_agent
    - enrichment_agent
    - outreach_agent
    - dispatch_agent
    - heat_agent
    - summarizer_agent
    - compliance_agent

integrations:
  required:
    - llm_text_provider
    - whatsapp_channel        # web (não oficial) OU cloud api (oficial)
    - storage_provider
  optional:
    - external_crm_provider   # hubspot/pipedrive
    - phone_validation_provider
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
  human_review_required: true     # disparo em massa exige confirmação
  sensitive_category: true        # PII de terceiros + risco regulatório
```

---

## 14. Roadmap sugerido

- **MVP (Modo Web, volume baixo):** conectar, extrair grupo, banco de frios, abordagem por template/IA, esquenta automático, funil Kanban, export CSV.
- **V1.1:** resumo de conversa, next-best-action, agendamento de follow-up, relatórios de pipeline.
- **V1.2 (conformidade):** Modo Oficial (Cloud API), templates aprovados, opt-in, push para HubSpot/Pipedrive.
- **V2:** times/colaboração, automações de cadência, dashboards de conversão, validação de número.

---

## 15. Checklist de handoff para agentes de desenvolvimento

### Codex / Claude Code / Antigravity
- [ ] Ler o repositório, identificar stack, auth, design system e padrões antes de mudar.
- [ ] Criar plano por etapas; mudanças pequenas e revisáveis.
- [ ] Implementar canais WhatsApp **server-side** (sessão e keys fora do client).
- [ ] Subagentes lógicos: `architecture`, `backend`, `frontend`, `db`, `security`, `qa`.
- [ ] Explicar riscos de custo/segurança/ban/LGPD antes de integrar disparo.
- [ ] Migrations e disparos reais isolados em ambiente seguro; comandos destrutivos exigem confirmação.
- [ ] Entregar com lint, typecheck, testes e build verdes; produzir evidências (logs, screenshots).
- [ ] Nunca expor sessão WhatsApp ou API key em prompts, commits ou logs.

> **Comando mental (skill §18):** este app gera artefato real (funil/leads)? Pertence à suite Premium? Tem login, design system e mobile-first? Tem histórico/versão? Quais LLMs por etapa? Quais APIs realmente melhoram? Qual o custo por execução? Há fallback? Há risco jurídico/privacidade? As chaves estão protegidas? O resultado é exportável? Os agentes conseguem implementar em passos claros? — Se algo crítico for "não", ajustar antes de aprovar.
