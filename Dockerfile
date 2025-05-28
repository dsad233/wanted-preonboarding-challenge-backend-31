# Stage 1: Build
FROM node:22.16.0 as builder

ENV DOCKERIZE_VERSION v0.9.3
RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /home/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node ./ ./

RUN chmod +x docker-entrypoint.sh

RUN npx nest build

# Stage 2: Runtime
FROM node:22.16.0

WORKDIR /home/app

COPY --from=builder /home/app/node_modules ./node_modules
COPY --from=builder /home/app/libs ./libs
COPY --from=builder /home/app/src ./src
COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/docker-entrypoint.sh ./
COPY --from=builder /usr/local/bin/dockerize /usr/local/bin/dockerize

COPY .env.production .env.production

EXPOSE 3000

ENTRYPOINT ./docker-entrypoint.sh
