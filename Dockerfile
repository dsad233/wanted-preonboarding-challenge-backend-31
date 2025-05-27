# Stage 1: Build
FROM node:22.16.0 as builder

RUN apt-get update && npm install -y pm2 -g && rm -rf /var/lib/apt/lists/* 

USER node

WORKDIR /home/app

COPY package.json ./

RUN npm install

COPY --chown=node:node ./ ./

RUN npx nest build

# Stage 2: Runtime
FROM node:22.16.0

WORKDIR /home/app

COPY --from=builder /home/app/node_modules ./node_modules

COPY /libs ./libs

COPY /src ./src

COPY /dist ./dist

COPY .env.production .env.production

EXPOSE 3000:3000

ENTRYPOINT ["node", "dist/main.js"]
