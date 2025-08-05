# Stage de desenvolvimento
FROM node:20 AS dev
WORKDIR /usr/src/app
COPY ../package*.json ./
RUN npm install
COPY ../ ./
CMD ["npm", "run", "start:dev"]

# Stage de produção
FROM node:20 AS prod
WORKDIR /usr/src/app
COPY ../package*.json ./
RUN npm ci --omit=dev
COPY ../ ./
RUN npm run build
CMD ["node", "dist/main.js"]
