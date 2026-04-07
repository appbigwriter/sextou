# ===== STAGE 1: Builder =====
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

# Receber variáveis de ambiente do Easypanel (build-args)
ARG DATABASE_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG AUTH_URL
ARG AUTH_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV AUTH_URL=$AUTH_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Gerar Prisma Client com binário correto para Alpine + OpenSSL 3
RUN npx prisma generate

# Build do Next.js
RUN npm run build

# ===== STAGE 2: Runner =====
FROM node:20-alpine AS runner

# Instalar dependências de sistema necessárias
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Receber variáveis de ambiente do Easypanel para runtime
ARG DATABASE_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG AUTH_URL
ARG AUTH_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV AUTH_URL=$AUTH_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copiar arquivos do build standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# CRÍTICO: Copiar Prisma client gerado (inclui binário linux-musl-openssl-3.0.x)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Copiar schema e migrations para rodar migrate deploy no startup
COPY --from=builder /app/prisma ./prisma

# Copiar script de inicialização
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 3000

# Roda migrations e inicia o servidor
CMD ["/bin/sh", "start.sh"]
