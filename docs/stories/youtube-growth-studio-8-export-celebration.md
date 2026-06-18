---
title: "Story 8: Motor de Exportação e Celebração"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "Medium"
---

# Story 8: Motor de Exportação e Celebração

## Contexto
O valor da ferramenta está no pacote de entrega final. O usuário precisa comparar versões geradas e baixar todo o material de planejamento no formato desejado de forma simples, sendo recebido por uma tela de comemoração premium.

## Requisitos
1. **Histórico de Versões**:
   - Selector no topo da tela de Preview para resgatar e exibir dados de versões passadas (`version`).
2. **Motor de Exportação Multiformato**:
   - API `/api/youtube-growth-studio/projects/[id]/export?format=[md|html|docx|csv]`
   - **Markdown (MD)**: Estrutura textual limpa do plano.
   - **CSV**: Calendário formatado para importação em ferramentas de agendamento.
   - **HTML / PDF**: Visualizador com estilo elegante.
   - **Word (DOCX/DOC)**: Documento oficial estruturado com cabeçalho UTF-8 BOM e charset compatível para visualização perfeita sem erros de caracteres acentuados.
3. **Modal de Celebração**:
   - Renderizar o componente `.celebrate` animado ao clicar no download do plano, exibindo a mensagem: *"Sua Estratégia de YouTube está pronta!"* com o resumo do plano.

## Critérios de Aceite
- [ ] Dropdown de versões carrega os dados anteriores de forma dinâmica.
- [ ] Exportações de todos os formatos gerados e baixados com sucesso.
- [ ] Arquivo de Word abre localmente sem problemas de codificação ou quebra de caracteres.
- [ ] Modal de comemoração renderizado e com fechamento amigável.
