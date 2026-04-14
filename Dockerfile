# ===== STAGE 1: Builder =====
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client with the correct binary for Alpine + OpenSSL 3.
RUN npx prisma generate

# Build the Next.js standalone output.
RUN npm run build

# ===== STAGE 2: Runner =====
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

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
