---
title: "Story 1: Modelagem de Dados, RLS e Tipagem Prisma"
app: "Clareza - Marketing Strategy Studio"
status: "Done"
priority: "High"
---

# Story 1: Modelagem de Dados, RLS e Tipagem Prisma

## Contexto
O `MarketingStrategyStudio` (Clareza) necessita de tabelas específicas no banco de dados para suportar o gerenciamento multiprojeto e a geração em etapas. A modelagem deve persistir os projetos, sessões de entrevista geradas por IA, BrandScripts gerados (versionados) e os materiais de marketing derivados (collateral), respeitando o isolamento estrito de dados por usuário.

## Requisitos
1. **Schema Prisma**:
   Adicionar ao arquivo `prisma/schema.prisma` as seguintes entidades:
   - `Sb7Project`:
     * `id`: String UUID @id
     * `userId`: String @map("user_id") (User relation)
     * `appId`: String @map("app_id")
     * `name`: String
     * `targetAudience`: String @map("target_audience")
     * `rawIdea`: String @map("raw_idea") @db.Text
     * `brandVoice`: String? @map("brand_voice")
     * `language`: String @default("pt-BR")
     * `channels`: String[] @default([])
     * `status`: String @default("draft") // draft | interviewing | generated | archived
     * `createdAt`: DateTime @default(now()) @map("created_at")
     * `updatedAt`: DateTime @updatedAt @map("updated_at")
     * unique constraint por `(userId, name)`
   - `Sb7InterviewSession`:
     * `id`: String UUID @id
     * `projectId`: String @map("project_id") (Sb7Project relation, onDelete: Cascade)
     * `userId`: String @map("user_id")
     * `questions`: Json // Perguntas + sugestões dinâmicas pré-preenchidas pela IA
     * `answers`: Json? // Respostas do usuário
     * `status`: String @default("open") // open | completed
     * `createdAt`: DateTime @default(now()) @map("created_at")
     * `updatedAt`: DateTime @updatedAt @map("updated_at")
   - `Sb7BrandScript`:
     * `id`: String UUID @id
     * `projectId`: String @map("project_id") (Sb7Project relation, onDelete: Cascade)
     * `userId`: String @map("user_id")
     * `version`: Int @default(1)
     * `heroWant`: String @map("hero_want") @db.Text
     * `problemExternal`: String @map("problem_external") @db.Text
     * `problemInternal`: String @map("problem_internal") @db.Text
     * `problemPhilosophical`: String @map("problem_philosophical") @db.Text
     * `villain`: String? @db.Text
     * `empathy`: String @db.Text
     * `authority`: Json // [{type: string, value: string}]
     * `planProcess`: Json // ["passo 1", "passo 2", "passo 3"]
     * `planAgreement`: Json? // ["promessa 1", ...]
     * `ctaDirect`: String @map("cta_direct")
     * `ctaTransitional`: String? @map("cta_transitional")
     * `stakes`: Json // ["consequência 1", ...]
     * `success`: Json // { concrete: string, identity: string }
     * `oneLiner`: String @map("one_liner") @db.Text
     * `isCurrent`: Boolean @default(true) @map("is_current")
     * `createdAt`: DateTime @default(now()) @map("created_at")
     * unique constraint por `(projectId, version)`
   - `Sb7Collateral`:
     * `id`: String UUID @id
     * `brandScriptId`: String @map("brandscript_id") (Sb7BrandScript relation, onDelete: Cascade)
     * `userId`: String @map("user_id")
     * `wireframe`: Json // Homepage sections with copy blocks
     * `leadGenerator`: Json? // { title: string, format: string, outline: string[] }
     * `nurtureEmails`: Json? // [{ subject: string, body: string }]
     * `salesEmails`: Json? // [{ subject: string, body: string }]
     * `createdAt`: DateTime @default(now()) @map("created_at")

2. **Segurança (RLS & Isolamento)**:
   - Todo acesso às tabelas `Sb7Project`, `Sb7InterviewSession`, `Sb7BrandScript` e `Sb7Collateral` nas queries Prisma deve validar estritamente `userId === loggedInUserId`.
   - Garantir que o campo `isPremium` seja `true` para a leitura e escrita destas tabelas (caso contrário, disparar erro HTTP 403 / Forbidden).

3. **Migração do Banco**:
   - Rodar migration local para aplicar as tabelas.
   - Criar script ou seed se necessário para validar as constraints.

## Critérios de Aceite
- [ ] Modelos adicionados e compilando no `schema.prisma`.
- [ ] Migration de banco aplicada com sucesso localmente.
- [ ] Relações estruturadas no Prisma Client com tipagem estrita gerada.
- [ ] Isolamento de dados por `userId` garantido nas consultas.
