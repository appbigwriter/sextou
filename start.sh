#!/bin/sh
# Script de inicialização: aplica migrations e inicia o servidor

echo "🔄 Aplicando migrações do banco de dados..."
node node_modules/prisma/build/index.js migrate deploy && echo "✅ Migrations OK" || echo "⚠️  Sem migrations pendentes ou erro (continuando...)"

echo "🚀 Iniciando Next.js..."
exec node server.js
