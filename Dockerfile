FROM node:alpine

COPY ./package.json /terminal/package.json
COPY ./bower.json /terminal/bower.json
COPY ./.bowerrc /terminal/.bowerrc

WORKDIR /terminal

RUN apk add --no-cache make gcc g++ python
RUN npm install -g bower
RUN npm install

COPY ./app /terminal/app

EXPOSE 8000

CMD ["sh", "-c", "bower install --allow-root && node app/index.js"]
