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
DATABASE_URL=postgresql://postgres:SUA_SENHA@postgresql:5432/sextadoempreendedor
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=gere_uma_chave_aqui_com_no_minimo_32_caracteres
NODE_ENV=production
```

**Para gerar NEXTAUTH_SECRET**, execute no terminal:
```bash
openssl rand -base64 32
```

---

## Passo 3: Deploy via Git (Recomendado)

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
  sexta-empreendedor
```

---

## Passo 4: Configurar Proxy (Traefik)

No EasyPanel, o Traefik já vem integrado. Ao criar o app:

1. Marque **Assign to Traefik**
2. Configure o domínio em **Domain**
3. O SSL será gerado automaticamente

---

## Passo 5: Executar Migrações

Após o deploy, as migrações devem executar automaticamente. Se necessário, você pode executar manualmente:

```bash
npx prisma migrate deploy
```

Ou criar um seed inicial:
```bash
npx prisma db seed
```

---

## Estrutura de Arquivos para Deploy

```
/
├── Dockerfile           # Imagem do app
├── docker-compose.yml   # Compose original (sem banco)
├── .env.production     # Vars de produção
├── prisma/
│   └── schema.prisma   # Schema PostgreSQL
├── app/                # Código Next.js
├── package.json
└── next.config.js
```

---

## Troubleshooting

### Erro de conexão com banco
- Verifique se o banco está no mesmo network Docker
- Confirme a DATABASE_URL está correta

### Erro 500 após deploy
- Execute `npx prisma generate` no container
- Verifique as variáveis de ambiente

### SSL não funcionando
- Confirme que o domínio aponta para o IP correto
- Aguarde até 5 min para propagation

---

## Comandos Úteis

```bash
# Ver logs
docker logs sexta-empreendedor

# Reiniciar app
docker restart sexta-企empreendedor

# Acessar shell
docker exec -it sexta-empreendedor sh
```

---

## Próximos Passos

1. Acesse `/login` para testar autenticação
2. Acesse `/admin` para acessar painel administrativo
3. Crie categorias iniciais via banco ou painel admin