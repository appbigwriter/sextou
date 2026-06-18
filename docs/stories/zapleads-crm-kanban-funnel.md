---
title: "Funil Kanban de Leads (UI e Gestão)"
app: "Sextou ZapLeads"
status: "Ready"
priority: "High"
---

# Story 4: Funil Kanban de Leads (UI e Gestão)

## Contexto
O usuário precisa de uma visão Kanban para organizar os leads extraídos e as conversas em andamento. Essa visão permite entender visualmente quem é frio, quente e as etapas do pipeline.

## Requisitos
1. **Board Kanban**:
   - Colunas: Frio, Contatado, Quente, Qualificado, Em Negociação, Ganho, Perdido.
   - Cards do Lead exibem: Nome/Telefone, Heat Score, Tempo na Etapa.
2. **Ações**:
   - Drag & drop entre colunas para alterar o status.
   - Atualizar a tabela `lead_status_history` no backend toda vez que o status mudar (registro de auditoria).
3. **Painel Lateral (Lead Detail)**:
   - Ao clicar no lead, abrir drawer ou painel com detalhes (tags, dados básicos) e histórico recente.

## Critérios de Aceite
- [ ] O Board Kanban exibe corretamente os leads por coluna de status.
- [ ] Mover um card altera o banco de dados via API e salva histórico em `lead_status_history`.
- [ ] Painel lateral exibe corretamente os dados associados a um lead específico.
