# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first (for caching layers)
COPY package*.json ./
RUN npm ci

# Copy source files and configuration files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY eslint.config.mjs ./
COPY src/ ./src/

# Build application
RUN npm run build

# Prune development dependencies
RUN npm prune --production

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built code and dependencies from builder stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY data-source.js ./
COPY docker-entrypoint.sh ./

# Adjust ownership and permissions for the entrypoint and application directory
RUN chmod +x docker-entrypoint.sh && chown -R node:node /usr/src/app

# Run the app under the non-root 'node' user for security
USER node

# Expose NestJS default port (or configured port)
EXPOSE 3001

# Set the entrypoint to run migrations and start the application
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
