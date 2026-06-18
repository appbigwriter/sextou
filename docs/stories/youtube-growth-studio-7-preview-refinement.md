---
title: "Story 7: Preview da Estratégia e Regeneração Parcial"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "High"
---

# Story 7: Preview da Estratégia e Regeneração Parcial

## Contexto
O usuário deve visualizar todo o plano mensal de forma limpa e otimizada (mobile e desktop) e ter a flexibilidade de refinar roteiros ou copys específicas sem precisar re-executar e re-pagar por toda a geração do zero.

## Requisitos
1. **Preview da Estratégia**:
   - Rota: `/app/sextou-tools-pro/youtube-growth-studio/[channelId]/result`.
   - Exibir o calendário editorial em cards verticais/mobile-first.
   - Detalhar roteiros, SEO packs, social posts e briefings visuais organizados em sanfonas expansíveis.
   - Botões de cópia rápida para todos os campos de texto.
2. **Regeneração Local**:
   - Botão "Ajustar Roteiro" ou "Regenerar" ao lado de cada seção.
   - Campo para instrução de revisão opcional do usuário (ex: *"Deixe o gancho mais provocativo"*).
   - API `/api/youtube-growth-studio/projects/[id]/regenerate-section` clona a estratégia atual, incrementa a versão (`version + 1`) e atualiza apenas o bloco regenerado de forma reativa.

## Critérios de Aceite
- [ ] Interface de resultados renderiza sem quebras.
- [ ] Cópia rápida para área de transferência funcionando.
- [ ] Ação de regeneração parcial altera e salva a cópia criando nova versão incremental no banco.
- [ ] Custos da regeneração isolada registrados proporcionalmente no ledger.
