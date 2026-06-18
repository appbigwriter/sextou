---
title: "Story 3: Agente Planner e Geração do Plano de Conteúdo"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "High"
---

# Story 3: Agente Planner e Geração do Plano de Conteúdo

## Contexto
O planejamento editorial é a base do canal. O `planner_agent` deve combinar o nicho do canal, a oferta, a cidade e as tendências regionais (obtidas via `trend_agent`) para propor o tema mensal e estruturar o calendário editorial de 30 dias.

## Requisitos
1. **Trend Agent & APIs**:
   - Integrar pesquisa via YouTube Data API e Perplexity/Tavily para coletar tópicos em alta do nicho selecionado na cidade informada pelo usuário.
   - Criar cache de tendências em `YoutubeTrendsCache` para reduzir redundância e custos.
2. **Prompt Contract do Planner**:
   - Implementar o `planner_agent` com chamadas ao Claude Sonnet ou GPT-4o-mini (perfil balanced).
   - O prompt contract deve instruir a IA a produzir um JSON contendo a estratégia mensal, o tema central e uma lista com datas e objetivos (`calendar`).
3. **API Endpoint**:
   - Desenvolver o endpoint de API `/api/youtube-growth-studio/[channelId]/plan` para executar a geração da estratégia e persistir o calendário na tabela `youtube_content_plans`.

## Critérios de Aceite
- [ ] Endpoint da API retorna o plano em formato estruturado.
- [ ] Dados de tendências cacheados corretamente.
- [ ] O calendário de 30 dias é gerado de acordo com a frequência semanal definida.
