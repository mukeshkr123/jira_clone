# Use the official Node.js image as the base
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Set up the production environment
FROM node:18-alpine AS runner

# Set the working directory in the container
WORKDIR /app

# Copy the built app from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

# Expose port 3000 to the host
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
