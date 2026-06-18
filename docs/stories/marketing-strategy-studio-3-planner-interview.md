---
title: "Story 3: Agente Planner e Geração da Sessão de Entrevista"
app: "Clareza - Marketing Strategy Studio"
status: "Done"
priority: "High"
---

# Story 3: Agente Planner e Geração da Sessão de Entrevista

## Contexto
Quando o usuário submete o formulário básico de 3 campos, o `planner_agent` entra em ação. Ele analisa a proposta inicial e gera um roteiro de entrevista personalizado contendo as 7 etapas obrigatórias do framework StoryBrand SB7, fornecendo sugestões e presets inteligentes baseados no negócio do cliente para reduzir a fricção de preenchimento.

## Requisitos
1. **Model/Routing do Planner**:
   - Integrar o `planner_agent` no backend (ex: `/api/storybrand/projects/[id]/plan`).
   - Usar perfil de roteamento (ex: `balanced`) para chamar o LLM contratado.
   - Definir o prompt system do `planner_agent` no arquivo de contratos/prompts, exigindo o formato de saída estruturado JSON.

2. **Geração Dinâmica de Perguntas (JSON Contract)**:
   - A entrada do prompt são os 3 campos: nome do projeto, público-alvo e descrição livre.
   - O LLM deve retornar uma lista estruturada de perguntas e sugestões para as 7 etapas do SB7 (Herói, Problema [externo/interno/filosófico/vilão], Guia [empatia/autoridade], Plano [processo/acordo], CTA [direta/transicional], Apostas, Sucesso).
   - O formato retornado deve ser:
     ```json
     {
       "steps": [
         {
           "element": "hero",
           "question": "O que seu cliente mais quer em relação ao seu produto?",
           "suggestion": "Desejo sugerido pela IA baseado no briefing...",
           "input_type": "select",
           "options": ["Ganhar tempo", "Ganhar dinheiro", "Segurança", "Saúde", "Simplicidade"]
         },
         ...
       ]
     }
     ```
   - Persistir esta estrutura no campo `questions` da tabela `sb7_interview_sessions` para o respectivo projeto.

3. **Fallback e Robustez**:
   - Se a geração do JSON falhar, tentar novamente usando um modelo de fallback de mesma modalidade.
   - Garantir tratamento de erro amigável sem expor dados de infraestrutura.

## Critérios de Aceite
- [ ] Endpoint `/api/storybrand/projects/[id]/plan` ativo e gated por `userId` e `isPremium`.
- [ ] Prompt contract do `planner_agent` estruturado e testado.
- [ ] Geração do plano de entrevista retornando JSON no schema correto.
- [ ] Respostas e perguntas persistidas em `sb7_interview_sessions` com status `open`.
- [ ] Fallback ativo caso o provedor principal falte.
