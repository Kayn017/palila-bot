FROM node:16-alpine

RUN mkdir -p /usr/bot
WORKDIR /usr/bot

COPY package.json /usr/bot/
COPY yarn.lock /usr/bot/

RUN apk --no-cache add git python3 make gcc g++ libpng-dev autoconf automake libtool libsodium
RUN yarn install --production
RUN yarn add sodium

COPY . /usr/bot/

EXPOSE 80
EXPOSE 443

CMD ["node", "index.js"]