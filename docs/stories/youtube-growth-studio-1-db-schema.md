---
title: "Story 1: Modelagem de Dados, RLS e Tipagem Prisma"
app: "YouTube Growth Studio AI"
status: "Planned"
priority: "High"
---

# Story 1: Modelagem de Dados, RLS e Tipagem Prisma

## Contexto
Para armazenar as informações específicas do YouTube Growth Studio AI (canais de usuários, planos de conteúdo de 30 dias, itens de conteúdo como roteiros e SEO pack, e o cache de tendências locais), precisamos estender o schema do Prisma e configurar as devidas restrições de acesso (RLS) no banco de dados.

## Requisitos
1. **Schema Prisma**:
   - Criar o modelo `YoutubeChannel` representando as configurações do canal (nome, nicho, cidade, estado, oferta principal, público-alvo, tom de voz, objetivo, idioma, frequência semanal, shorts/lives toggles, etc.).
   - Criar o modelo `YoutubeContentPlan` contendo informações do mês, ano, total de vídeos, resumo estratégico, etc., associado ao `YoutubeChannel` e `User`.
   - Criar o modelo `YoutubeContentItem` contendo a data agendada, o tipo de conteúdo (video/short/live/community_post), o roteiro, o pacote de SEO (títulos, descrição, hashtags), o pacote social (posts de redes sociais), briefings de thumbnail e a URL do arquivo de thumbnail.
   - Criar o modelo `YoutubeTrendsCache` para armazenar de forma otimizada os dados obtidos de APIs externas de tendências filtrados por nicho e cidade.
2. **Migration & Cliente**:
   - Rodar migration local para aplicar as modificações no banco de dados PostgreSQL.
   - Gerar o Prisma Client garantindo a tipagem correta no workspace.
3. **RLS (Row Level Security)**:
   - Garantir que as tabelas possuam políticas onde o usuário só consiga ver e editar seus próprios canais e planos (`user_id = auth.uid()`).

## Critérios de Aceite
- [ ] Modelos de banco de dados compilados sem erros no Prisma.
- [ ] Execução bem-sucedida do comando de sync ou migração no banco local.
- [ ] Políticas de RLS aplicadas e testadas.
