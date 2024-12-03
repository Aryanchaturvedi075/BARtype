# Build stage
FROM node:23-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:23-slim AS production
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package*.json ./
RUN npm ci npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]

# Development stage
FROM node:23-slim AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]