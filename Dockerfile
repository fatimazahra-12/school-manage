# Build Stage (Node.js + TypeScript)
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Provide DATABASE_URL for build
ENV DATABASE_URL="postgresql://postgres:123456789@postgres:5432/school_management"

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Run Stage (Smaller image)
FROM node:24-alpine

WORKDIR /app

# Copy only needed files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose app port
EXPOSE 3500

# Default command
CMD ["node", "dist/index.js"]