---
title: "Extração de Grupos e Banco de Frios"
app: "Sextou ZapLeads"
status: "Ready"
priority: "High"
---

# Story 3: Extração de Grupos e Banco de Frios

## Contexto
A dor central do usuário é extrair potenciais clientes de grupos de que ele participa e organizá-los como leads "frios" para abordagem posterior.

## Requisitos
1. **Listagem de Grupos**: Endpoint para buscar e UI para exibir grupos em que o usuário está presente (usando a conexão WhatsApp ativa).
2. **Configuração da Extração**:
   - Escolher a finalidade da abordagem (dropdown: Prospecção, Convite, etc).
   - Filtros: "Excluir Admins", "Ignorar contatos já na base".
   - Limite por execução: 50, 100, 250 (evitar limits / ban).
3. **Importação**:
   - Extrair contatos (Backend/Worker).
   - Inserir contatos novos na tabela `contacts` e vinculá-los na tabela `leads` com status `frio`.
   - Alimentar tabela `zap_group_extractions`.
4. **Interface**:
   - Exibir barra de progresso / feedback de importação concluída, informando quantos foram importados, ignorados e total.

## Critérios de Aceite
- [ ] O usuário consegue visualizar seus grupos do WhatsApp.
- [ ] O formulário exige obrigatoriamente a "finalidade" (LGPD compliance).
- [ ] Os contatos extraídos são salvos corretamente como "frios" no banco de dados, ignorando duplicados.
