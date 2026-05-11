FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE 9517
CMD ["node", "src/server.js"]
