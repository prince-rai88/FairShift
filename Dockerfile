# ----------------------------------------------------
# Stage 1: Build the React Client Application
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies including devDependencies for Vite build
RUN npm ci

# Copy full source tree
COPY . .

# Run test suite to verify labor calculations before building
RUN npm test

# Build production client bundle
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Container for Google Cloud Run
# ----------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy package descriptors and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server code, core logic, and compiled React dist bundle
COPY server.js ./
COPY src/utils ./src/utils
COPY --from=builder /app/dist ./dist

# Cloud Run health check and port exposure
EXPOSE 8080

# Start server bound to 0.0.0.0:$PORT
CMD ["node", "server.js"]
