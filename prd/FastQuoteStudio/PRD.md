```markdown
---
title: "PRD — Gerador de Proposta Premium"
slug: proposal-premium
suite: Sextou.biz Premium Suite
version: 1.0.0
owner: SextouTools PRO
language: pt-BR
skill: software-premium-params
compatible_with:
  - Codex
  - Claude Code
  - Google Antigravity
created_at: 2026-06-19
status: draft
---

# Mini-App Premium PRD: Gerador de Proposta Premium

## 1. Visão geral

- **Suite:** Sextou.biz Premium Suite
- **Slug:** `proposal-premium`
- **Categoria:** Comercial / Vendas
- **Usuário-alvo:** Prestadores de serviço, empreiteiros, designers, freelancers, agências, consultores B2B e profissionais autônomos que precisam enviar orçamentos profissionais com frequência.
- **Dor principal:** Orçamentos manuais em Word/Excel são lentos, feios, inconsistentes e não convertem. O profissional perde horas formatando e ainda entrega PDFs amadores.
- **Promessa:** *"Envie uma proposta elegante em PDF em menos de 3 minutos — a partir de fotos e um checklist."*
- **Artefato principal:** PDF de proposta comercial com capa, escopo, lista de materiais, cronograma, investimento, termos e assinatura.
- **Gate de acesso:** `users.is_premium = TRUE` (verificado no auth guard server-side).

---

## 2. Resultado esperado

- **Artefatos gerados:**
  - PDF da proposta (principal)
  - Versão web compartilhável (link público)
  - Resumo JSON estruturado
  - Miniatura (thumbnail) da capa
- **Formatos de exportação:** PDF (principal), DOCX (opcional), link público, Markdown (backup).
- **Tempo esperado de geração:** 40–90 segundos por proposta.
- **Ações pós-resultado:**
  - Baixar PDF
  - Copiar link público
  - Enviar por e-mail (Resend) ou WhatsApp (link wa.me)
  - Duplicar proposta
  - Favoritar
  - Versionar (editar e gerar nova versão)
  - Exportar para CRM (HubSpot, Pipedrive)

---

## 3. Fluxo mobile-first

1. **Entrada** — auth + verificação `users.is_premium = TRUE`
2. **Dados do cliente** — nome, empresa, contato (autocomplete de histórico)
3. **Upload de fotos** — dropzone com preview (obra/produto/serviço)
4. **Template de proposta** — dropdown (Serviço, Obra, Projeto, Consultoria, Produto)
5. **Checklist de itens/serviços** — com sugestão por IA a partir das fotos
6. **Lista de materiais** — tabela inline (quantidade + unidade + preço unitário)
7. **Escopo + observações** — texto livre com coach tip
8. **Revisão** — preview do PDF antes de gerar
9. **Geração Premium** — orquestrador + múltiplas LLMs
10. **Celebração + download** — tela de entrega com gradiente de marca
11. **Histórico e versões** — lista de propostas geradas

---

## 4. Campos do formulário

| Campo | Tipo | Obrigatório | Opções | Observação |
|---|---|---|---|---|
| Nome do cliente | text | ✅ | — | Autocomplete de histórico |
| Empresa do cliente | text | — | — | Opcional |
| Contato (e-mail/WhatsApp) | text | ✅ | — | Validação de formato |
| Template | dropdown | ✅ | Serviço · Obra · Projeto · Consultoria · Produto | Define tom e seções |
| Fotos | file (multi) | ✅ | até 10 · máx 8MB cada | Vision analisa para sugerir itens |
| Checklist de itens | multi-check + IA | ✅ | Sugestões dinâmicas | Editável pelo usuário |
| Materiais | tabela inline | ✅ | item · qtd · unidade · valor unit. | Soma calculada em tempo real |
| Escopo | textarea | ✅ | — | Coach tip: "Seja específico sobre entregas" |
| Prazo | text | ✅ | — | Ex.: "15 dias úteis" |
| Forma de pagamento | dropdown | ✅ | À vista · 2x · 3x · Entrada + parcelas · Personalizado | — |
| Validade da proposta | dropdown | ✅ | 7 · 15 · 30 dias | — |
| Observações | textarea | — | — | Termos, garantias, exclusões |
| Logo da empresa | file | — | PNG/SVG | Aparece no cabeçalho do PDF |
| Idioma | dropdown | — | pt-BR · en-US · es | — |

---

## 5. Configuração de LLMs

| Fase | Provedor | Modelo/Capacidade | Motivo | Fallback |
|---|---|---|---|---|
| `planning` | Anthropic | `claude-sonnet-latest` | Estrutura a proposta a partir de fotos + checklist | OpenAI `gpt-5.1` |
| `vision` | OpenAI | `gpt-5.1-vision` | Analisa fotos para sugerir itens/materiais | Gemini Pro Vision |
| `writing` | Anthropic | `claude-sonnet-latest` | Redige escopo, descrições e termos com tom profissional | OpenAI `gpt-5.1` |
| `review` | Google | `gemini-pro-latest` | Revisa coerência, preços, riscos e clareza | Claude Haiku |
| `export` | Self | Puppeteer | Renderiza HTML → PDF com design elegante | DocRaptor |

**Routing profile:** `quality_first` (proposta comercial exige texto impecável).
**Fallback strategy:** `same_modality_lower_cost`.

```yaml
llm:
  mode: premium_multi_model
  routing_profile: quality_first
  fallback_strategy: same_modality_lower_cost
  default_language: pt-BR
  supported_languages: [pt-BR, en-US, es]
  models:
    planner:
      provider: anthropic
      model: claude-sonnet-latest
      temperature: 0.4
      max_output_tokens: 3000
    vision:
      provider: openai
      model: gpt-5.1-vision
      temperature: 0.3
    writer:
      provider: anthropic
      model: claude-sonnet-latest
      temperature: 0.7
      max_output_tokens: 5000
    reviewer:
      provider: google
      model: gemini-pro-latest
      temperature: 0.2
```

---

## 6. Agentes operacionais

| Agente | Função | Entrada | Saída | Ferramentas/APIs |
|---|---|---|---|---|
| `planner_agent` | Monta estrutura da proposta | fotos + template | JSON de seções | Vision LLM |
| `creator_agent` | Redige escopo e descrições | estrutura + checklist | `copy_blocks` | Writer LLM |
| `pricing_agent` | Valida totais e sugere margem | materiais | `totals` + `warnings` | cálculo determinístico |
| `compliance_agent` | Checa claims, garantias, LGPD | texto final | `warnings` | Reviewer LLM |
| `export_agent` | Gera PDF elegante | payload final | `file_url` | Puppeteer |
| `quality_agent` | Checklist final antes da entrega | artifact | `approved` / `warnings` | regras |

```yaml
agents:
  runtime:
    - planner_agent
    - creator_agent
    - pricing_agent
    - compliance_agent
    - export_agent
    - quality_agent
```

---

## 7. APIs externas potencializadoras

| API | Uso | MVP? | Custo/Risco | Fallback |
|---|---|---|---|---|
| Anthropic Claude | Escopo e texto | ✅ | ~$0.02/run | OpenAI `gpt-5.1` |
| OpenAI Vision | Análise de fotos | ✅ | ~$0.01/run | Gemini Vision |
| Gemini Pro | Revisão | ✅ | ~$0.005/run | Claude Haiku |
| Puppeteer (self) | HTML → PDF | ✅ | CPU/infra | DocRaptor |
| Cloudflare R2 | Storage de fotos/PDFs | ✅ | ~$0.002/run | S3 |
| Resend | Envio opcional por e-mail | ❌ | $0.001/e-mail | WhatsApp link |
| ZeroBounce | Validação de e-mail do cliente | ❌ | $0.008/val | skip |
| HubSpot / Pipedrive | Exportação para CRM | ❌ | $0 | — |

**Regra de escolha:** só entra no MVP se melhorar diretamente o artefato final.

---

## 8. Banco de dados

### 8.1 Tabelas base (suite)
- `users`
- `mini_apps`
- `mini_app_runs`

### 8.2 Tabelas Premium (reutilizadas)
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

### 8.3 Tabelas específicas do app

```sql
create table proposals (
  id uuid primary key default gen_random_uuid(),
  premium_run_id uuid references premium_app_runs(id),
  user_id uuid not null references users(id),
  client_name text not null,
  client_company text,
  client_contact text,
  template_slug text not null,
  photos jsonb,              -- [{url, caption, analyzed_items[]}]
  checklist jsonb,           -- [{label, checked, suggested_by_ai}]
  materials jsonb,           -- [{item, qty, unit, unit_price, total}]
  scope_text text,
  deadline text,
  payment_terms text,
  validity_days int,
  notes text,
  company_logo_url text,
  language text default 'pt-BR',
  totals jsonb,              -- {materials, services, discount, total}
  status text default 'draft', -- draft · generating · ready · shared
  created_at timestamptz default now()
);

create table proposal_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  name text not null,
  company text,
  contact text,
  last_proposal_at timestamptz,
  proposals_count int default 0
);

-- Índices
create index proposals_user_id_idx on proposals(user_id);
create index proposals_created_at_idx on proposals(created_at desc);
create index proposal_clients_user_id_idx on proposal_clients(user_id);
```

### 8.4 RLS e segurança
- Todas as tabelas filtradas por `user_id` via Row Level Security.
- Gate Premium validado no middleware de rota antes de qualquer query.
- Fotos e PDFs em bucket privado com URLs assinadas.

---

## 9. Prompt contracts

### 9.1 System prompt padrão

```text
Você é um agente da SextouTools PRO executando o mini-app Premium "proposal-premium".
Sua função é produzir propostas comerciais profissionais para prestadores de serviço brasileiros.
Siga exatamente o contrato de saída solicitado.
Não exponha raciocínio interno.
Não invente preços, prazos ou dados factuais.
Quando houver risco jurídico ou de promessa exagerada, inclua aviso de revisão profissional.
Responda no idioma solicitado pelo usuário (padrão: pt-BR).
```

### 9.2 Planner (vision + structure)

```text
Você analisa as fotos enviadas e o template escolhido.
Gere uma estrutura de proposta comercial coerente com o tipo de serviço/produto.
Não invente preços. Não invente prazos.
Sugira itens e materiais plausíveis com base nas fotos.

Saída JSON:
{
  "suggested_items": [{"label": "...", "suggested_by_ai": true}],
  "suggested_materials": [{"item": "...", "qty": 0, "unit": "..."}],
  "sections_order": ["intro","scope","materials","timeline","investment","terms"],
  "visual_brief": {"tone": "...", "color_hint": "..."}
}
```

### 9.3 Creator (writing)

```text
Redija escopo profissional para cada item do checklist, em {{language}},
tom {{tom do template}}.
Máx 80 palavras por item. Inclua entregáveis claros.
Não prometa resultados. Não use claims exagerados.

Saída JSON:
{
  "intro": "...",
  "scope_blocks": [{"title": "...", "description": "...", "deliverables": []}],
  "closing": "..."
}
```

### 9.4 Reviewer

```text
Revise o texto final da proposta:
- Clareza e coerência
- Consistência de preços e totais
- Claims exagerados ou promessas indevidas
- Conformidade com LGPD (dados de cliente)
- Riscos jurídicos ou de compliance

Saída JSON:
{
  "approved": true,
  "warnings": ["..."],
  "suggestions": ["..."]
}
```

### 9.5 Exporter

Recebe HTML template + payload final → gera PDF via Puppeteer.
Sem LLM nesta fase.

### 9.6 JSON schema esperado (artefato final)

```json
{
  "artifact_title": "Proposta Comercial — {{client_name}}",
  "artifact_type": "commercial_proposal",
  "language": "pt-BR",
  "summary": "...",
  "sections": [],
  "copy_blocks": [],
  "visual_brief": {},
  "export_formats": ["pdf", "web", "markdown"],
  "quality_checklist": [],
  "warnings": [],
  "next_actions": ["download", "share", "duplicate"]
}
```

---

## 10. Controle de custo

- **Custo estimado por execução:** $0.04 – $0.09 (LLMs + storage + render).
- **Limite por plano Premium:** 200 propostas/mês (ajustável em `user_premium_limits`).
- **Alertas:**
  - 80% do limite mensal (160 propostas)
  - Custo diário > $20
  - Falhas consecutivas > 3
- **Estratégia de fallback:** downgrade de modelo vision, depois writer, mantendo revisão.
- **Cobrança:** só registra custo real após `artifact_export` bem-sucedido.
- **Registro:** toda execução grava em `premium_cost_ledger` com `cost_type`, `provider_slug`, `amount`, `units`.

---

## 11. Segurança e compliance

### 11.1 Dados sensíveis
- Dados de clientes (PII): retenção mínima, usuário pode apagar histórico a qualquer momento.
- Nenhum dado sensível é enviado para múltiplos provedores sem necessidade.
- Fotos são armazenadas em bucket privado com URLs assinadas de curta duração.

### 11.2 Avisos necessários
- *"Confira valores e prazos antes de enviar. A IA não substitui sua avaliação profissional."*
- *"Revisão humana recomendada para contratos acima de R$ 50.000."*
- *"Ao enviar por e-mail/WhatsApp, confirme que o cliente autorizou o contato."*

### 11.3 Revisão humana
- Obrigatória para propostas com claims jurídicos, financeiros ou de saúde.
- Opcional para propostas padrão (avisar no preview).

### 11.4 Credenciais
- API keys apenas em secrets do servidor.
- Nunca em `input_payload`, logs, arquivos exportados ou prompts visíveis.
- Referências via `provider_slug` + `secret_ref`.

### 11.5 Rate limit e abuso
- Limite diário/mensal por plano.
- CAPTCHA em atividade suspeita.
- Alertas de custo ao admin da suite.
- Bloqueio automático ao atingir limite.

### 11.6 Logs
- Contêm: IDs, status, provedor, modelo, fase, latência, custo, erro sanitizado.
- Não contêm: API keys, PII completa, prompts com dados sensíveis.

---

## 12. Critérios de aceite

### Produto
- [x] Exige login + `users.is_premium = TRUE`.
- [x] Gera artefato utilizável (PDF + link web).
- [x] Não é chat genérico — é fábrica de propostas.
- [x] Promessa clara: "proposta elegante em menos de 3 minutos".
- [x] Público-alvo definido (prestadores de serviço).

### UX/UI
- [x] Usa Design System v2 (tema escuro, Bricolage Grotesque, gradiente de marca).
- [x] Mobile-first, toque ≥ 48px.
- [x] Dropdowns e presets sempre que possível.
- [x] Preview do PDF antes de gerar.
- [x] Exportação clara (baixar, copiar link, enviar).
- [x] Histórico e versionamento.
- [x] Tela de celebração na entrega.
- [x] Coach tips e mensagens de erro amigáveis.

### LLM e agentes
- [x] Suporta múltiplos provedores (Anthropic, OpenAI, Google).
- [x] Roteamento Premium por tarefa (`quality_first`).
- [x] Fallback inteligente (`same_modality_lower_cost`).
- [x] Prompt contracts separados por fase.
- [x] Revisão automática antes da entrega.
- [x] Registra tokens, custo, latência e modelo em `premium_llm_calls`.

### APIs externas
- [x] APIs pagas têm finalidade clara e justificada.
- [x] APIs têm fallback definido.
- [x] Custos são estimados antes da execução.
- [x] Chaves ficam apenas no servidor.

### Banco e histórico
- [x] Salva execução base (`mini_app_runs`).
- [x] Salva execução Premium (`premium_app_runs`).
- [x] Salva LLM calls (`premium_llm_calls`).
- [x] Salva tool calls (`premium_tool_calls`).
- [x] Salva artefatos (`generated_artifacts`).
- [x] Salva versões (`artifact_versions`).
- [x] Aplica RLS por `user_id`.

### Segurança
- [x] Nenhuma API key no client.
- [x] Logs sanitizados.
- [x] PII tratada com retenção mínima.
- [x] Rate limit ativo.
- [x] Alertas de custo ativos.

### Compatibilidade com agentes
- [x] Codex consegue ler e aplicar o PRD.
- [x] Claude Code consegue ler e aplicar o PRD.
- [x] Antigravity consegue ler e aplicar o PRD.
- [x] O PRD não depende de uma ferramenta específica.
- [x] As tarefas são quebradas em passos verificáveis.

---

## Anexo A — App manifest Premium

```yaml
app:
  name: "Gerador de Proposta Premium"
  slug: "proposal-premium"
  suite: "Sextou.biz Premium Suite"
  category: "Comercial"
  artifact_types:
    - commercial_proposal_pdf
    - commercial_proposal_web
    - proposal_summary_json
  requires_auth: true
  requires_premium_plan: true
  mobile_first: true

llm:
  mode: premium_multi_model
  routing_profile: quality_first
  fallback_strategy: same_modality_lower_cost
  default_language: pt-BR
  supported_languages:
    - pt-BR
    - en-US
    - es

agents:
  runtime:
    - planner_agent
    - creator_agent
    - pricing_agent
    - compliance_agent
    - export_agent
    - quality_agent

integrations:
  required:
    - llm_text_provider      # Anthropic / OpenAI
    - llm_vision_provider    # OpenAI Vision / Gemini
    - storage_provider       # Cloudflare R2
  optional:
    - pdf_renderer           # Puppeteer / DocRaptor
    - email_provider         # Resend
    - crm_provider           # HubSpot / Pipedrive
    - analytics_provider     # PostHog

storage:
  save_inputs: true
  save_outputs: true
  save_files: true
  version_artifacts: true

cost_control:
  estimate_before_run: true
  record_actual_cost: true
  block_when_user_limit_reached: true
  monthly_run_limit: 200
  alert_thresholds:
    - 0.8   # 80% do limite
    - 1.0   # 100% do limite

safety:
  pii_detection: true
  human_review_required: false
  sensitive_category: false
  require_review_above_brl: 50000

design_system:
  version: v2
  theme: dark
  display_font: "Bricolage Grotesque"
  body_font: "Inter"
  mono_font: "JetBrains Mono"
  brand_gradient: "#FF3D57 → #FF8C00"
```

---

## Anexo B — Checklist de implementação (para Codex / Claude Code / Antigravity)

### Produto
- [ ] App pertence à Sextou.biz Premium Suite
- [ ] App gera artefato utilizável (PDF + link)
- [ ] App não é chat genérico
- [ ] Promessa clara e público definido

### UX/UI
- [ ] Mobile-first
- [ ] Usa Design System v2
- [ ] Dropdowns, presets e coach tips
- [ ] Preview antes de gerar
- [ ] Exportação clara
- [ ] Histórico e versões
- [ ] Tela de celebração

### LLM e agentes
- [ ] Suporta múltiplos provedores
- [ ] Roteamento por tarefa
- [ ] Fallback configurado
- [ ] Prompt contracts separados
- [ ] Revisão automática
- [ ] Registro de tokens/custo/latência

### APIs externas
- [ ] APIs pagas têm finalidade clara
- [ ] APIs têm fallback
- [ ] Custos estimados
- [ ] Chaves no servidor

### Banco e histórico
- [ ] Salva execução base + Premium
- [ ] Salva LLM calls + tool calls
- [ ] Salva artefatos + versões
- [ ] RLS por usuário

### Segurança
- [ ] Nenhuma API key no client
- [ ] Logs sanitizados
- [ ] PII tratada
- [ ] Rate limit ativo
- [ ] Alertas de custo

### Compatibilidade com agentes
- [ ] Codex consegue aplicar
- [ ] Claude Code consegue aplicar
- [ ] Antigravity consegue aplicar
- [ ] Skill não depende de ferramenta específica
- [ ] Tarefas em passos verificáveis
```


