#!/bin/sh
# Script de inicialização: aplica migrations e inicia o servidor

echo "🔄 Sincronizando banco de dados (db push)..."
node node_modules/prisma/build/index.js db push --accept-data-loss && echo "✅ DB Sync OK" || echo "⚠️ Erro no db push (continuando...)"

echo "🚀 Iniciando Next.js..."
exec node server.js
