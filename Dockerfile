# Stage 1: Build the application
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy prisma directory
COPY prisma ./prisma/

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Stage 2: Run the application
FROM node:22-alpine AS production

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy prisma directory
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy generated Prisma client from the builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist

# Start the application
CMD ["npm", "run", "start:prod"]
