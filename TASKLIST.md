# 📋 Task List - SEXTOU.biz

**Projeto:** Sistema de Marketplace Comunitário  
**Prazo MVP:** 02/04/2026  
**Equipe:** Chiara Garcia (coordenação), David Novaes (backend), Lia Salazar (frontend), Sergio Castro (implementação)

---

## 🎯 Status Geral do Projeto

| Fase | Status | Progresso |
|------|--------|-----------|
| 📐 Planejamento | ✅ Concluído | 100% |
| 🔧 Setup Inicial | ✅ Concluído | 100% |
| 🎨 Frontend | ✅ Concluído | 100% |
| ⚙️ Backend | ✅ Concluído | 100% |
| 🧪 Testes | ✅ Concluído | 100% |
| 💰 Pagamentos | ✅ Concluído | 100% |
| 🔔 Notificações | ✅ Concluído | 100% |
| 🎁 Cupons | ✅ Concluído | 100% |
| 📊 Analytics | ✅ Concluído | 100% |
| 👥 Gestão Usuários | ✅ Concluído | 100% |
| 👤 Perfil Usuário | ✅ Concluído | 100% |
| 🔍 Busca/Filtros | ✅ Concluído | 100% |
| 💳 Stripe Integração | ✅ Concluído | 100% |
| 🚀 Deploy | ✅ Concluído | 100% |

**Legenda:**
- ✅ Concluído
- 🔄 Em andamento
- ⏳ Pendente (futuro)
- ❌ Bloqueado
- 🔥 Prioritário

**Última atualização:** 07/04/2026  
**Implementado por:** Sergio Castro

---

## 🏗️ FASE 1: Setup e Infraestrutura

### 1.1 Inicialização do Projeto
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 1.1.1 | Criar projeto Next.js 14 com App Router | David | ✅ | 01/04 19h |
| 1.1.2 | Configurar TypeScript | David | ✅ | 01/04 19h |
| 1.1.3 | Configurar TailwindCSS | David | ✅ | 01/04 19h |
| 1.1.4 | Instalar shadcn/ui | David | ✅ | 01/04 19h |
| 1.1.5 | Configurar Prisma ORM | Sergio Castro | ✅ | 07/04 |
| 1.1.6 | Configurar variáveis de ambiente | David | ✅ | 01/04 20h |

**Notas:**
- ✅ Projeto criado com sucesso
- ✅ Prisma 5.22.0 instalado e configurado com PostgreSQL

---

### 1.2 Configuração do Banco de Dados
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 1.2.1 | Configurar PostgreSQL (local ou remoto) | Sergio Castro | ✅ | 07/04 |
| 1.2.2 | Aplicar schema Prisma | Sergio Castro | ✅ | 07/04 |
| 1.2.3 | Executar primeira migração | Sergio Castro | ✅ | 07/04 |
| 1.2.4 | Criar seed inicial (categorias) | Sergio Castro | ✅ | 07/04 |
| 1.2.5 | Testar conexão com banco | Sergio Castro | ✅ | 07/04 |

**Notas:**
- ✅ PostgreSQL configurado
- ✅ Schema atualizado para PostgreSQL

**Dependências:**
- Tarefa 1.2.1 depende de 1.1.5

---

### 1.3 Estrutura de Diretórios
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 1.3.1 | Criar estrutura de pastas (app, components, lib) | Chiara | ✅ | 01/04 22h |
| 1.3.2 | Configurar aliases TypeScript (@/, @components, etc) | David | ✅ | 01/04 22h |
| 1.3.3 | Adicionar fonts (Montserrat, Poppins) | Lia | ✅ | 07/04 |
| 1.3.4 | Criar globals.css com variáveis de cores | Lia | ✅ | 01/04 23h |

---

## 🔐 FASE 2: Autenticação e Autorização

### 2.1 Sistema de Autenticação
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 2.1.1 | Instalar e configurar NextAuth.js | Sergio Castro | ✅ | 07/04 |
| 2.1.2 | Criar provider Credentials (email/senha) | Sergio Castro | ✅ | 07/04 |
| 2.1.3 | Implementar hash de senha (bcrypt) | Sergio Castro | ✅ | 07/04 |
| 2.1.4 | Criar middleware de proteção de rotas | Sergio Castro | ✅ | 07/04 |
| 2.1.5 | Implementar logout | Sergio Castro | ✅ | 07/04 |

---

### 2.2 Páginas de Autenticação (Frontend)
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 2.2.1 | Criar página de login (/login) | Sergio Castro | ✅ | 07/04 |
| 2.2.2 | Criar página de cadastro (/cadastro) | Sergio Castro | ✅ | 07/04 |
| 2.2.3 | Criar componente de formulário reutilizável | Sergio Castro | ✅ | 07/04 |
| 2.2.4 | Validação de formulários (Zod) | Sergio Castro | ✅ | 07/04 |
| 2.2.5 | Mensagens de erro amigáveis | Sergio Castro | ✅ | 07/04 |

**Dependências:**
- 2.2.1 e 2.2.2 dependem de 2.1.1

---

## 🎨 FASE 3: Frontend - Landing Page

### 3.1 Componentes Básicos (UI Library)
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 3.1.1 | Criar componente Button (primary, secondary) | Sergio Castro | ✅ | 07/04 |
| 3.1.2 | Criar componente Card | Sergio Castro | ✅ | 07/04 |
| 3.1.3 | Criar componente Badge | Sergio Castro | ✅ | 07/04 |
| 3.1.4 | Criar componente Input | Sergio Castro | ✅ | 07/04 |
| 3.1.5 | Criar componente Modal/Dialog | Sergio Castro | ✅ | 07/04 |

---

### 3.2 Layout Global
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 3.2.1 | Criar Header/Navbar | Sergio Castro | ✅ | 07/04 |
| 3.2.2 | Criar Footer | Sergio Castro | ✅ | 07/04 |
| 3.2.3 | Implementar navegação responsiva (mobile menu) | Sergio Castro | ✅ | 07/04 |
| 3.2.4 | Adicionar logo no header | Sergio Castro | ✅ | 07/04 |

---

### 3.3 Landing Page - Seções
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 3.3.1 | Hero Section (título, slogan, CTA) | Sergio Castro | ✅ | 07/04 |
| 3.3.2 | Seção "Como Funciona" (3-4 steps) | Sergio Castro | ✅ | 07/04 |
| 3.3.3 | Seção "Benefícios" (cards com ícones) | Sergio Castro | ✅ | 07/04 |
| 3.3.4 | Seção "Preços" (US$ 30 por anúncio) | Sergio Castro | ✅ | 07/04 |
| 3.3.5 | Seção FAQ (accordion) | Sergio Castro | ✅ | 07/04 |
| 3.3.6 | Seção "Depoimentos" (placeholder) | Sergio Castro | ✅ | 07/04 |
| 3.3.7 | CTA final (botão fixo ou seção) | Sergio Castro | ✅ | 07/04 |

**Prioridade:** Itens 3.3.1 a 3.3.4 são críticos para MVP

---

## 📝 FASE 4: CRUD de Anúncios

### 4.1 Backend - API de Anúncios
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 4.1.1 | Criar endpoint POST /api/ads (criar anúncio) | Sergio Castro | ✅ | 07/04 |
| 4.1.2 | Criar endpoint GET /api/ads (listar anúncios) | Sergio Castro | ✅ | 07/04 |
| 4.1.3 | Criar endpoint GET /api/ads/:id (detalhes) | Sergio Castro | ✅ | 07/04 |
| 4.1.4 | Criar endpoint PATCH /api/ads/:id (editar) | Sergio Castro | ✅ | 07/04 |
| 4.1.5 | Criar endpoint DELETE /api/ads/:id (deletar) | Sergio Castro | ✅ | 07/04 |
| 4.1.6 | Implementar filtros (categoria, status, data) | Sergio Castro | ✅ | 07/04 |
| 4.1.7 | Implementar paginação | Sergio Castro | ✅ | 07/04 |

---

### 4.2 Frontend - Dashboard do Anunciante
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 4.2.1 | Criar página /dashboard | Sergio Castro | ✅ | 07/04 |
| 4.2.2 | Listar anúncios do usuário | Sergio Castro | ✅ | 07/04 |
| 4.2.3 | Criar página /anuncios/novo (formulário) | Sergio Castro | ✅ | 07/04 |
| 4.2.4 | Formulário multi-step (4 etapas) | Sergio Castro | ✅ | 07/04 |
| 4.2.5 | Upload de imagens (até 5) | Sergio Castro | ✅ | 07/04 |
| 4.2.6 | Preview do anúncio antes de publicar | Sergio Castro | ✅ | 07/04 |
| 4.2.7 | Botão "Duplicar Anúncio" | Sergio Castro | ✅ | 07/04 |

**Dependências:**
- 4.2.2 depende de 4.1.2
- 4.2.3 depende de 4.1.1

---

### 4.3 Upload de Mídia
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 4.3.1 | Configurar storage (Cloudinary ou Vercel Blob) | Sergio Castro | ✅ | 07/04 |
| 4.3.2 | Criar endpoint POST /api/upload (imagens) | Sergio Castro | ✅ | 07/04 |
| 4.3.3 | Validação de tipo e tamanho (max 5MB) | Sergio Castro | ✅ | 07/04 |
| 4.3.4 | Componente de upload com preview | Sergio Castro | ✅ | 07/04 |
| 4.3.5 | Drag and drop de imagens | Sergio Castro | ✅ | 07/04 |

---

## 🏪 FASE 5: Vitrine Pública

### 5.1 Backend - API de Vitrine
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 5.1.1 | Endpoint GET /api/ads/public (apenas PUBLISHED) | Sergio Castro | ✅ | 07/04 |
| 5.1.2 | Filtros por categoria | Sergio Castro | ✅ | 07/04 |
| 5.1.3 | Filtros por cidade | Sergio Castro | ✅ | 07/04 |
| 5.1.4 | Busca por palavra-chave | Sergio Castro | ✅ | 07/04 |
| 5.1.5 | Ordenação (relevância, data, views) | Sergio Castro | ✅ | 07/04 |

---

### 5.2 Frontend - Vitrine Pública
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 5.2.1 | Criar página /anuncios (grid de cards) | Sergio Castro | ✅ | 07/04 |
| 5.2.2 | Card de anúncio (imagem, título, preço, cidade) | Sergio Castro | ✅ | 07/04 |
| 5.2.3 | Barra de filtros (categoria, cidade) | Sergio Castro | ✅ | 07/04 |
| 5.2.4 | Campo de busca | Sergio Castro | ✅ | 07/04 |
| 5.2.5 | Paginação ou scroll infinito | Sergio Castro | ✅ | 07/04 |
| 5.2.6 | Badge "Destaque" para anúncios featured | Sergio Castro | ✅ | 07/04 |

---

### 5.3 Página de Detalhes do Anúncio
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 5.3.1 | Criar página /anuncios/[slug] | Sergio Castro | ✅ | 07/04 |
| 5.3.2 | Galeria de imagens (carrossel) | Sergio Castro | ✅ | 07/04 |
| 5.3.3 | Descrição completa | Sergio Castro | ✅ | 07/04 |
| 5.3.4 | Informações do anunciante | Sergio Castro | ✅ | 07/04 |
| 5.3.5 | Botões de ação (WhatsApp, Site, Instagram) | Sergio Castro | ✅ | 07/04 |
| 5.3.6 | Botão "Tenho Interesse" | Sergio Castro | ✅ | 07/04 |
| 5.3.7 | Botão "Compartilhar no WhatsApp" | Sergio Castro | ✅ | 07/04 |
| 5.3.8 | Meta tags Open Graph (SEO) | Sergio Castro | ✅ | 07/04 |

---

## 📊 FASE 6: Painel Administrativo

### 6.1 Backend - API Admin
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.1.1 | Middleware de autorização (admin only) | Sergio Castro | ✅ | 07/04 |
| 6.1.2 | Endpoint GET /api/admin/dashboard (métricas) | Sergio Castro | ✅ | 07/04 |
| 6.1.3 | Endpoint GET /api/admin/ads (todos os anúncios) | Sergio Castro | ✅ | 07/04 |
| 6.1.4 | Endpoint PATCH /api/admin/ads/:id/approve | Sergio Castro | ✅ | 07/04 |
| 6.1.5 | Endpoint PATCH /api/admin/ads/:id/reject | Sergio Castro | ✅ | 07/04 |
| 6.1.6 | Endpoint GET /api/admin/users (listar usuários) | Sergio Castro | ✅ | 07/04 |
| 6.1.7 | Endpoint GET /api/admin/payments | Sergio Castro | ✅ | 07/04 |
| 6.1.8 | Endpoint PATCH /api/admin/payments/:id/confirm | Sergio Castro | ✅ | 07/04 |

---

### 6.2 Frontend - Dashboard Admin
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.2.1 | Criar página /admin/dashboard | Sergio Castro | ✅ | 07/04 |
| 6.2.2 | Cards com métricas principais | Sergio Castro | ✅ | 07/04 |
| 6.2.3 | Gráfico de anúncios por dia (Chart.js) | Sergio Castro | ✅ | 07/04 |
| 6.2.4 | Lista de ações rápidas | Sergio Castro | ✅ | 07/04 |

---

### 6.3 Frontend - Moderação de Anúncios
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.3.1 | Criar página /admin/moderacao | Sergio Castro | ✅ | 07/04 |
| 6.3.2 | Tabela com anúncios pendentes | Sergio Castro | ✅ | 07/04 |
| 6.3.3 | Modal de visualização de anúncio | Sergio Castro | ✅ | 07/04 |
| 6.3.4 | Botão "Aprovar" com confirmação | Sergio Castro | ✅ | 07/04 |
| 6.3.5 | Botão "Rejeitar" com formulário de motivo | Sergio Castro | ✅ | 07/04 |
| 6.3.6 | Filtros (status, data, categoria) | Sergio Castro | ✅ | 07/04 |

---

### 6.4 Frontend - Gestão de Pagamentos
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.4.1 | Criar página /admin/pagamentos | Sergio Castro | ✅ | 07/04 |
| 6.4.2 | Tabela de pagamentos pendentes | Sergio Castro | ✅ | 07/04 |
| 6.4.3 | Modal de visualização de comprovante | Sergio Castro | ✅ | 07/04 |
| 6.4.4 | Botão "Confirmar Pagamento" | Sergio Castro | ✅ | 07/04 |

---

## 📱 FASE 7: Leads e WhatsApp

### 7.1 Backend - Sistema de Leads
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 7.1.1 | Endpoint POST /api/leads (criar lead) | Sergio Castro | ✅ | 07/04 |
| 7.1.2 | Capturar IP e User Agent | Sergio Castro | ✅ | 07/04 |
| 7.1.3 | Endpoint GET /api/leads (admin) | Sergio Castro | ✅ | 07/04 |
| 7.1.4 | Endpoint GET /api/ads/:id/leads (anunciante) | Sergio Castro | ✅ | 07/04 |

---

### 7.2 Frontend - Botões de Ação
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 7.2.1 | Botão "Falar no WhatsApp" com tracking | Sergio Castro | ✅ | 07/04 |
| 7.2.2 | Botão "Visitar Site" com tracking | Sergio Castro | ✅ | 07/04 |
| 7.2.3 | Botão "Instagram" com tracking | Sergio Castro | ✅ | 07/04 |
| 7.2.4 | Modal "Tenho Interesse" com formulário | Sergio Castro | ✅ | 07/04 |
| 7.2.5 | Botão "Compartilhar no WhatsApp" | Sergio Castro | ✅ | 07/04 |
| 7.2.6 | Texto pronto para copiar | Sergio Castro | ✅ | 07/04 |

---

## 💰 FASE 8: Sistema de Pagamento

### 8.1 Integração Stripe/PayPal (PRIORIDADE MVP)
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 8.1.1 | Sistema de pagamentos (Zelle/Manual) | Sergio Castro | ✅ | 07/04 |
| 8.1.2 | API de criação de pagamentos | Sergio Castro | ✅ | 07/04 |
| 8.1.3 | API de confirmação de pagamentos (admin) | Sergio Castro | ✅ | 07/04 |
| 8.1.4 | Atualizar status do anúncio após pagamento | Sergio Castro | ✅ | 07/04 |
| 8.1.5 | Integração Stripe Checkout | Sergio Castro | ✅ | 07/04 |
| 8.1.6 | Stripe Webhooks para confirmações | Sergio Castro | ✅ | 07/04 |

**Nota:** Sistema de pagamento Zelle manual + Stripe Checkout implementado.

---

### 8.2 Frontend - Fluxo de Pagamento
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 8.2.1 | Página /admin/pagamentos (gestão) | Sergio Castro | ✅ | 07/04 |
| 8.2.2 | Lista de pagamentos pendentes | Sergio Castro | ✅ | 07/04 |
| 8.2.3 | Botão confirmar pagamento | Sergio Castro | ✅ | 07/04 |
| 8.2.4 | Checkout Stripe integrado | Sergio Castro | ✅ | 07/04 |

---

## 🎯 FASE 9: Categorias e Settings

### 9.1 Backend - Categorias
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 9.1.1 | Criar seed de categorias iniciais | Sergio Castro | ✅ | 07/04 |
| 9.1.2 | Endpoint GET /api/categories | Sergio Castro | ✅ | 07/04 |
| 9.1.3 | Endpoint POST /api/categories (criar) | Sergio Castro | ✅ | 07/04 |
| 9.1.4 | Endpoint PATCH/DELETE /api/categories/:id | Sergio Castro | ✅ | 07/04 |

---

### 9.2 Frontend - Gestão de Categorias
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 9.2.1 | Página /admin/categorias | Sergio Castro | ✅ | 07/04 |
| 9.2.2 | Tabela com categorias | Sergio Castro | ✅ | 07/04 |
| 9.2.3 | Componente interativo criar/editar/excluir | Sergio Castro | ✅ | 07/04 |

---

## 🔔 FASE 10: Notificações (Básico - MVP)

### 10.1 Backend - Notificações
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 10.1.1 | Configurar Nodemailer (SMTP) | Sergio Castro | ✅ | 07/04 |
| 10.1.2 | Template de e-mail: anúncio aprovado | Sergio Castro | ✅ | 07/04 |
| 10.1.3 | Template de e-mail: anúncio rejeitado | Sergio Castro | ✅ | 07/04 |
| 10.1.4 | Template de e-mail: pagamento confirmado | Sergio Castro | ✅ | 07/04 |

---

## 🧪 FASE 11: Testes e Ajustes Finais

### 11.1 Testes de Integração
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 11.1.1 | Testar fluxo completo: cadastro → anúncio → pagamento → aprovação | Chiara | ✅ | 07/04 |
| 11.1.2 | Testar responsividade mobile | Sergio Castro | ✅ | 07/04 |
| 11.1.3 | Testar performance (Lighthouse) | Sergio Castro | ✅ | 07/04 |
| 11.1.4 | Corrigir bugs críticos | Todos | ✅ | 07/04 |

---

### 11.2 Deploy
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 11.2.1 | Configurar domínio (com Sergio) | Chiara | ✅ | 07/04 |
| 11.2.2 | Deploy em VPS (EasyPanel) | Sergio Castro | ✅ | 07/04 |
| 11.2.3 | Configurar banco de produção | Sergio Castro | ✅ | 07/04 |
| 11.2.4 | Testar em produção | Todos | ✅ | 07/04 |

---

## 📝 Notas Importantes

### Implementado na Versão 1.1

**Melhorias v1.1 (100%):**
- ✅ Sistema de cupons (CRUD completo, validação, 3 tipos)
- ✅ Analytics API (métricas por período, categorias, relatórios)
- ✅ Gestão de usuários admin (lista, status, estatísticas)
- ✅ Página de perfil do anunciante (stats, anúncios publicados)
- ✅ Configurações do usuário (editar perfil, senha, logout)
- ✅ Busca avançada na vitrine (filtros por categoria, cidade, preço)
- ✅ 26 rotas total (páginas + APIs)
- ✅ Integração Stripe (Checkout Sessions, Webhooks, API de verificação)

**Core v1.0 (Completo):**
- ✅ Sistema completo de autenticação (NextAuth)
- ✅ Dashboard do anunciante
- ✅ Criação e edição de anúncios
- ✅ Vitrine pública com filtros
- ✅ Página de detalhes do anúncio
- ✅ Integração WhatsApp
- ✅ Painel administrativo completo
- ✅ Sistema de aprovação de anúncios
- ✅ Gestão de categorias (CRUD completo)
- ✅ Sistema de pagamentos (Zelle manual + Stripe)
- ✅ Notificações por email (Nodemailer + templates)
- ✅ Deploy em EasyPanel (VPS)
- ✅ Health check API

---

**Próximas melhorias (v2.0):**
- ⏳ Upload de imagens avançado (Cloudinary)
- ⏳ App mobile
- ⏳ Sistema de mensagens chat
- ⏳ Relatórios exportáveis (PDF/CSV)

---

**Configuração do Stripe (produção):**
Para ativar o Stripe em produção, configure as seguintes variáveis de ambiente:
- `STRIPE_SECRET_KEY`: Chave secreta do Stripe
- `STRIPE_WEBHOOK_SECRET`: Segredo do webhook
- `NEXT_PUBLIC_BASE_URL`: URL do site em produção

---

**Última atualização:** 07/04/2026  
**Versão:** 1.1  
**Implementado por:** Sergio Castro  
**Mantido por:** Chiara Garcia