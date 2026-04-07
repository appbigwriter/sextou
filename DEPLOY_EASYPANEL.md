# Deploy no EasyPanel - Sexta do Empreendedor

## Pré-requisitos

1. **EasyPanel instalado** na sua VPS
2. **Domínio** apontando para o IP da VPS

---

## Passo 1: Criar Banco de Dados no EasyPanel

1. Acesse o painel do EasyPanel
2. Vá em **Databases** → **New Database**
3. Configure:
   - **Name**: `sextadoempreendedor`
   - **Type**: PostgreSQL
   - **User**: `postgres`
   - **Password**: `SuaSenhaForte123`
4. Clique em **Create**
5. Após criado, copie a **Connection URL** (algo como `postgresql://postgres:senha@host:5432/sextadoempreendedor`)

---

## Passo 2: Configurar Variáveis de Ambiente

No EasyPanel, vá em **Apps** → **seu-app** → **Environment Variables** e adicione:

```
# Banco de Dados
DATABASE_URL=postgresql://postgres:SUA_SENHA@host:5432/sextadoempreendedor

# NextAuth.js
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=gere_uma_chave_aqui_com_no_minimo_32_caracteres

# Domínio
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
DOMAIN=seu-dominio.com

# Stripe (obtenha em https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
SMTP_FROM=noreply@seu-dominio.com

# Ambiente
NODE_ENV=production
```

**Para gerar NEXTAUTH_SECRET**, execute no terminal:
```bash
openssl rand -base64 32
```

---

## Passo 3: Obter Chaves do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Crie uma conta ou faça login
3. Vá em **Developers** → **API Keys**
4. Copie as chaves de **Test Mode**:
   - `STRIPE_SECRET_KEY` (inicia com `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (inicia com `pk_test_`)

5. Para webhooks, vá em **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://seu-dominio.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`, `charge.refunded`
   - Copie o **Signing secret** (inicia com `whsec_`)

---

## Passo 4: Deploy via Git (Recomendado)

### Opção A: GitHub/GitLab

1. Faça push do código para seu repositório Git
2. No EasyPanel: **Apps** → **New App**
3. Configure:
   - **Name**: `sexta-empreendedor`
   - **Repository**: URL do seu repo
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `node server.js`
4. Clique em **Create**

### Opção B: Docker (Manual)

1. Build da imagem:
```bash
docker build -t sexta-empreendedor .
```

2. Execute o container:
```bash
docker run -d \
  --name sexta-empreendedor \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_URL="https://..." \
  -e NEXTAUTH_SECRET="..." \
  -e STRIPE_SECRET_KEY="sk_test_..." \
  -e STRIPE_WEBHOOK_SECRET="whsec_..." \
  -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." \
  sexta-empreendedor
```

---

## Passo 5: Configurar Proxy (Traefik)

No EasyPanel, o Traefik já vem integrado. Ao criar o app:

1. Marque **Assign to Traefik**
2. Configure o domínio em **Domain**
3. O SSL será gerado automaticamente

---

## Passo 6: Executar Migrações

Após o deploy, as migrações devem executar automaticamente. Se necessário, você pode executar manualmente:

```bash
npx prisma migrate deploy
```

---

## Estrutura de Arquivos para Deploy

```
/
├── Dockerfile                    # Imagem do app
├── docker-compose.easypanel.yml # Compose para EasyPanel
├── .env.production              # Vars de produção (não commitar)
├── prisma/
│   └── schema.prisma            # Schema PostgreSQL
├── app/                         # Código Next.js
├── package.json
└── next.config.js
```

---

## Variáveis de Ambiente Obrigatórias

| Variável | Descrição | Exemplo |
|----------|------------|---------|
| `DATABASE_URL` | Conexão PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | URL do site | `https://seu-dominio.com` |
| `NEXTAUTH_SECRET` | Chave auth (32+ chars) | `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Chave API Stripe | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Assinatura webhook | `whsec_...` |

---

## Testando o Deploy

1. Acesse `https://seu-dominio.com/api/health` - deve retornar `{"status":"ok"}`
2. Acesse `https://seu-dominio.com/login` - página de login
3. Acesse `https://seu-dominio.com/admin` - painel admin
4. Teste pagamento com cartão teste Stripe: `4242 4242 4242 4242`

---

## Troubleshooting

### Erro de conexão com banco
- Verifique se o banco está no mesmo network Docker
- Confirme a DATABASE_URL está correta

### Erro 500 após deploy
- Execute `npx prisma generate` no container
- Verifique as variáveis de ambiente

### Stripe não funciona
- Verifique se as chaves estão corretas (use modo teste)
- Configure o webhook no Stripe Dashboard

### SSL não funcionando
- Confirme que o domínio aponta para o IP correto
- Aguarde até 5 min para propagation

---

## Comandos Úteis

```bash
# Ver logs
docker logs sexta-empreendedor

# Reiniciar app
docker restart sexta-empreendedor

# Acessar shell
docker exec -it sexta-empreendedor sh

# Executar migrações
docker exec -it sexta-empreendedor npx prisma migrate deploy

# Verificar health
curl http://localhost:3000/api/health
```

---

## Próximos Passos

1. Configure as categorias iniciais via painel admin
2. Teste o fluxo completo: cadastro → anúncio → pagamento → aprovação
3. Configure domínio em produção

---

## Notas sobre Stripe

- O sistema funciona com ou sem Stripe configurado
- Sem Stripe: apenas pagamento Zelle manual
- Com Stripe: checkout automático com cartão de crédito
- Use cartões de teste: `4242 4242 4242 4242` (exp any, cvc any)