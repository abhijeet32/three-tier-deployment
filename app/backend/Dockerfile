FROM node:22-alpine3.21 AS builder

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:22-alpine3.21 AS runner

WORKDIR /usr/app
COPY --from=builder usr/app/package*.json ./
COPY --from=builder usr/app/node_modules ./node_modules
COPY --from=builder usr/app/routes ./routes
COPY --from=builder usr/app/db.js ./
COPY --from=builder usr/app/index.js ./
COPY --from=builder usr/app/models ./models

CMD [ "node", "index.js" ]