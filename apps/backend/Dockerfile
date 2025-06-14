# Backend Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY apps/backend/ ./apps/backend/
COPY packages/shared/ ./packages/shared/

# Build shared package
WORKDIR /usr/src/app/packages/shared
RUN npm run build

# Build backend
WORKDIR /usr/src/app/apps/backend
RUN npm run build

# Clean up dev dependencies for production
WORKDIR /usr/src/app
RUN npm ci --only=production

# Set working directory to backend for startup
WORKDIR /usr/src/app/apps/backend

# Expose port
EXPOSE 5001

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
