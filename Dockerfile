#
# DockerFile for Development
#
# includes a volumed-dev-runner (that has dev-dependencies like git installed)

FROM node:20-alpine AS devrunner
RUN apk add --no-cache libc6-compat git \
  jq bash zip mc expect curl python3 openssl \
  --virtual build-dependencies \
  build-base \
  linux-headers \
  go

RUN npm install -g yarn-upgrade-all \
 && npm install -g pnpm \
 && npm install -g tsx

RUN touch /root/.bashrc \
 && echo 'PS1="ccc \w # "' \
 >> /root/.bashrc

RUN git clone https://github.com/regen-network/regen-ledger \
    --branch v5.1.2 --single-branch regen-ledger\
 && cd regen-ledger \
 && make build \
 && GOBIN=/usr/local/bin/ make install

WORKDIR /app
VOLUME /app
VOLUME /app/node_modules
VOLUME /usr/local/share/.cache/yarn

ENV NODE_ENV=development

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "dev"]
