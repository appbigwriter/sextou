---
title: "Story 4: Wizard de Configuração UI"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "High"
---

# Story 4: Wizard de Configuração UI

## Contexto
O usuário precisa de uma experiência de onboarding fluida e intuitiva ao criar o plano editorial. O **Design System v2** dita que devemos usar um stepper amigável com coach tips didáticas.

## Requisitos
1. **Stepper Interativo (5 Fases)**:
   - Rota: `/app/sextou-tools-pro/youtube-growth-studio/[channelId]/setup`.
   - Fase 1: Escolha do canal e contextualização de objetivos.
   - Fase 2: Seleção de nicho, cidade e público.
   - Fase 3: Tom de voz e referências.
   - Fase 4: Configuração da frequência e Shorts/Lives.
   - Fase 5: Revisão final e botão "Confirmar Geração".
2. **Design e UX (Design System v2)**:
   - Apresentar Coach Tips didáticas (ex: dicas de retenção de público no YouTube).
   - Componentes otimizados para cliques mobile (altura mínima 48px, CTA principal com 54px e gradiente `#FF3D57 → #FF8C00`).
   - Exibir feedback visual e prévia em tempo real das datas no calendário à medida que o usuário ajusta a frequência semanal.

## Critérios de Aceite
- [ ] Wizard funciona em telas mobile e desktop.
- [ ] Stepper progride entre as fases salvando o estado corretamente.
- [ ] Coach tips e CTAs seguem os padrões de estilo e altura mínima do Design System v2.
