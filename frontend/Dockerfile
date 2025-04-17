# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist/user-mgmt/browser ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"] 