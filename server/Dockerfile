# Production Dockerfile for Node.js backend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./

RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory if needed
RUN mkdir -p uploads

# Expose the port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/ || exit 1

# Start the application
CMD ["npm", "start"]

