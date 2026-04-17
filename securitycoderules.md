# Security Code Rules — SEXTOU.biz

## Regras Inegociáveis de Segurança

Estas regras NUNCA podem ser violadas em nenhum código, batch ou tarefa.

---

## 1. Autenticação e Autorização

### 1.1 Autenticação
- **Obrigatório:** NextAuth.js v5 com iron-session
- **JWT:** Expiração de 7 dias máximo
- **Refresh tokens:** Implementar em v1.1+
- **Senhas:** bcrypt com 10 rounds mínimo
- **NUNCA:** Senhas em plain text, NUNCA em logs

### 1.2 Autorização
- **RBAC:** Roles definidos: `USER`, `ADMIN` (super_admin, moderator, financial)
- **Middleware:** Toda rota `/api/admin/*` valida role
- **RLS:** Row Level Security habilitado em PostgreSQL
- **NUNCA:** Autorização apenas no frontend

```typescript
// ✅ Correto
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});
  if (session.user.role !== 'ADMIN') return Response.json({error: 'Forbidden'}, {status: 403});
  // ... lógica
}

// ❌ Errado
export async function GET(req: Request) {
  // Confia no header X-User-Id sem validação
  const userId = req.headers.get('X-User-Id');
}
```

---

## 2. Validação de Dados

### 2.1 Input Validation
- **Obrigatório:** Zod para validação de schemas
- **Client-side:** React Hook Form + Zod
- **Server-side:** Zod em TODAS as API Routes
- **NUNCA:** Confiar em validação apenas no frontend

```typescript
// ✅ Correto
import { z } from 'zod';

const adSchema = z.object({
  title: z.string().min(3).max(100),
  price: z.number().positive().optional(),
  email: z.string().email()
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = adSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({error: parsed.error}, {status: 422});
  }
  // ... usar parsed.data
}
```

### 2.2 Sanitização
- **Obrigatório:** Sanitizar HTML user-generated com DOMPurify
- **Obrigatório:** Escapar queries SQL (Prisma faz automaticamente)
- **NUNCA:** Renderizar user input diretamente com `dangerouslySetInnerHTML`

---

## 3. Secrets e Credenciais

### 3.1 Variáveis de Ambiente
- **Obrigatório:** Todos os secrets em `.env` ou Vercel Environment Variables
- **NUNCA:** Secrets hardcoded no código
- **NUNCA:** Secrets commitados no Git
- **Obrigatório:** `.env.example` com placeholders

```bash
# ✅ Correto (.env)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
CLOUDINARY_API_KEY="..."

# ❌ Errado (no código)
const apiKey = "ak_live_123456789";
```

### 3.2 Exposição de Secrets
- **NUNCA:** Enviar secrets para o frontend
- **NUNCA:** Logar secrets em console ou arquivos
- **Obrigatório:** Usar `NEXT_PUBLIC_` apenas para variáveis públicas não-sensíveis

---

## 4. SQL Injection e XSS

### 4.1 SQL Injection
- **Proteção:** Prisma ORM previne automaticamente
- **NUNCA:** Usar raw SQL queries sem parametrização
- **Se necessário raw SQL:** Usar `Prisma.$queryRaw` com placeholders

```typescript
// ✅ Correto (Prisma ORM)
const ads = await prisma.ad.findMany({
  where: { userId: session.user.id }
});

// ✅ Correto (raw SQL parametrizado)
const result = await prisma.$queryRaw`
  SELECT * FROM ads WHERE user_id = ${userId}
`;

// ❌ Errado (concatenação de string)
const query = `SELECT * FROM ads WHERE user_id = '${userId}'`;
```

### 4.2 XSS (Cross-Site Scripting)
- **Proteção:** React escapa automaticamente
- **NUNCA:** Usar `dangerouslySetInnerHTML` sem sanitização
- **Se necessário:** Usar DOMPurify

```tsx
// ✅ Correto
<p>{ad.description}</p>

// ✅ Correto com sanitização
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(ad.htmlContent)}} />

// ❌ Errado
<div dangerouslySetInnerHTML={{__html: ad.userContent}} />
```

---

## 5. CSRF (Cross-Site Request Forgery)

### 5.1 Proteção
- **Obrigatório:** NextAuth.js tem proteção CSRF built-in
- **Obrigatório:** SameSite cookies = `Strict` ou `Lax`
- **NUNCA:** Permitir GET requests que modificam dados

```typescript
// ✅ Correto
export async function POST(req: Request) {
  // NextAuth valida CSRF token automaticamente
  // ... lógica de modificação de dados
}

// ❌ Errado
export async function GET(req: Request) {
  // Deletar via GET é vulnerável a CSRF
  await prisma.ad.delete({where: {id}});
}
```

---

## 6. Rate Limiting

### 6.1 Implementação
- **Obrigatório:** Rate limiting em rotas sensíveis:
  - Login: 5 tentativas / 15 min
  - Cadastro: 3 cadastros / hora por IP
  - Upload: 10 uploads / hora
  - API calls: 100 req / min por usuário

```typescript
// ✅ Implementar com middleware
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 requests
  message: 'Too many attempts, please try again later'
});
```

---

## 7. File Upload

### 7.1 Validação
- **Obrigatório:** Validar tipo MIME e extensão
- **Obrigatório:** Limite de tamanho (5MB para imagens, 50MB para vídeo)
- **Obrigatório:** Renomear arquivo (UUID + timestamp)
- **NUNCA:** Confiar no filename do usuário
- **NUNCA:** Executar arquivos uploadados

```typescript
// ✅ Correto
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

if (!allowedTypes.includes(file.type)) {
  return Response.json({error: 'Invalid file type'}, {status: 400});
}

if (file.size > maxSize) {
  return Response.json({error: 'File too large'}, {status: 400});
}

const newFilename = `${uuidv4()}-${Date.now()}.${ext}`;
```

---

## 8. Logs e Auditoria

### 8.1 Logs de Segurança
- **Obrigatório:** Logar todas as ações administrativas:
  - Aprovação/rejeição de anúncios
  - Confirmação de pagamentos
  - Edição/exclusão de dados
  - Login/logout de admins

```typescript
// ✅ Correto
await prisma.adminAction.create({
  data: {
    adminId: session.user.id,
    actionType: 'APPROVE_AD',
    entityType: 'AD',
    entityId: ad.id,
    details: { adTitle: ad.title, reason: approvalReason },
    createdAt: new Date()
  }
});
```

### 8.2 O que NUNCA logar
- Senhas (mesmo hashed)
- Tokens JWT completos
- Números de cartão de crédito
- CPF/RG
- Comprovantes de pagamento (apenas URL)

---

## 9. HTTPS e Transport Security

### 9.1 Obrigatório
- **Produção:** HTTPS obrigatório (Vercel faz automaticamente)
- **Cookies:** Secure flag = true, HttpOnly = true
- **Headers:** HSTS, X-Content-Type-Options, X-Frame-Options

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  }
};
```

---

## 10. Row Level Security (RLS)

### 10.1 PostgreSQL RLS
- **Obrigatório:** Habilitar RLS em TODAS as tabelas
- **Políticas:** User só acessa próprios dados
- **Admin:** Role com bypass RLS apenas via função específica

```sql
-- ✅ Habilitar RLS
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Política: User só vê próprios anúncios
CREATE POLICY user_ads_policy ON ads
  FOR ALL
  USING (user_id = current_setting('app.user_id')::uuid);

-- Política: Admin vê tudo
CREATE POLICY admin_ads_policy ON ads
  FOR ALL
  TO admin_role
  USING (true);
```

---

## 11. Error Handling

### 11.1 Mensagens de Erro
- **NUNCA:** Expor stack traces em produção
- **NUNCA:** Revelar estrutura do banco
- **Obrigatório:** Mensagens genéricas para o usuário
- **Obrigatório:** Logs detalhados no servidor

```typescript
// ✅ Correto
try {
  // ... lógica
} catch (error) {
  console.error('[AD_CREATE_ERROR]', error); // Log detalhado no servidor
  return Response.json(
    {error: 'Failed to create ad. Please try again.'}, // Mensagem genérica
    {status: 500}
  );
}

// ❌ Errado
catch (error) {
  return Response.json({error: error.message}, {status: 500}); // Expõe detalhes internos
}
```

---

## 12. Dependency Security

### 12.1 Manutenção
- **Obrigatório:** Rodar `npm audit` antes de cada deploy
- **Obrigatório:** Atualizar dependências com vulnerabilidades HIGH ou CRITICAL
- **Obrigatório:** Usar `npm audit fix` automaticamente

```bash
# ✅ Antes de deploy
npm audit
npm audit fix
```

---

## Checklist de Segurança por Task

Antes de marcar qualquer task como Done, verificar:

- [ ] Validação de input (Zod) implementada
- [ ] Autorização verificada (role check)
- [ ] RLS testado (User A não acessa dados de User B)
- [ ] Secrets não hardcoded
- [ ] Sanitização de HTML (se aplicável)
- [ ] Rate limiting implementado (se rota sensível)
- [ ] Logs de auditoria criados (se ação administrativa)
- [ ] Mensagens de erro genéricas (não expõem detalhes internos)
- [ ] README.md atualizado com feature

---

**Última atualização:** 01/04/2026  
**Mantido por:** Chiara Garcia  
**Versão:** 1.0
