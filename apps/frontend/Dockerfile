# Frontend Dockerfile - Multi-stage build for React app
FROM node:18-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend/ ./apps/frontend/
COPY packages/shared/ ./packages/shared/

# Build shared package first
WORKDIR /usr/src/app/packages/shared
RUN npm run build

# Build frontend
WORKDIR /usr/src/app/apps/frontend
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/nginx.conf

# Copy built React app from build stage
COPY --from=build /usr/src/app/apps/frontend/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
