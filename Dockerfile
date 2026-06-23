# ===== STAGE 1: Builder =====
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ARG DATABASE_URL
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ARG SUPABASE_ANON_KEY
ARG OPENAI_API_KEY
ARG OPENROUTER_API_KEY
ARG OPENROUTER_MODEL_TEXT
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG NEXTAUTH_SECRET
ARG AUTH_SECRET
ARG NEXTAUTH_URL
ARG AUTH_URL
ARG NEXT_PUBLIC_BASE_URL
ARG DOMAIN
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ARG CLOUDINARY_URL
ARG STRIPE_PUBLIC_KEY
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_SECURE
ARG SMTP_USER
ARG SMTP_PASSWORD
ARG SMTP_FROM
ARG GIT_SHA

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js standalone output.
RUN npm run build

# ===== STAGE 2: Runner =====
FROM node:20-alpine AS runner

# chromium + libs necessárias pro whatsapp-web.js (puppeteer headless) no Alpine
RUN apk add --no-cache libc6-compat openssl \
    chromium nss freetype harfbuzz ca-certificates ttf-freefont
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Usa o Chromium do sistema; não baixar o do puppeteer no build
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma client artifacts generated in the builder stage.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Copy schema and migrations for startup migrate deploy.
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 3000

CMD ["/bin/sh", "start.sh"]
