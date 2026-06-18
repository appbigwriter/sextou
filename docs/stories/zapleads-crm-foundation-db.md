---
title: "Fundação do Banco de Dados e Compliance"
app: "Sextou ZapLeads"
status: "Ready"
priority: "High"
---

# Story 1: Fundação do Banco de Dados e Compliance

## Contexto
O ZapLeads requer uma estrutura de dados robusta para gerenciar conexões do WhatsApp, extrações de grupo, funis de leads, histórico de status e log de consentimento (compliance LGPD). Esta história abrange a criação das tabelas base, policies de RLS (Row Level Security) e tipagens TypeScript correspondentes.

## Requisitos
1. **Schema SQL**:
   - `zap_connections`: Conexões (Modo Web ou Oficial), status, aceite de risco.
   - `zap_groups` e `zap_group_extractions`: Registro de grupos e logs das execuções de extração com a finalidade declarada.
   - `contacts`: Tabela de contatos únicos (`phone_e164`).
   - `leads`: Tabela do funil (vinculada a contatos), com controle de `status` e `heat_score`.
   - `lead_status_history` e `lead_events`: Histórico de transições no funil e logs de eventos/inbound.
   - `messages` e `message_templates`: Registro de mensagens trocadas e modelos criados.
   - `consent_log`: Log append-only obrigatório para LGPD (opt-in/opt-out).
2. **Segurança**: RLS para limitar todas as ações por `user_id`. Garantir nas policies que apenas usuários com o parâmetro `is_premium = 'yes'` na tabela de usuários tenham acesso (leitura/escrita) aos dados do ZapLeads. Nunca gravar credenciais/sessão em texto claro (`session_ref`).
3. **Frontend Types**: Gerar tipos e interfaces (`Database` types gerados via Supabase CLI ou definidos manualmente se for outro ORM).

## Critérios de Aceite
- [ ] Schema criado sem erros no banco de desenvolvimento.
- [ ] RLS policies habilitadas e testadas.
- [ ] Tipos TypeScript gerados e exportados para o frontend.
- [ ] Log de consentimento garantido como append-only.
