#!/bin/sh
# Script de inicialização: roda migrations e inicia servidor

echo "🔄 Aplicando migrações do banco de dados..."
npx prisma migrate deploy

echo "🚀 Iniciando servidor Next.js..."
node server.js
