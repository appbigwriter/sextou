---
title: "Story 8: Motor de Exportação, Versionamento e Histórico"
app: "Clareza - Marketing Strategy Studio"
status: "Planned"
priority: "Medium"
---

# Story 8: Motor de Exportação, Versionamento e Histórico

## Contexto
O valor final entregue pelo Marketing Strategy Studio (Clareza) está no artefato exportável que o usuário pode baixar e usar no seu negócio. A solução deve permitir que o usuário gerencie e compare as diferentes versões salvas de suas estratégias de marca e exporte os materiais nos formatos padrão de mercado, concluindo com um momento marcante de entrega.

## Requisitos
1. **Histórico e Comparação de Versões**:
   - Manter no topo da tela de Preview um dropdown ou seletor de versões ativas salvas na tabela `sb7_brandscripts` e `artifact_versions`.
   - Permitir reabrir qualquer versão anterior carregando as respostas e textos correspondentes.
   - Exibir um pequeno resumo de alteração (ex: "Versão 2: Tom de voz ajustado para direto").

2. **Motor de Exportação Multiformato (export_agent)**:
   - Implementar rota `/api/storybrand/projects/[id]/export?format=[md|pdf|docx|html]`.
   - Formatos obrigatórios:
     * **Markdown (MD)**: Estrutura textual limpa, com cabeçalhos estruturados e e-mails formatados.
     * **HTML**: Preview navegável contendo links e formatação em cores do Design System v2.
     * **PDF / DOCX**: Geração de documento de alta fidelidade para download direto, utilizando bibliotecas de renderização server-side (ex: `pdf-lib`, `docx` ou similar).
   - O `export_agent` deve gerar os arquivos correspondentes, fazer o upload para o provedor de storage e cadastrar os metadados na tabela `generated_artifacts`.

3. **Tela de Celebração de Entrega**:
   - Ao clicar em "Exportar" ou "Baixar", renderizar o componente `.celebrate` do Design System v2 na tela.
   - Exibir emoji de comemoração (`🎉`), título de sucesso ("Sua Estratégia de Marketing está pronta!"), resumo do artefato (ex: "BrandScript + One-liner + Wireframe + 9 E-mails") e botão de download final (`.btn-grad` com sombra de brilho).

## Critérios de Aceite
- [ ] Listagem de versões funcionando permitindo alternar e reabrir estratégias passadas.
- [ ] Downloads de Markdown, HTML, PDF e DOCX gerados e servidos com sucesso no navegador.
- [ ] Artefatos gerados devidamente registrados em `generated_artifacts` e no bucket de storage.
- [ ] Componente de celebração exibido na entrega final do arquivo sem erros.
