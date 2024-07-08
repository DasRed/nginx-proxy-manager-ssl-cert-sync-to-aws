FROM node:22-alpine

WORKDIR /var/www

RUN mkdir -p /var/www/src
COPY .env /var/www/.env
COPY ./src /var/www/src

COPY ./package.json /var/www/package.json
COPY ./package-lock.json /var/www/package-lock.json

#HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:7880/api/v2/user || exit 1

ENV NODE_ENV production
ENV NGINX_PROXY_MANAGER_PATH=/nginx-proxy-manager

CMD npm install --omit=dev && npm start
