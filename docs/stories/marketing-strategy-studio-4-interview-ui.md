---
title: "Story 4: Interface do Wizard de Entrevista Multi-step"
app: "Clareza - Marketing Strategy Studio"
status: "Done"
priority: "High"
---

# Story 4: Interface do Wizard de Entrevista Multi-step

## Contexto
O preenchimento de uma estratégia de marketing pode ser intimidador para empreendedores leigos. A interface deve suavizar a jornada dividindo o processo em etapas claras (mobile-first, uma decisão por tela), exibindo sugestões editáveis pré-geradas pela IA e incluindo dicas rápidas (coach tips) que explicam de forma didática o propósito de cada elemento do StoryBrand SB7.

## Requisitos
1. **Layout Wizard e Stepper Amigável**:
   - Desenhar um wizard de múltiplos passos em `/app/sextou-tools-pro/storybrand-strategy-generator/[projectId]/interview`.
   - Utilizar o componente `.stepper` (Stepper Amigável) do Design System v2, mostrando círculos numerados, cores de status (cinza para pendente, gradiente de marca para o ativo, e verde com check para concluído) e rótulo claro do passo.
   - Design completamente mobile-first, garantindo alvos de toque maiores ou iguais a 48px (`--tap`), e botão de avançar com 54px de altura (`--tap-cta`).

2. **Preenchimento Assistido & Editável**:
   - Cada tela exibe a pergunta gerada pelo planner e pré-preenche o input (seja texto livre ou select) com a sugestão recomendada pela IA. O usuário pode apenas clicar em avançar ou reescrever/ajustar a sugestão.
   - Adicionar uma `.coach` (Coach Tip) por etapa, explicando em linguagem simples a regra metodológica (Exemplo na etapa do Herói: "Lembre-se: seu cliente é o herói da história, não sua empresa. Qual é o desejo específico dele?").

3. **Revisão e Opções de Geração**:
   - O último passo deve exibir um resumo das respostas fornecidas pelo usuário para revisão.
   - Adicionar seleções adicionais de customização para a cópia final:
     * **Tom de voz**: Dropdown (próximo, premium, divertido, técnico, inspirador, direto).
     * **Idioma**: Dropdown (pt-BR por padrão, en-US, es).
     * **Canais prioritários**: Multi-select (site, Instagram, e-mail, WhatsApp, anúncios, LinkedIn).
     * **Nível de qualidade (routing)**: Dropdown (rápido, equilibrado, máximo).

4. **Navegação & Persistência**:
   - Permitir voltar etapas sem perder o estado atual das respostas informadas.
   - Ao concluir, submeter as respostas para persistir em `sb7_interview_sessions.answers` e atualizar o status da sessão para `completed`.

## Critérios de Aceite
- [ ] Interface respeita fielmente os tokens do Design System v2 (fontes, HSL, espaçamentos).
- [ ] Wizard funcional permitindo transitar entre os 7 elementos do SB7 de forma sequencial.
- [ ] Coach tips contextualizadas renderizadas em cada passo.
- [ ] Resumo final exibido com sucesso antes da submissão.
- [ ] Persistência de dados validada no banco de dados ao salvar respostas.
