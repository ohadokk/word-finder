# Use an official Node.js runtime as base
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build the TypeScript app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]