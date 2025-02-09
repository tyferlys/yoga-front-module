FROM node:lts as dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install --legacy-peer-deps

FROM node:lts as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /<имя проекта>/node_modules ./node_modules
RUN npm build

FROM node:lts as runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start"]





