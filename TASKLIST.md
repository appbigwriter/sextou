# 📋 Task List - Sexta do Empreendedor

**Projeto:** Sistema de Marketplace Comunitário  
**Prazo MVP:** 02/04/2026  
**Equipe:** Chiara Garcia (coordenação), David Novaes (backend), Lia Salazar (frontend)

---

## 🎯 Status Geral do Projeto

| Fase | Status | Progresso |
|------|--------|-----------|
| 📐 Planejamento | ✅ Concluído | 100% |
| 🔧 Setup Inicial | 🔄 Em andamento | 70% |
| 🎨 Frontend | ⏳ Aguardando | 0% |
| ⚙️ Backend | ⏳ Aguardando | 0% |
| 🧪 Testes | ⏳ Aguardando | 0% |

**Legenda:**
- ✅ Concluído
- 🔄 Em andamento
- ⏳ Aguardando
- ❌ Bloqueado
- 🔥 Prioritário

**Última atualização:** 01/04/2026 19:51 UTC

---

## 🏗️ FASE 1: Setup e Infraestrutura

### 1.1 Inicialização do Projeto
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 1.1.1 | Criar projeto Next.js 14 com App Router | David | ✅ | 01/04 19h |
| 1.1.2 | Configurar TypeScript | David | ✅ | 01/04 19h |
| 1.1.3 | Configurar TailwindCSS | David | ✅ | 01/04 19h |
| 1.1.4 | Instalar shadcn/ui | David | ✅ | 01/04 19h |
| 1.1.5 | Configurar Prisma ORM | David | ✅ | 01/04 20h |
| 1.1.6 | Configurar variáveis de ambiente | David | ✅ | 01/04 20h |

**Notas:**
- ✅ Projeto criado com sucesso
- ✅ Prisma 6.6.0 instalado e configurado

---

### 1.2 Configuração do Banco de Dados
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 1.2.1 | Configurar PostgreSQL (local ou remoto) | David | ✅ | 01/04 21h |
| 1.2.2 | Aplicar schema Prisma | David | 🔄 | 01/04 21h |
| 1.2.3 | Executar primeira migração | David | ⏳ | 01/04 21h |
| 1.2.4 | Criar seed inicial (categorias) | David | ⏳ | 01/04 22h |
| 1.2.5 | Testar conexão com banco | David | ⏳ | 01/04 22h |

**Notas:**
- ✅ PostgreSQL configurado
- 🔄 Corrigindo erro linha 10 do schema.prisma

**Dependências:**
- Tarefa 1.2.1 depende de 1.1.5

---

### 1.3 Estrutura de Diretórios
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 1.3.1 | Criar estrutura de pastas (app, components, lib) | Chiara | ⏳ | 01/04 22h |
| 1.3.2 | Configurar aliases TypeScript (@/, @components, etc) | David | ⏳ | 01/04 22h |
| 1.3.3 | Adicionar fonts (Montserrat, Poppins) | Lia | ⏳ | 01/04 23h |
| 1.3.4 | Criar globals.css com variáveis de cores | Lia | ⏳ | 01/04 23h |

---

## 🔐 FASE 2: Autenticação e Autorização

### 2.1 Sistema de Autenticação
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 2.1.1 | Instalar e configurar NextAuth.js | David | ⏳ | 02/04 00h |
| 2.1.2 | Criar provider Credentials (email/senha) | David | ⏳ | 02/04 01h |
| 2.1.3 | Implementar hash de senha (bcrypt) | David | ⏳ | 02/04 01h |
| 2.1.4 | Criar middleware de proteção de rotas | David | ⏳ | 02/04 02h |
| 2.1.5 | Implementar logout | David | ⏳ | 02/04 02h |

---

### 2.2 Páginas de Autenticação (Frontend)
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 2.2.1 | Criar página de login (/login) | Lia | ⏳ | 02/04 03h |
| 2.2.2 | Criar página de cadastro (/cadastro) | Lia | ⏳ | 02/04 03h |
| 2.2.3 | Criar componente de formulário reutilizável | Lia | ⏳ | 02/04 02h |
| 2.2.4 | Validação de formulários (Zod) | David | ⏳ | 02/04 03h |
| 2.2.5 | Mensagens de erro amigáveis | Lia | ⏳ | 02/04 04h |

**Dependências:**
- 2.2.1 e 2.2.2 dependem de 2.1.1

---

## 🎨 FASE 3: Frontend - Landing Page

### 3.1 Componentes Básicos (UI Library)
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 3.1.1 | Criar componente Button (primary, secondary) | Lia | ⏳ | 02/04 05h |
| 3.1.2 | Criar componente Card | Lia | ⏳ | 02/04 05h |
| 3.1.3 | Criar componente Badge | Lia | ⏳ | 02/04 06h |
| 3.1.4 | Criar componente Input | Lia | ⏳ | 02/04 06h |
| 3.1.5 | Criar componente Modal/Dialog | Lia | ⏳ | 02/04 06h |

---

### 3.2 Layout Global
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 3.2.1 | Criar Header/Navbar | Lia | ⏳ | 02/04 07h |
| 3.2.2 | Criar Footer | Lia | ⏳ | 02/04 07h |
| 3.2.3 | Implementar navegação responsiva (mobile menu) | Lia | ⏳ | 02/04 08h |
| 3.2.4 | Adicionar logo no header | Lia | ⏳ | 02/04 08h |

---

### 3.3 Landing Page - Seções
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 3.3.1 | Hero Section (título, slogan, CTA) | Lia | 🔥 | 02/04 09h |
| 3.3.2 | Seção "Como Funciona" (3-4 steps) | Lia | 🔥 | 02/04 10h |
| 3.3.3 | Seção "Benefícios" (cards com ícones) | Lia | 🔥 | 02/04 10h |
| 3.3.4 | Seção "Preços" (US$ 30 por anúncio) | Lia | 🔥 | 02/04 11h |
| 3.3.5 | Seção FAQ (accordion) | Lia | ⏳ | 02/04 11h |
| 3.3.6 | Seção "Depoimentos" (placeholder) | Lia | ⏳ | 02/04 12h |
| 3.3.7 | CTA final (botão fixo ou seção) | Lia | 🔥 | 02/04 12h |

**Prioridade:** Itens 3.3.1 a 3.3.4 são críticos para MVP

---

## 📝 FASE 4: CRUD de Anúncios

### 4.1 Backend - API de Anúncios
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 4.1.1 | Criar endpoint POST /api/ads (criar anúncio) | David | ⏳ | 02/04 13h |
| 4.1.2 | Criar endpoint GET /api/ads (listar anúncios) | David | ⏳ | 02/04 13h |
| 4.1.3 | Criar endpoint GET /api/ads/:id (detalhes) | David | ⏳ | 02/04 14h |
| 4.1.4 | Criar endpoint PATCH /api/ads/:id (editar) | David | ⏳ | 02/04 14h |
| 4.1.5 | Criar endpoint DELETE /api/ads/:id (deletar) | David | ⏳ | 02/04 14h |
| 4.1.6 | Implementar filtros (categoria, status, data) | David | ⏳ | 02/04 15h |
| 4.1.7 | Implementar paginação | David | ⏳ | 02/04 15h |

---

### 4.2 Frontend - Dashboard do Anunciante
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 4.2.1 | Criar página /dashboard | Lia | ⏳ | 02/04 16h |
| 4.2.2 | Listar anúncios do usuário | Lia | ⏳ | 02/04 16h |
| 4.2.3 | Criar página /anuncios/novo (formulário) | Lia | 🔥 | 02/04 17h |
| 4.2.4 | Formulário multi-step (4 etapas) | Lia | 🔥 | 02/04 18h |
| 4.2.5 | Upload de imagens (até 5) | David + Lia | 🔥 | 02/04 19h |
| 4.2.6 | Preview do anúncio antes de publicar | Lia | ⏳ | 02/04 20h |
| 4.2.7 | Botão "Duplicar Anúncio" | Lia | ⏳ | 02/04 20h |

**Dependências:**
- 4.2.2 depende de 4.1.2
- 4.2.3 depende de 4.1.1

---

### 4.3 Upload de Mídia
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 4.3.1 | Configurar storage (Cloudinary ou Vercel Blob) | David | ⏳ | 02/04 14h |
| 4.3.2 | Criar endpoint POST /api/upload (imagens) | David | ⏳ | 02/04 15h |
| 4.3.3 | Validação de tipo e tamanho (max 5MB) | David | ⏳ | 02/04 15h |
| 4.3.4 | Componente de upload com preview | Lia | ⏳ | 02/04 16h |
| 4.3.5 | Drag and drop de imagens | Lia | ⏳ | 02/04 17h |

---

## 🏪 FASE 5: Vitrine Pública

### 5.1 Backend - API de Vitrine
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 5.1.1 | Endpoint GET /api/ads/public (apenas PUBLISHED) | David | ⏳ | 02/04 18h |
| 5.1.2 | Filtros por categoria | David | ⏳ | 02/04 18h |
| 5.1.3 | Filtros por cidade | David | ⏳ | 02/04 19h |
| 5.1.4 | Busca por palavra-chave | David | ⏳ | 02/04 19h |
| 5.1.5 | Ordenação (relevância, data, views) | David | ⏳ | 02/04 19h |

---

### 5.2 Frontend - Vitrine Pública
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 5.2.1 | Criar página /anuncios (grid de cards) | Lia | 🔥 | 02/04 20h |
| 5.2.2 | Card de anúncio (imagem, título, preço, cidade) | Lia | 🔥 | 02/04 20h |
| 5.2.3 | Barra de filtros (categoria, cidade) | Lia | ⏳ | 02/04 21h |
| 5.2.4 | Campo de busca | Lia | ⏳ | 02/04 21h |
| 5.2.5 | Paginação ou scroll infinito | Lia | ⏳ | 02/04 21h |
| 5.2.6 | Badge "Destaque" para anúncios featured | Lia | ⏳ | 02/04 22h |

---

### 5.3 Página de Detalhes do Anúncio
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 5.3.1 | Criar página /anuncios/[slug] | Lia | 🔥 | 02/04 22h |
| 5.3.2 | Galeria de imagens (carrossel) | Lia | ⏳ | 02/04 23h |
| 5.3.3 | Descrição completa | Lia | ⏳ | 02/04 23h |
| 5.3.4 | Informações do anunciante | Lia | ⏳ | 02/04 23h |
| 5.3.5 | Botões de ação (WhatsApp, Site, Instagram) | Lia | 🔥 | 03/04 00h |
| 5.3.6 | Botão "Tenho Interesse" | Lia | 🔥 | 03/04 00h |
| 5.3.7 | Botão "Compartilhar no WhatsApp" | Lia | 🔥 | 03/04 00h |
| 5.3.8 | Meta tags Open Graph (SEO) | David | ⏳ | 03/04 01h |

---

## 📊 FASE 6: Painel Administrativo

### 6.1 Backend - API Admin
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.1.1 | Middleware de autorização (admin only) | David | ⏳ | 03/04 02h |
| 6.1.2 | Endpoint GET /api/admin/dashboard (métricas) | David | ⏳ | 03/04 02h |
| 6.1.3 | Endpoint GET /api/admin/ads (todos os anúncios) | David | ⏳ | 03/04 03h |
| 6.1.4 | Endpoint PATCH /api/admin/ads/:id/approve | David | 🔥 | 03/04 03h |
| 6.1.5 | Endpoint PATCH /api/admin/ads/:id/reject | David | 🔥 | 03/04 03h |
| 6.1.6 | Endpoint GET /api/admin/users (listar usuários) | David | ⏳ | 03/04 04h |
| 6.1.7 | Endpoint GET /api/admin/payments | David | 🔥 | 03/04 04h |
| 6.1.8 | Endpoint PATCH /api/admin/payments/:id/confirm | David | 🔥 | 03/04 04h |

---

### 6.2 Frontend - Dashboard Admin
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.2.1 | Criar página /admin/dashboard | Lia | ⏳ | 03/04 05h |
| 6.2.2 | Cards com métricas principais | Lia | ⏳ | 03/04 05h |
| 6.2.3 | Gráfico de anúncios por dia (Chart.js) | Lia | ⏳ | 03/04 06h |
| 6.2.4 | Lista de ações rápidas | Lia | ⏳ | 03/04 06h |

---

### 6.3 Frontend - Moderação de Anúncios
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.3.1 | Criar página /admin/moderacao | Lia | 🔥 | 03/04 07h |
| 6.3.2 | Tabela com anúncios pendentes | Lia | 🔥 | 03/04 07h |
| 6.3.3 | Modal de visualização de anúncio | Lia | 🔥 | 03/04 08h |
| 6.3.4 | Botão "Aprovar" com confirmação | Lia | 🔥 | 03/04 08h |
| 6.3.5 | Botão "Rejeitar" com formulário de motivo | Lia | 🔥 | 03/04 08h |
| 6.3.6 | Filtros (status, data, categoria) | Lia | ⏳ | 03/04 09h |

---

### 6.4 Frontend - Gestão de Pagamentos
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 6.4.1 | Criar página /admin/pagamentos | Lia | 🔥 | 03/04 09h |
| 6.4.2 | Tabela de pagamentos pendentes | Lia | 🔥 | 03/04 10h |
| 6.4.3 | Modal de visualização de comprovante | Lia | 🔥 | 03/04 10h |
| 6.4.4 | Botão "Confirmar Pagamento" | Lia | 🔥 | 03/04 10h |

---

## 📱 FASE 7: Leads e WhatsApp

### 7.1 Backend - Sistema de Leads
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 7.1.1 | Endpoint POST /api/leads (criar lead) | David | ⏳ | 03/04 11h |
| 7.1.2 | Capturar IP e User Agent | David | ⏳ | 03/04 11h |
| 7.1.3 | Endpoint GET /api/leads (admin) | David | ⏳ | 03/04 12h |
| 7.1.4 | Endpoint GET /api/ads/:id/leads (anunciante) | David | ⏳ | 03/04 12h |

---

### 7.2 Frontend - Botões de Ação
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 7.2.1 | Botão "Falar no WhatsApp" com tracking | Lia | 🔥 | 03/04 13h |
| 7.2.2 | Botão "Visitar Site" com tracking | Lia | ⏳ | 03/04 13h |
| 7.2.3 | Botão "Instagram" com tracking | Lia | ⏳ | 03/04 13h |
| 7.2.4 | Modal "Tenho Interesse" com formulário | Lia | ⏳ | 03/04 14h |
| 7.2.5 | Botão "Compartilhar no WhatsApp" | Lia | 🔥 | 03/04 14h |
| 7.2.6 | Texto pronto para copiar | Lia | ⏳ | 03/04 14h |

---

## 💰 FASE 8: Sistema de Pagamento

### 8.1 Integração Stripe/PayPal (PRIORIDADE MVP)
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 8.1.1 | Configurar Stripe SDK | David | 🔥 | 02/04 15h |
| 8.1.2 | Criar endpoint POST /api/payments/create-session | David | 🔥 | 02/04 16h |
| 8.1.3 | Webhook Stripe para confirmação | David | 🔥 | 02/04 16h |
| 8.1.4 | Atualizar status do anúncio após pagamento | David | 🔥 | 02/04 17h |
| 8.1.5 | Configurar PayPal SDK (alternativa) | David | ⏳ | 02/04 18h |

---

### 8.2 Frontend - Fluxo de Pagamento
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 8.2.1 | Página de pagamento (/anuncios/:id/pagamento) | Lia | 🔥 | 03/04 16h |
| 8.2.2 | Integração com Stripe Checkout | Lia | 🔥 | 03/04 17h |
| 8.2.3 | Página de sucesso (/pagamento/sucesso) | Lia | 🔥 | 03/04 17h |
| 8.2.4 | Página de erro (/pagamento/erro) | Lia | ⏳ | 03/04 18h |

**Nota:** Zelle será adicionado na próxima semana (pós-MVP)

---

## 🎯 FASE 9: Categorias e Settings

### 9.1 Backend - Categorias
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 9.1.1 | Criar seed de categorias iniciais | David | ⏳ | 03/04 17h |
| 9.1.2 | Endpoint GET /api/categories | David | ⏳ | 03/04 17h |
| 9.1.3 | Endpoint POST /api/admin/categories (criar) | David | ⏳ | 03/04 18h |
| 9.1.4 | Endpoint PATCH /api/admin/categories/:id | David | ⏳ | 03/04 18h |

---

### 9.2 Frontend - Gestão de Categorias
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 9.2.1 | Página /admin/categorias | Lia | ⏳ | 03/04 18h |
| 9.2.2 | Tabela com categorias | Lia | ⏳ | 03/04 19h |
| 9.2.3 | Modal criar/editar categoria | Lia | ⏳ | 03/04 19h |

---

## 🔔 FASE 10: Notificações (Básico - MVP)

### 10.1 Backend - Notificações
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 10.1.1 | Configurar Nodemailer (SMTP) | David | ⏳ | 03/04 20h |
| 10.1.2 | Template de e-mail: anúncio aprovado | David | ⏳ | 03/04 20h |
| 10.1.3 | Template de e-mail: anúncio rejeitado | David | ⏳ | 03/04 21h |
| 10.1.4 | Template de e-mail: pagamento confirmado | David | ⏳ | 03/04 21h |

---

## 🧪 FASE 11: Testes e Ajustes Finais

### 11.1 Testes de Integração
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 11.1.1 | Testar fluxo completo: cadastro → anúncio → pagamento → aprovação | Chiara | ⏳ | 03/04 22h |
| 11.1.2 | Testar responsividade mobile | Lia | ⏳ | 03/04 22h |
| 11.1.3 | Testar performance (Lighthouse) | David | ⏳ | 03/04 23h |
| 11.1.4 | Corrigir bugs críticos | Todos | ⏳ | 04/04 00h |

---

### 11.2 Deploy
| # | Tarefa | Responsável | Status | Prazo |
|---|--------|-------------|--------|-------|
| 11.2.1 | Configurar domínio (com Sergio) | Chiara | ⏳ | TBD |
| 11.2.2 | Deploy em Vercel (ou VPS) | David | ⏳ | 04/04 02h |
| 11.2.3 | Configurar banco de produção | David | ⏳ | 04/04 02h |
| 11.2.4 | Testar em produção | Todos | ⏳ | 04/04 03h |

---

## 📝 Notas Importantes

### Prioridades para MVP (até 02/04)
1. 🔥 Setup completo (David) - **EM ANDAMENTO**
2. 🔥 Autenticação básica (David)
3. 🔥 Landing page (Lia)
4. 🔥 Criação de anúncio (David + Lia)
5. 🔥 Vitrine pública (Lia)
6. 🔥 Painel admin (moderação + pagamentos) (David + Lia)
7. 🔥 **Integração Stripe/PayPal (David + Lia)** - ADICIONADO

### Requisitos Técnicos
- **Mobile-first:** Interface otimizada para mobile como prioridade
- **Desktop:** Aparência profissional e de alto impacto
- **Pagamentos:** Stripe/PayPal no MVP, Zelle na próxima semana
- **Design:** Seguir diretrizes do Marco, padrões FBR apenas para software interno

### O que pode ficar para v1.1
- Notificações avançadas
- Sistema de cupons
- URL Shortener
- Analytics detalhado
- Reordenação drag and drop

### Comunicação
- **Updates obrigatórios:** Reportar CADA etapa concluída imediatamente
- **Paralizações:** Justificar bloqueios IMEDIATAMENTE
- **Daily sync:** Telegram grupo às 9h
- **Bloqueios:** Reportar imediatamente no grupo

---

**Última atualização:** 01/04/2026 19:51 UTC  
**Próxima revisão:** 02/04/2026 09:00 UTC  
**Mantido por:** Chiara Garcia
