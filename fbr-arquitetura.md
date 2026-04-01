# FBR Arquitetura — Sexta do Empreendedor

## Stack Canônica

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript 5
- TailwindCSS 3
- shadcn/ui (Radix UI primitives)

**Backend:**
- Next.js API Routes
- Prisma ORM 5
- PostgreSQL 16
- Redis 7 (cache e pub/sub)

**Autenticação:**
- NextAuth.js v5 (iron-session)
- JWT com expiração
- bcrypt para hashing de senhas

**Storage:**
- Cloudinary (imagens e vídeos)
- Vercel Blob (alternativa)

**Deploy:**
- Vercel (produção)
- PostgreSQL gerenciado
- Redis gerenciado

---

## Pressupostos Inegociáveis

1. **RLS (Row Level Security)** habilitado em TODAS as tabelas
2. **Nenhum secret hardcoded** — exclusivamente em `.env`
3. **Frontend NUNCA chama backend diretamente** — sempre via Next.js API Route
4. **Todo agente tem SOUL.md** e owner designado
5. **Toda ação irreversível** requer aprovação humana explícita
6. **Rate limiting** em rotas sensíveis
7. **Logs de auditoria** para ações administrativas

---

## Sistemas Existentes FBR

Este projeto se integra ao ecossistema FBR:

- **FBR-Click:** Sistema de tracking de eventos (futuro)
- **FBR-Leads:** Sistema de gestão de leads (integrado)
- **FBR-Dev:** Agentes de desenvolvimento
- **FBR-Suporte:** Sistema de suporte (este grupo Telegram)

---

## Invariantes Globais

**INVARIANTE_GLOBAL_01:** RLS habilitado em TODAS as tabelas sem exceção  
**INVARIANTE_GLOBAL_02:** Toda ação irreversível requer aprovação humana explícita  
**INVARIANTE_GLOBAL_03:** Nenhum secret hardcoded — exclusivamente em .env  
**INVARIANTE_GLOBAL_04:** Frontend NUNCA chama o backend diretamente — sempre via Next.js API Route proxy  
**INVARIANTE_GLOBAL_05:** Todo agente tem SOUL.md e owner designado  
**INVARIANTE_GLOBAL_06:** Dados sensíveis (user_id, session_id) NUNCA em URL, NUNCA em console.log  
**INVARIANTE_GLOBAL_07:** Toda rota autenticada valida JWT e role do usuário  
**INVARIANTE_GLOBAL_08:** Upload de arquivos: validação de tipo, tamanho e sanitização obrigatória  
**INVARIANTE_GLOBAL_09:** Logs de auditoria para: aprovação, rejeição, edição, exclusão, confirmação de pagamento  
**INVARIANTE_GLOBAL_10:** Soft delete: status = 'DELETED' em vez de remover registros
