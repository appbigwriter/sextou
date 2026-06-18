---
title: "Story 6: Roteamento de Modelos, Registro de Custos e Fallbacks"
app: "Clareza - Marketing Strategy Studio"
status: "Done"
priority: "Medium"
---

# Story 6: Roteamento de Modelos, Registro de Custos e Fallbacks

## Contexto
Como um mini-app premium que utiliza múltiplas chamadas LLM avançadas (que podem ter custos elevados por execução), é fundamental monitorar e registrar cada chamada. Devemos respeitar a configuração de qualidade selecionada pelo usuário, gerenciar orçamentos de créditos e implementar caminhos de fallback transparentes para evitar interrupções de serviço.

## Requisitos
1. **Model Routing por Perfil**:
   - Integrar a seleção do nível de qualidade feita na entrevista aos perfis de roteamento cadastrados na tabela `premium_model_configs`:
     * `rápido` -> Roteamento para modelos velozes (`speed_first`).
     * `equilibrado` -> Equilíbrio padrão (`balanced`).
     * `máximo` -> Priorização de modelos complexos de alto raciocínio (`quality_first`).
   - Mapear dinamicamente os papéis (`planner`, `writer`, `reviewer`) para os IDs de modelos correspondentes nas configs.

2. **Registro de Consumo e Ledger de Custos**:
   - Para cada chamada LLM realizada nas fases de geração:
     * Registrar no banco de dados (`premium_llm_calls`) a latência (ms), tokens de input/output, o provedor, o modelo utilizado e o custo estimado/real calculado.
     * Somar os custos totais da execução e persistir na tabela `premium_app_runs` correspondente.
     * Atualizar o ledger de custos do usuário (`premium_cost_ledger`) e debitar ou contabilizar a cota mensal baseada nos limites de `user_premium_limits`.
     * Se o usuário atingir seu limite máximo de uso Pro, bloquear novas gerações com mensagem explicativa amigável.

3. **Fallback Inteligente**:
   - Se o provedor principal (ex: Anthropic) retornar erro (como limite de taxa ou indisponibilidade):
     * Registrar a falha na tabela de log com o erro sanitizado.
     * Realizar uma nova tentativa utilizando o modelo equivalente configurado como fallback (ex: OpenAI GPT-4o).
     * O usuário final não deve ser cobrado por tentativas que falharam (apenas chamadas com status `SUCCESS` contam para os limites).

## Critérios de Aceite
- [ ] Mapeamento dinâmico de roteamento de modelos testado com sucesso.
- [ ] Logs detalhados gravados em `premium_llm_calls` após cada chamada.
- [ ] Custos acumulados computados e gravados com precisão em `premium_app_runs`.
- [ ] Fallback testado simulando erro do provedor principal e recuperação via modelo alternativo.
- [ ] Mensagem de bloqueio amigável exibida caso a cota do plano Pro seja ultrapassada.
