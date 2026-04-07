#!/bin/sh
# Script de inicialização: aplica migrations e inicia o servidor

echo "🔄 Verificando conexão com o banco de dados..."

# Aguardar banco estar pronto (até 30s)
WAIT=0
until node node_modules/prisma/bin.js db execute --stdin <<'SQL' 2>/dev/null
SELECT 1;
SQL
do
  if [ $WAIT -ge 30 ]; then
    echo "⚠️  Banco não disponível após 30s, iniciando sem migrate..."
    break
  fi
  echo "⏳ Aguardando banco... ($WAIT s)"
  sleep 2
  WAIT=$((WAIT + 2))
done

echo "🔄 Aplicando migrações..."
node node_modules/prisma/bin.js migrate deploy || echo "⚠️  Migrate falhou (podem não existir migrations pendentes)"

echo "🚀 Iniciando Next.js..."
exec node server.js
