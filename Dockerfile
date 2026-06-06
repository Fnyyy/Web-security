# Use the official Node.js alpine image for a lightweight build
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files first to cache dependency installation
COPY package*.json ./

# Install all dependencies (needed for building Vite)
RUN npm install

# Copy the rest of the source files
COPY . .

# Build the production application
RUN npm run build

# Expose port 8080 (Cloud Run's default)
EXPOSE 8080

# Start the Express server
CMD ["node", "server.js"]
