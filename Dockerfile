FROM node:16-alpine

RUN mkdir -p /usr/bot
WORKDIR /usr/bot

COPY package.json /usr/bot/
RUN yarn install --production

COPY . /usr/bot/

EXPOSE 80
EXPOSE 443

CMD ["node", "index.js"]