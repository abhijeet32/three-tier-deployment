FROM node:22-alpine3.21 AS builder

WORKDIR /usr/app
COPY package*.json ./
RUN npm install -g npm@11.8.0
COPY . .
RUN npm install --production

FROM node:22-alpine3.21 AS runner

WORKDIR /usr/app
COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/public ./public
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/src ./src

EXPOSE 3000
CMD [ "npm", "start"]
