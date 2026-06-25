# WhatsApp (ZapLeads) via Evolution API

A integração de WhatsApp do ZapLeads **não usa mais** `whatsapp-web.js`/puppeteer
(que rodava um Chromium headless e era frágil: caminho do executável, locks de
perfil, processos órfãos, alto consumo de RAM, concorrência entre instâncias).

Agora o app fala **REST** com um serviço **Evolution API v2** dedicado e recebe
as mensagens recebidas via **webhook**. Cada usuário tem uma instância isolada
chamada `zapleads-{userId}`.

> Nota de risco: extrair membros de grupos para abordagem comercial continua
> sendo contra os Termos do WhatsApp e carrega risco de banimento. A Evolution
> resolve a **estabilidade técnica**, não o risco de ToS. Use volumetria baixa,
> aquecimento e, de preferência, um número dedicado.

---

## Arquitetura

```
┌────────────┐   REST (apikey)   ┌────────────────┐
│  Next app  │ ────────────────▶ │  Evolution API │ ──▶ WhatsApp
│ (sextou)   │ ◀──────────────── │   (+Postgres   │
└────────────┘   webhook (msgs)  │    +Redis)     │
                                  └────────────────┘
```

App e Evolution ficam na **mesma rede Docker** (no Easypanel: `sextadoempreendedor`),
então o webhook usa URL **interna** — não precisa expor a Evolution publicamente
para o app receber mensagens.

---

## Variáveis de ambiente (app)

O serviço Evolution **já está provisionado na VPS** (Easypanel, projeto separado),
então o app fala com ele pela **URL pública** e o webhook volta pelo **domínio
público do app** (`sextou.biz`).

| Var | Valor |
|---|---|
| `EVOLUTION_API_URL` | `https://tools-evolution-api.ldm9ti.easypanel.host` |
| `EVOLUTION_API_KEY` | `AUTHENTICATION_API_KEY` da Evolution (ver painel da Evolution) |
| `EVOLUTION_WEBHOOK_URL` | `https://sextou.biz/api/zapleads/whatsapp/webhook` |
| `EVOLUTION_WEBHOOK_TOKEN` | segredo compartilhado que valida o webhook (gerado no setup) |

> Em produção, defina essas 4 variáveis no **painel do app no Easypanel**
> (o `docker-compose.easypanel.yml` as repassa via `${...}`). O `.env.local`
> já contém os mesmos valores para desenvolvimento.
>
> O webhook é (re)configurado automaticamente a cada conexão (`setWebhook`),
> então não precisa ser ajustado manualmente na Evolution.

---

## Subir a Evolution API no Easypanel

1. **Crie um Postgres** (ou reaproveite o existente) e **um Redis** no Easypanel.
2. **Crie um serviço** a partir da imagem `atendai/evolution-api:v2.2.1`
   (App → Create → Docker Image), na **mesma rede** do app (`sextadoempreendedor`).
3. Defina as variáveis de ambiente da Evolution:

```env
SERVER_TYPE=http
SERVER_PORT=8080
SERVER_URL=https://evolution.SEUDOMINIO.com.br   # domínio público da Evolution (p/ o QR/admin)

AUTHENTICATION_API_KEY=<gere-uma-chave-forte>      # = EVOLUTION_API_KEY do app

DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://USER:SENHA@postgres:5432/evolution?schema=evolution_api
DATABASE_CONNECTION_CLIENT_NAME=evolution-api
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true

CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://redis:6379/6
CACHE_REDIS_PREFIX_KEY=evolution
CACHE_REDIS_SAVE_INSTANCES=false

LOG_LEVEL=ERROR,WARN,INFO,LOG
CORS_ORIGIN=*
DEL_INSTANCE=false
```

4. Exponha a Evolution por um domínio (Traefik) apenas se quiser acessar o painel
   dela; **o app não precisa do domínio público** (fala pela rede interna).
5. No **serviço do app**, defina `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`,
   `EVOLUTION_WEBHOOK_URL`, `EVOLUTION_WEBHOOK_TOKEN` (tabela acima).
6. Faça **redeploy** do app.

---

## Dev local (opcional)

Suba a Evolution localmente via Docker (exemplo mínimo):

```bash
docker run -d --name evolution -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=change-me-local \
  -e DATABASE_PROVIDER=postgresql \
  -e DATABASE_CONNECTION_URI="postgresql://postgres:postgres@host.docker.internal:5432/evolution?schema=evolution_api" \
  -e CACHE_REDIS_ENABLED=false \
  atendai/evolution-api:v2.2.1
```

Ajuste `.env.local` (já preparado) com `EVOLUTION_API_KEY=change-me-local`.
O webhook para o host usa `http://host.docker.internal:3000/...`.

---

## Como validar

1. Acesse `/api/zapleads/whatsapp/diag` (logado). Deve mostrar
   `"ok": true` e `"status"` da instância. Se mostrar
   `EVOLUTION_NOT_CONFIGURED` ou `EVOLUTION_UNREACHABLE`, revise URL/chave/rede.
2. Em `/sextou-tools-pro/zapleads` → **Conectar via QR Code** → escaneie.
3. Após conectar, o card de extração habilita; **Carregar Lista de Grupos**
   deve listar seus grupos.
4. Mande uma mensagem de um contato extraído para o número conectado e confira
   se o lead reage no Auto-Heat (precisa do `EVOLUTION_WEBHOOK_URL` correto).

---

## Endpoints do app (inalterados para o frontend)

| Endpoint | Função |
|---|---|
| `GET /api/zapleads/whatsapp/qr` | cria a instância + retorna o QR (raw code) |
| `GET /api/zapleads/whatsapp/status` | estado da conexão (`CONNECTED`/`AWAITING_QR`/`DISCONNECTED`) |
| `GET /api/zapleads/whatsapp/groups` | lista grupos |
| `POST /api/zapleads/whatsapp/extract` | extrai membros do grupo → leads |
| `POST /api/zapleads/outreach/send` | envia mensagem |
| `POST /api/zapleads/whatsapp/webhook` | **(novo)** recebe mensagens da Evolution (Auto-Heat) |
| `GET /api/zapleads/whatsapp/diag` | diagnóstico do subsistema |
