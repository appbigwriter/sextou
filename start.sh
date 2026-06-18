#!/bin/sh
set -eu

# Script de inicializacao: valida env, aplica migrations e inicia o servidor.

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL nao esta configurada."
  exit 1
fi

echo "Aplicando migrations do banco de dados (migrate deploy)..."
node node_modules/prisma/build/index.js migrate deploy
echo "Migrations OK"

echo "Iniciando Next.js..."
exec node server.js
