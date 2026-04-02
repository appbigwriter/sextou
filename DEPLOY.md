# 🚀 Deploy no Easypanel (VPS Própria)

## Pré-requisitos
- Easypanel instalado na VPS
- Docker e Docker Compose instalados
- Acesso SSH à VPS

---

## 📋 Passo a Passo

### 1. Configurar Variáveis de Ambiente

No Easypanel, configure as seguintes variáveis:

```env
DATABASE_URL=postgresql://postgres:SENHA_FORTE@db:5432/sextadoempreendedor
POSTGRES_PASSWORD=SENHA_FORTE_32_CARACTERES
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=SENHA_NEXTAUTH_32_CARACTERES
```

**⚠️ IMPORTANTE:** Gere senhas seguras com 32 caracteres!

```bash
# Gerar senha segura
openssl rand -base64 32
```

---

### 2. Criar Projeto no Easypanel

1. Acesse Easypanel
2. Clique em **"New Project"**
3. Nome: `sexta-do-empreendedor`
4. Escolha **"Deploy from GitHub"**

---

### 3. Configurar Repositório

- **Repository:** `sergiomvj/denuncia`
- **Branch:** `main`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Port:** `3000`

---

### 4. Adicionar Serviços

#### PostgreSQL:
1. Adicionar **Database** → **PostgreSQL 16**
2. Nome: `sextadoempreendedor-db`
3. Configurar variáveis (user, password, database)

#### App Next.js:
1. Build via Dockerfile
2. Porta: 3000
3. Conectar ao banco via `DATABASE_URL`

---

### 5. Deploy Manual (Alternativa)

Se preferir deploy manual via SSH:

```bash
# Clonar repositório na VPS
git clone https://github.com/sergiomvj/denuncia.git
cd denuncia

# Copiar .env
cp .env.example .env
nano .env  # Editar com valores reais

# Construir e rodar
docker-compose up -d --build

# Ver logs
docker-compose logs -f app
```

---

### 6. Configurar Domínio

No Easypanel:
1. Settings → Domains
2. Adicionar domínio: `sextadoempreendedor.com`
3. Habilitar SSL automático (Let's Encrypt)

---

### 7. Executar Migrações do Banco

```bash
# Acessar container
docker-compose exec app sh

# Rodar migrações
npx prisma migrate deploy

# Criar usuário admin inicial
npx prisma db seed
```

---

### 8. Verificar Deploy

Acessar: `https://seu-dominio.com`

**Checklist:**
- [ ] Landing page carrega
- [ ] /anuncios carrega
- [ ] /anuncios/1 carrega (detalhes)
- [ ] Banco de dados conectado
- [ ] SSL funcionando
- [ ] Logs sem erros

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps

# Verificar logs do banco
docker-compose logs db
```

### Erro: "Module not found"
```bash
# Reconstruir imagem
docker-compose down
docker-compose up -d --build
```

### Erro: "Port 3000 already in use"
```bash
# Ver o que está usando a porta
lsof -i :3000

# Parar container anterior
docker-compose down
```

---

## 📊 Monitoramento

```bash
# Ver logs em tempo real
docker-compose logs -f app

# Ver uso de recursos
docker stats

# Reiniciar serviço
docker-compose restart app
```

---

## 🔄 Atualizar Deploy

```bash
# Puxar últimas mudanças
git pull origin main

# Reconstruir e reiniciar
docker-compose up -d --build

# Rodar migrações (se houver)
docker-compose exec app npx prisma migrate deploy
```

---

## 🆘 Suporte

**Problemas no deploy?**
- Verificar logs: `docker-compose logs -f`
- Verificar variáveis de ambiente: `docker-compose config`
- Contactar: @ChiaraGarcia_bot ou @sergiomvj

---

**Última atualização:** 02/04/2026  
**Mantido por:** Chiara Garcia
