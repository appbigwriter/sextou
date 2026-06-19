# Backup e Recuperacao

Este projeto deve ter backup em 3 camadas:

1. Banco de dados PostgreSQL.
2. Codigo e configuracoes do projeto.
3. Teste de restauracao periodico.

## Scripts incluidos

- `npm run backup:db`
- `npm run backup:project`
- `npm run backup:all`
- `npm run backup:prune`
- `npm run backup:upload`
- `npm run backup:maintain`

Os arquivos sao gravados em:

- `backups/db/`
- `backups/project/`

`backups/` fica fora do Git.

## Banco

O script de banco usa:

- `BACKUP_DATABASE_URL`, se existir.
- Caso contrario, `DATABASE_URL`.

Recomendacao importante:

- Para backup, prefira uma URL direta do Postgres.
- Evite usar pooler/connection string de pool quando possivel.

Exemplo de uso:

```powershell
npm run backup:db
```

Se o `pg_dump` nao estiver no `PATH`, configure:

```powershell
$env:PG_DUMP_PATH="C:\Program Files\PostgreSQL\16\bin\pg_dump.exe"
npm run backup:db
```

## Projeto

O backup do projeto inclui codigo, Prisma, public, scripts, compose e arquivos principais.

Por padrao, ele nao inclui `.env`.

Se quiser incluir secrets no backup do projeto:

```powershell
$env:INCLUDE_ENV="1"
npm run backup:project
```

Use isso apenas se o destino do backup for realmente seguro.

## Backup completo

```powershell
npm run backup:all
```

## Retencao automatica

Para manter apenas os backups mais recentes:

```powershell
npm run backup:prune
```

Variaveis opcionais:

```powershell
$env:BACKUP_KEEP_DB="14"
$env:BACKUP_KEEP_PROJECT="14"
```

## Envio externo para S3 compativel

Se quiser mandar os arquivos para S3, Backblaze, Wasabi ou outro endpoint compativel:

```powershell
$env:BACKUP_S3_BUCKET="meu-bucket"
$env:BACKUP_S3_REGION="us-east-1"
$env:BACKUP_S3_PREFIX="sextou-prod"
npm run backup:upload
```

Se o provider exigir endpoint proprio:

```powershell
$env:BACKUP_S3_ENDPOINT="https://SEU-ENDPOINT"
$env:BACKUP_S3_FORCE_PATH_STYLE="1"
```

Credenciais esperadas pelo SDK:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN` (se houver)

## Pipeline unico para agendar

O comando abaixo:

1. gera backup do banco
2. gera backup do projeto
3. aplica retencao
4. envia para S3 se `BACKUP_S3_BUCKET` estiver configurado

```powershell
npm run backup:maintain
```

## Restauracao do banco

Para restaurar um dump custom do Postgres:

```powershell
pg_restore --clean --if-exists --no-owner --no-privileges -d "SUA_DATABASE_URL" .\backups\db\ARQUIVO.dump
```

Antes de restaurar em producao:

1. Restaurar primeiro em banco de homologacao.
2. Validar tabelas principais, usuarios, anuncios, videos e auth.
3. So depois aplicar em producao.

## Agendamento recomendado

### Banco

- Diario: backup completo.
- Antes de cada migracao: backup manual extra.

### Projeto

- Diario ou a cada deploy relevante.
- Sempre antes de alteracoes estruturais grandes.

### Destino externo

Idealmente, copie os artefatos para um destino fora da VPS:

- S3 / Backblaze / Wasabi
- Google Drive corporativo
- Outro servidor

## Agendamento

### Linux / VPS / cron

Exemplo diario as 03:15:

```bash
15 3 * * * cd /caminho/do/projeto && /usr/bin/npm run backup:maintain >> /var/log/sextou-backup.log 2>&1
```

### Windows Task Scheduler

Programa:

```text
npm.cmd
```

Argumentos:

```text
run backup:maintain
```

Diretorio inicial:

```text
C:\Projetos\2SextaEmpreendedor
```

## Rotina minima recomendada

1. Backup diario do banco.
2. Backup diario do projeto.
3. Backup extra antes de migracoes Prisma.
4. Retencao de pelo menos 7, 14 ou 30 dias.
5. Teste de restauracao pelo menos 1 vez por mes.

## Observacoes especificas deste projeto

- Se o banco principal estiver em Supabase, habilite tambem os backups nativos/PITR no painel do provider.
- Se houver estado operacional em `.wwebjs_auth` e `.wwebjs_cache`, ele ja entra no backup do projeto quando esses diretorios existirem.
- Cloudinary e outros assets externos devem ter politica propria de export/retencao, porque nao ficam dentro do Postgres.
- Para Supabase, o ideal e combinar os dumps locais com PITR nativo do provider.
