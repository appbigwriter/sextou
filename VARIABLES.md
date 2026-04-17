# Variáveis de Ambiente - SEXTOU.biz

## Variáveis Mínimas (OBRIGATÓRIAS)

O sistema **NÃO FUNCIONA** sem estas variáveis:

```env
# ============================================
# BANCO DE DADOS (OBRIGATÓRIO)
# ============================================

# String de conexão do PostgreSQL
# Format: postgresql://USUARIO:SENHA@HOST:PORTA/NOME_BANCO
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/sextadoempreendedor"


# ============================================
# AUTENTICAÇÃO (OBRIGATÓRIO)
# ============================================

# URL base do site (sem trailing slash)
# Para produção: https://seudominio.com
# Para desenvolvimento: http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Chave secreta para criptografia de sessões
# MÍNIMO 32 caracteres - gere com: openssl rand -base64 32
NEXTAUTH_SECRET=cola_aqui_sua_chave_de_32_caracteres_minimo


# ============================================
# AMBIENTE (OBRIGATÓRIO)
# ============================================

# Ambiente de execução
NODE_ENV=development
```

---

## Variáveis Opcionais

### Cloudinary (Upload de Imagens) - ⚡ RECOMENDADO

```env
# Cloudinary - Obtido em https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789jkl012mno345pqr
```

**Benefícios:**
- Upload simples (drag & drop) - sem precisar de links externos
- Imagens armazenadas permanentemente
- Otimização automática (carregamento rápido)
- CDN global

**Sem Cloudinary**: Usuário precisa fornecer URLs externas (links podem quebrar).

---

### Domínio (Deploy)

```env
# Domínio para configuração do proxy (Traefik)
DOMAIN=seudominio.com
```

---

## Resumo: Mínimo vs Completo

### 🌱 Mínimo (Desenvolvimento Local)

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/sextadoempreendedor"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=chave_secreta_de_32_caracteres_aqui
NODE_ENV=development
```

### 🚀 Produção (EasyPanel)

```env
# Obrigatório
DATABASE_URL="postgresql://postgres:senha@host:5432/sextadoempreendedor"
NEXTAUTH_URL=https://seudominio.com
NEXTAUTH_SECRET=chave_secreta_de_32_caracteres_aqui
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://seudominio.com
DOMAIN=seudominio.com

# Recomendado (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Recomendado (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASSWORD=senha_app
SMTP_FROM=noreply@seudominio.com

# Opcional (Imagens)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## Como Gerar NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([Security.Cryptography.RandomNumber]::GetBytes(32))

# Online (não recomendado para produção)
# https://generate-secret.vercel.app/32
```

---

## Troubleshooting

### "DATABASE_URL is not set"
- Verifique que o arquivo `.env` está na raiz do projeto
- Reinicie o servidor após alterar variáveis

### "NEXTAUTH_SECRET must be at least 32 characters"
- Gere uma nova chave com os comandos acima
- Cole no arquivo `.env`

### "NextAuth URL not set"
- Defina `NEXTAUTH_URL` com a URL completa (incluindo https:// em produção)