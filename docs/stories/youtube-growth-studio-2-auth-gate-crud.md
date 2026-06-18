---
title: "Story 2: Controle de Acesso Premium e CRUD de Canais"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "High"
---

# Story 2: Controle de Acesso Premium e CRUD de Canais

## Contexto
O YouTube Growth Studio AI é uma ferramenta da Suite Premium. Apenas usuários Pro/Premium (`users.is_premium = TRUE`) devem ter permissão de acessar e gerenciar canais. Precisamos de um painel (dashboard) central para listar e cadastrar esses canais.

## Requisitos
1. **Premium Route Guard**:
   - Proteger a rota `/app/sextou-tools-pro/youtube-growth-studio` garantindo que usuários comuns sejam redirecionados para `/sextou-tools-pro/acesso` (página de upgrade/aviso de assinatura).
2. **Dashboard do Canal**:
   - Exibir a listagem dos canais cadastrados do usuário atual em formato de grid ou lista.
   - Criar modal ou formulário para adicionar novos canais com validações (nome do canal, nicho, cidade/estado, oferta, público, tom, idioma, etc.).
   - Botões de ações do canal: Ver Planos, Configurar/Editar e Arquivar.
3. **Empty State Didático v2**:
   - Caso o usuário não tenha canais criados, exibir um empty state educativo no estilo **Design System v2** explicando a promessa e valor do app.

## Critérios de Aceite
- [ ] Usuários sem `is_premium` são redirecionados automaticamente.
- [ ] Dashboard exibe os canais existentes e permite a criação de novos via formulário.
- [ ] Ações de editar e arquivar canal funcionando no banco de dados.
