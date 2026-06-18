---
title: "Story 2: Controle de Acesso Premium e CRUD de Projetos"
app: "Clareza - Marketing Strategy Studio"
status: "Done"
priority: "High"
---

# Story 2: Controle de Acesso Premium e CRUD de Projetos

## Contexto
O Marketing Strategy Studio (Clareza) pertence ao Pacote Premium. É mandatório que apenas usuários com `isPremium = true` tenham acesso de leitura e escrita. O fluxo se inicia na listagem de projetos existentes ou em um estado vazio didático que encoraja o usuário a criar o seu primeiro projeto.

## Requisitos
1. **Premium Route Guard**:
   - Criar middleware ou utilitário de validação nas rotas do app em `/app/sextou-tools-pro/storybrand-strategy-generator`.
   - Se o usuário não estiver autenticado: redirecionar para `/login?next=...`.
   - Se o usuário estiver autenticado mas `isPremium` for `false` (independente de `hasActiveAds` ser true/false): redirecionar para a página `/sextou-tools-pro/acesso` (explicando que o app requer assinatura Pro).

2. **Tela de Projetos (Dashboard do App)**:
   - Rota: `/app/sextou-tools-pro/storybrand-strategy-generator/page.tsx`
   - Desenhar a interface seguindo o **Design System v2** (Bricolage Grotesque nos títulos, Inter no corpo, sombras `--sh-2`).
   - Se não houver projetos: renderizar o componente `.empty` (Empty State Didático) com um emoji explicativo (`empty-emoji`), copy clara ensinando o valor da ferramenta e botão `.btn-grad` ("Criar Novo Projeto").
   - Se houver projetos: listar em grid de cards elegantes contendo nome do projeto, público-alvo, status (`draft | interviewing | generated`) e data de atualização.

3. **Ações e Criação de Projetos**:
   - Botão para abrir modal ou nova tela para Criar Novo Projeto.
   - Formulário de Criação com exatamente 3 campos: "Nome do projeto", "Público-alvo" e "Ideia do produto/empresa" (textarea).
   - Validação server-side e client-side garantindo preenchimento dos 3 campos.
   - Ações em cada projeto listado:
     * "Duplicar": Cria uma cópia com todas as versões de BrandScript e materiais criados.
     * "Arquivar": Altera o status para `archived` ocultando da listagem padrão.
     * "Excluir": Deleta logicamente/fisicamente caso permitido.

## Critérios de Aceite
- [ ] Rota bloqueada para usuários sem `isPremium = true`.
- [ ] Tela inicial renderiza com sucesso seguindo o Design System v2.
- [ ] Estado vazio didático ativo se for o primeiro acesso.
- [ ] Formulário de 3 campos funcional criando registro em `sb7_projects` com RLS isolado.
- [ ] Funções de duplicar e arquivar projeto validadas.
