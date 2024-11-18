# Use the official Node.js image as the base for the build stage
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies (with legacy-peer-deps if necessary)
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Set up the production environment using a smaller Node.js image
FROM node:18-alpine AS runner

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the builder stage to the runner stage
COPY --from=builder /app /app

# Install only the production dependencies
RUN npm install --production --legacy-peer-deps

# Expose port 3000 to the host
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
