# Deploy Local - EasyPanel

Este método faz o build da aplicação localmente e envia a imagem Docker pronta para o EasyPanel.

---

## Passo 1: Preparar Variáveis de Ambiente

Crie um arquivo `.env.production.local` com as variáveis:

```env
# Banco de Dados (do EasyPanel)
DATABASE_URL=postgresql://postgres:cbecc04c97ffff3d0486@webserver2_postgres_empreendedor:5432/webserver2?sslmode=disable

# NextAuth.js
NEXTAUTH_URL=https://negociosorlando.com
NEXTAUTH_SECRET=DPTP2mxmJJ0W6y9dLurnbf_3oRg

# Cloudinary
CLOUDINARY_CLOUD_NAME=dlyq4g3bc
CLOUDINARY_API_KEY=986916139554355
CLOUDINARY_API_SECRET=DPTP2mxmJJ0W6y9dLurnbf_3oRg

# Stripe (deixe vazio se não usar)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# SMTP (deixe vazio se não usar)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@negociosorlando.com

# Ambiente
NODE_ENV=production
```

---

## Passo 2: Fazer o Build Local

Abra o terminal na pasta do projeto:

```bash
# No Windows (PowerShell)
$env:DATABASE_URL="postgresql://postgres:cbecc04c97ffff3d0486@webserver2_postgres_empreendedor:5432/webserver2?sslmode=disable"
$env:NEXTAUTH_URL="https://negociosorlando.com"
$env:NEXTAUTH_SECRET="DPTP2mxmJJ0W6y9dLurnbf_3oRg"
$env:CLOUDINARY_CLOUD_NAME="dlyq4g3bc"
$env:CLOUDINARY_API_KEY="986916139554355"
$env:CLOUDINARY_API_SECRET="DPTP2mxmJJ0W6y9dLurnbf_3oRg"
$env:NODE_ENV="production"
$env:NEXT_TELEMETRY_DISABLED="1"

npm run build
```

---

## Passo 3: Criar Dockerfile Simplificado

Crie um arquivo `Dockerfile.prod` (sem multi-stage):

```dockerfile
FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", ".next/server.js"]
```

---

## Passo 4: Criar a Imagem Docker

```bash
# Tag da imagem (use seu nome de domínio ou IP)
docker build -t negociosorlando/app:latest -f Dockerfile.prod .

# Ou com build args
docker build \
  --build-arg DATABASE_URL="postgresql://postgres:cbecc04c97ffff3d0486@webserver2_postgres_empreendedor:5432/webserver2?sslmode=disable" \
  --build-arg NEXTAUTH_URL="https://negociosorlando.com" \
  --build-arg NEXTAUTH_SECRET="DPTP2mxmJJ0W6y9dLurnbf_3oRg" \
  --build-arg CLOUDINARY_CLOUD_NAME="dlyq4g3bc" \
  --build-arg CLOUDINARY_API_KEY="986916139554355" \
  --build-arg CLOUDINARY_API_SECRET="DPTP2mxmJJ0W6y9dLurnbf_3oRg" \
  --build-arg NODE_ENV="production" \
  -t negociosorlando/app:latest .
```

---

## Passo 5: Exportar a Imagem

```bash
# Salvar como arquivo tar
docker save negociosorlando/app:latest -o app.tar
```

Isso cria um arquivo `app.tar` (pode ser grande, alguns GB).

---

## Passo 6: Enviar para o EasyPanel

### Opção A: Upload direto (se o EasyPanel permitir)
- EasyPanel → Apps → New App → Docker Image
- Selecione "Upload" e escolha o arquivo `app.tar`

### Opção B: Usar um registry

1. **Docker Hub (gratuito):**
```bash
# Login no Docker Hub
docker login

# Renomear tag
docker tag negociosorlando/app:latest seuusuario/sexta-empreendedor:latest

# Enviar
docker push seuusuario/sexta-empreendedor:latest
```

2. **No EasyPanel:**
   - Apps → New App → Docker Image
   - Cole a URL: `seuusuario/sexta-empreendedor:latest`

---

## Passo 7: Configurar Variáveis no EasyPanel

Após criar o app no EasyPanel, vá em:
**Apps** → **seu-app** → **Environment Variables**

Adicione todas as variáveis listadas no Passo 1.

---

## Passo 8: Executar Migrações

No EasyPanel, vá em **Terminal** do app e execute:

```bash
npx prisma db push
```

---

## Resumo Rápido

| Passo | Comando |
|-------|---------|
| Build local | `npm run build` |
| Criar imagem | `docker build -t app:latest .` |
| Exportar | `docker save app:latest -o app.tar` |
| Importar no EasyPanel | Upload do arquivo tar |
| Migrar banco | `npx prisma db push` |

---

## Problemas Comuns

### "npm run build" falha localmente
- Verifique se tem Node.js 20 instalado
- Execute `npm install --legacy-peer-deps` primeiro

### Imagem muito grande
- Normal, Next.js + dependências ≈ 1-2GB
- Use compressão: `gzip app.tar`

### Acesso ao banco no build
- Não precisa, o build é só compilação
- Banco só é necessário na runtime (no container)