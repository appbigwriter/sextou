# 🏗️ Arquitetura do Sistema - Sexta do Empreendedor

## 📋 Visão Geral

Sistema completo de marketplace comunitário construído com arquitetura moderna, escalável e segura.

---

## 🎯 Objetivos Arquiteturais

1. **Performance:** Carregamento rápido e responsivo
2. **Escalabilidade:** Suportar crescimento de usuários e anúncios
3. **Segurança:** Proteção de dados e autenticação robusta
4. **Manutenibilidade:** Código limpo e bem documentado
5. **Experiência do Usuário:** Interface intuitiva e fluida

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** TailwindCSS + CSS Modules
- **Components:** shadcn/ui (Radix UI primitives)
- **Forms:** React Hook Form + Zod (validação)
- **State Management:** Zustand (global) + React Query (server state)
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Backend
- **Framework:** Next.js API Routes
- **ORM:** Prisma
- **Database:** PostgreSQL 15+
- **Cache:** Redis (futuro)
- **Queue:** Bull (futuro, para jobs assíncronos)

### Autenticação
- **Library:** NextAuth.js v5
- **Strategy:** JWT + Cookies
- **Providers:** Credentials (email/password)
- **Sessions:** Database sessions

### Storage
- **Images:** Cloudinary ou Vercel Blob (a definir)
- **Videos:** Cloudinary ou AWS S3 (a definir)

### Deployment
- **Hosting:** Vercel (ou VPS próprio)
- **Database:** Vercel Postgres ou PostgreSQL gerenciado
- **Domain:** A definir com Sergio
- **SSL:** Automático (Vercel) ou Let's Encrypt

---

## 📐 Arquitetura de Camadas

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                  │
│  (Next.js App Router + React Components)         │
│  - Pages                                         │
│  - Components                                    │
│  - Layouts                                       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│               BUSINESS LOGIC LAYER               │
│  (API Routes + Server Actions)                   │
│  - Authentication                                │
│  - Ad Management                                 │
│  - Payment Processing                            │
│  - Moderation                                    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                 DATA ACCESS LAYER                │
│  (Prisma ORM)                                    │
│  - Models                                        │
│  - Queries                                       │
│  - Transactions                                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                   DATABASE                       │
│  (PostgreSQL)                                    │
│  - Users, Ads, Payments, etc.                    │
└─────────────────────────────────────────────────┘
```

---

## 🗂️ Estrutura de Diretórios

```
sexta-do-empreendedor/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rotas autenticadas
│   │   │   ├── login/
│   │   │   └── cadastro/
│   │   ├── (anunciante)/      # Dashboard do anunciante
│   │   │   ├── dashboard/
│   │   │   ├── anuncios/
│   │   │   └── perfil/
│   │   ├── (admin)/           # Painel administrativo
│   │   │   ├── dashboard/
│   │   │   ├── moderacao/
│   │   │   └── relatorios/
│   │   ├── (public)/          # Páginas públicas
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── anuncios/      # Vitrine
│   │   │   └── [slug]/        # Detalhes do anúncio
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── ads/
│   │   │   ├── payments/
│   │   │   └── admin/
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Estilos globais
│   │
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes primitivos
│   │   ├── layout/           # Header, Footer, etc
│   │   ├── ads/              # Componentes de anúncios
│   │   ├── forms/            # Formulários
│   │   └── admin/            # Componentes admin
│   │
│   ├── lib/                  # Utilitários e configurações
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth config
│   │   ├── utils.ts          # Helpers gerais
│   │   └── validations.ts    # Schemas Zod
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAds.ts
│   │   └── useToast.ts
│   │
│   ├── types/                # TypeScript types
│   │   ├── ad.ts
│   │   ├── user.ts
│   │   └── payment.ts
│   │
│   └── styles/               # Estilos
│       ├── colors.css
│       └── fonts.css
│
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   ├── migrations/           # Migrações
│   └── seed.ts              # Dados iniciais
│
├── public/
│   ├── assets/              # Imagens, logo, etc
│   └── fonts/               # Fontes locais
│
├── docs/                    # Documentação
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── STYLEGUIDE.md
│   └── DELIVERABLES.md
│
├── .env.example             # Variáveis de ambiente
├── next.config.js           # Config Next.js
├── tailwind.config.js       # Config Tailwind
├── tsconfig.json            # Config TypeScript
└── package.json             # Dependências
```

---

## 🔐 Fluxos de Autenticação

### 1. Cadastro de Anunciante
```
[Usuário] → Formulário de Cadastro
          ↓
[API] → Validação + Hash de Senha
          ↓
[Database] → Criar User
          ↓
[NextAuth] → Login Automático
          ↓
[Redirect] → Dashboard do Anunciante
```

### 2. Login
```
[Usuário] → Formulário de Login
          ↓
[NextAuth] → Verificar Credenciais
          ↓
[Database] → Buscar User + Validar Senha
          ↓
[Session] → Criar Sessão JWT
          ↓
[Redirect] → Dashboard apropriado
```

---

## 📝 Fluxo de Criação de Anúncio

```
1. [Anunciante] → Clica em "Criar Anúncio"
2. [Form Step 1] → Informações Básicas (título, categoria, descrição)
3. [Form Step 2] → Detalhes (preço, localização, tipo)
4. [Form Step 3] → Mídia (imagens, vídeo)
5. [Form Step 4] → Contato (WhatsApp, links)
6. [Preview] → Revisar anúncio
7. [Submit] → Salvar como DRAFT
8. [Payment Page] → Escolher data da sexta-feira + Pagar
9. [Status] → AWAITING_PAYMENT
10. [Zelle Manual] → Anunciante envia comprovante
11. [Admin] → Confirma pagamento → PAID
12. [Status] → UNDER_REVIEW
13. [Admin] → Aprova ou Rejeita
14. [Se aprovado] → APPROVED → Aguarda scheduled_date
15. [Na sexta-feira] → PUBLISHED (automático)
16. [Após 7 dias] → EXPIRED
```

---

## ⚙️ Fluxo Administrativo

### Moderação de Anúncios
```
[Admin Dashboard] → Lista de anúncios UNDER_REVIEW
                ↓
[Admin] → Clica em anúncio
                ↓
[Modal] → Visualiza detalhes completos
                ↓
[Decision] → Aprovar ou Rejeitar
                ↓ (se rejeitar)
[Form] → Adiciona motivo da rejeição
                ↓
[API] → Atualiza status + Envia notificação
                ↓
[Admin Log] → Registra ação de auditoria
```

---

## 🔄 Sistema de Status

### Status de Anúncio
```
DRAFT → AWAITING_PAYMENT → PAID → UNDER_REVIEW
                                        ↓
                        ┌───────────────┴───────────────┐
                        ↓                               ↓
                    APPROVED                        REJECTED
                        ↓
                    PUBLISHED
                        ↓
                    EXPIRED
```

### Status de Pagamento
```
PENDING → CONFIRMED → (Anúncio vai para PAID)
        ↘
         FAILED ou REFUNDED
```

---

## 🔒 Segurança

### Autenticação
- Senhas com bcrypt (10 rounds)
- JWT com expiração de 7 dias
- Refresh tokens (futuro)
- Session storage em banco

### Autorização
```typescript
Roles:
- USER (anunciante)
- ADMIN (super_admin, moderator, financial)

Permissions:
- USER: criar/editar próprios anúncios
- MODERATOR: aprovar/rejeitar anúncios
- FINANCIAL: confirmar pagamentos
- SUPER_ADMIN: todas as permissões
```

### Validações
- Client-side: Zod schemas
- Server-side: Zod + sanitização
- Upload: validação de tipo, tamanho e conteúdo
- SQL Injection: Prisma protege automaticamente

### Rate Limiting (futuro)
- Login: 5 tentativas / 15 min
- API calls: 100 req / min por IP
- Upload: 10 imagens / hora

---

## 📊 Performance

### Otimizações
- **Images:** Next.js Image component + Cloudinary CDN
- **Code Splitting:** Automático com Next.js
- **Lazy Loading:** Componentes pesados
- **Database Indexes:** Em todas as queries frequentes
- **Caching:** Redis para dados frequentes (futuro)

### Métricas Alvo
- **Time to First Byte:** < 200ms
- **Largest Contentful Paint:** < 2.5s
- **First Input Delay:** < 100ms
- **Cumulative Layout Shift:** < 0.1

---

## 🚀 Deploy

### Ambientes
1. **Development:** Local (npm run dev)
2. **Staging:** Vercel preview (a definir)
3. **Production:** Vercel ou VPS (a definir com Sergio)

### CI/CD (futuro)
- GitHub Actions
- Testes automatizados
- Deploy automático na main

---

## 📈 Escalabilidade

### Fase 1 (MVP)
- Suporta 100 anúncios ativos simultâneos
- 500 usuários cadastrados
- 1000 visitas/dia

### Fase 2
- Database replicas (read/write split)
- Redis cache layer
- CDN para assets estáticos
- Background jobs com Bull

### Fase 3
- Microserviços (se necessário)
- Kubernetes (se necessário)
- Multiple regions

---

## 🧪 Testes (futuro)

### Unit Tests
- Vitest + React Testing Library
- Cobertura mínima: 70%

### Integration Tests
- Playwright ou Cypress
- Fluxos críticos: login, criar anúncio, aprovar

### E2E Tests
- Playwright
- Cenários reais de uso

---

## 📝 Monitoramento (futuro)

### Logs
- Vercel Analytics
- Sentry (erros)
- Winston (logs estruturados)

### Métricas
- Google Analytics 4
- Vercel Web Analytics
- Uptime monitoring

---

## 🔮 Roadmap Técnico

### MVP (Semana 1-2)
- [x] Setup do projeto
- [x] Modelagem do banco
- [ ] Autenticação
- [ ] CRUD de anúncios
- [ ] Painel admin básico

### v1.1 (Semana 3-4)
- [ ] Sistema de pagamento manual
- [ ] Upload de imagens
- [ ] Notificações por e-mail
- [ ] SEO otimizado

### v1.2 (Semana 5-6)
- [ ] Analytics e relatórios
- [ ] Sistema de cupons
- [ ] Exportação CSV
- [ ] Performance tuning

### v2.0 (Futuro)
- [ ] Integração Stripe/PayPal
- [ ] App mobile (React Native)
- [ ] Sistema de avaliações
- [ ] Marketplace diário

---

**Documento criado em:** 01/04/2026  
**Mantido por:** Chiara Garcia  
**Versão:** 1.0
