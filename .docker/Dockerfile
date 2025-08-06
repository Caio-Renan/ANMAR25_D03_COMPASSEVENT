# Development stage
FROM node:20.19.2-alpine3.22 AS dev
WORKDIR /usr/src/app
COPY ../package*.json ./
RUN npm install
COPY ../ ./
CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:20.19.2-alpine3.22 AS prod
WORKDIR /usr/src/app
COPY ../package*.json ./
RUN npm ci --omit=dev
COPY ../ ./
RUN npm run build
CMD ["node", "dist/main.js"]
