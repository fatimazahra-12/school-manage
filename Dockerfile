# Dev Stage
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install OS dependencies needed by Prisma
RUN apk add --no-cache openssl

# Copy dependency files first for faster caching
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 3500

# Environment variables for Prisma
# (Prisma only needs this for generate/migrate, compose will override this)
ENV DATABASE_URL="postgresql://postgres:123456789@schoolmanage_postgres:5432/school_management"

# Run Prisma generate so dev container always has an up-to-date client
RUN npx prisma generate

# Default dev command (hot reload)
CMD ["npm", "run", "dev"]
