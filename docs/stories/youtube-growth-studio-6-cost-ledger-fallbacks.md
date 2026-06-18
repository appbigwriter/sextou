---
title: "Story 6: Ledger de Custos e Roteamento de Modelos"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "Medium"
---

# Story 6: Ledger de Custos e Roteamento de Modelos

## Contexto
Toda execução de mini-app premium do Sextou.biz deve registrar seus gastos reais de API em tokens, latência e custo financeiro. O roteador também precisa lidar com limites e quedas de provedores de IA.

## Requisitos
1. **Ledger de Custos**:
   - Registrar as inicializações e finalizações em `PremiumAppRun`.
   - Adicionar logs em `PremiumLlmCall` mapeando o provedor, modelo exato, tokens de entrada, tokens de saída e o valor total acumulado da orquestração.
2. **Políticas de Roteamento e Fallback**:
   - Utilizar Anthropic (Claude) por padrão para planejamento e roteiros, e OpenAI (GPT) para SEO e briefings de thumbnail.
   - Implementar fallback lógico: se o Anthropic falhar, re-direcionar a chamada automaticamente para OpenAI. Se a API de imagens falhar, salvar o briefing textual da thumbnail sem quebrar a execução.
3. **Bloqueio Pro/Limits**:
   - Bloquear e disparar mensagens de erro se a cota premium do usuário atual for atingida.

## Critérios de Aceite
- [ ] Todas as chamadas de LLM geradas no app estão registradas no ledger de auditoria.
- [ ] Fallback de API testado simulando indisponibilidade do provedor primário.
- [ ] Limite de consumo pro validado no banco.
