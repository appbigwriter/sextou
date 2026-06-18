---
title: "Story 7: Preview da Estratégia e Regeneração de Seções Isoladas"
app: "Clareza - Marketing Strategy Studio"
status: "Planned"
priority: "High"
---

# Story 7: Preview da Estratégia e Regeneração de Seções Isoladas

## Contexto
Após a orquestração de IA concluir a geração, o usuário é direcionado para a tela de visualização (Preview). O material gerado (BrandScript, One-liner, Wireframe, Isca digital, E-mails) deve ser exibido de forma fluida, legível e bonita. O usuário também deve ter a flexibilidade de refinar a cópia de seções específicas que não tenham ficado perfeitas, sem precisar re-executar e re-pagar por todo o projeto do zero.

## Requisitos
1. **Visualização Completa (Preview UI)**:
   - Rota: `/app/sextou-tools-pro/storybrand-strategy-generator/[projectId]/result`.
   - Exibir o BrandScript formatado em blocos (Herói, Problema, Guia, Plano, CTA, Apostas, Sucesso) usando o estilo visual do **Design System v2**.
   - Mostrar o One-liner em destaque com fonte display Bricolage Grotesque (`t-xl`) e bordas arredondadas.
   - Apresentar o Wireframe da homepage simulando seções reais em layout vertical mobile-first.
   - Listar as campanhas de e-mails em sanfonas (accordion) expansíveis contendo assunto e corpo da mensagem com botão de cópia rápida para a área de transferência.

2. **Regeneração de Seção Isolada (API & UI)**:
   - Adicionar um botão de ação "Ajustar Seção" ou "Regenerar" ao lado de cada bloco principal (ex: e-mails de vendas, isca digital, wireframe).
   - Ao clicar, abrir um painel lateral ou modal simples solicitando uma instrução de ajuste opcional do usuário (ex: "Deixe o tom mais focado em serviços B2B" ou "Use termos menos corporativos").
   - Chamar o endpoint `/api/storybrand/projects/[id]/regenerate-section` enviando o identificador do bloco e o prompt de revisão.
   - O orquestrador chamará o `creator_agent` apenas para aquela seção informada, revisará com o `quality_agent` e substituirá o trecho correspondente na tabela `sb7_collateral` ou `sb7_brandscripts` incrementando a versão do artefato.
   - Atualizar a interface de forma reativa exibindo a nova versão gerada.

## Critérios de Aceite
- [ ] Tela de preview renderiza todos os artefatos com layout vertical e limpo em resoluções mobile e desktop.
- [ ] Botões de cópia rápida de e-mails e blocos de copy funcionando sem erros.
- [ ] Fluxo de regeneração parcial funcional enviando instruções adicionais e re-renderizando a seção reescrita.
- [ ] Modificação salva corretamente no banco de dados incrementando a versão do projeto.
- [ ] Custos da regeneração parcial computados na tabela `premium_llm_calls` de maneira proporcional.
