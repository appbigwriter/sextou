#!/bin/bash
# Script de build rápido para Easypanel

echo "🚀 Iniciando build do Sexta do Empreendedor..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado! Instale primeiro."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Gerar Prisma Client e aplicar migrações na produção
echo "🔧 Gerando Prisma Client e Migrando Banco..."
npx prisma generate
npx prisma migrate deploy

# Build do Next.js
echo "⚙️ Building Next.js..."
npm run build

echo "✅ Build concluído com sucesso!"
echo ""
echo "Para rodar em produção:"
echo "  npm start"
echo ""
echo "Para rodar com Docker:"
echo "  docker-compose up -d --build"
