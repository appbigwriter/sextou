---
title: "Story 5: Orquestrador de Agentes de Roteiro e Copy"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "High"
---

# Story 5: Orquestrador de Agentes de Roteiro e Copy

## Contexto
Após o calendário editorial ser aprovado, o sistema executa o fluxo principal de geração. Uma única run gerará múltiplos criativos (roteiros, packs de SEO, posts sociais, briefs de thumbnail, etc.). O orquestrador chamará sequencialmente os agentes dedicados.

## Requisitos
1. **API Endpoint de Orquestração**:
   - `/api/youtube-growth-studio/[id]/generate` para processar a criação de copy.
2. **Lógica dos Agentes**:
   - `scriptwriter_agent`: Produz a copy do roteiro (gancho, introdução, pontos do conteúdo, CTA).
   - `seo_agent`: Produz os títulos otimizados, descrição detalhada e tags/hashtags.
   - `social_adapter_agent`: Deriva posts e legendas prontas para divulgação no Instagram, Facebook, LinkedIn, WhatsApp e Comunidade do YouTube.
   - `visual_brief_agent`: Elabora o briefing visual e direcionamento de arte para a thumbnail de cada vídeo.
   - `compliance_agent` e `quality_agent`: Validam claims sensíveis de nichos e montam o checklist de conformidade.
3. **Persistência**:
   - Salvar as copys resultantes na tabela `youtube_content_items` vinculadas ao plano pai.

## Critérios de Aceite
- [ ] Geração assíncrona completa executando em background de forma consistente.
- [ ] Todos os artefatos gerados (roteiros, SEO, social, thumbnails) são persistidos e categorizados corretamente.
- [ ] Compliance agent aplica avisos automáticos em nichos sensíveis (financeiro/direito/saúde).
