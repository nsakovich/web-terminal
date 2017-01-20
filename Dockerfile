FROM node:alpine

COPY ./package.json /terminal/package.json
WORKDIR /terminal

RUN npm install -g bower
RUN npm install

COPY ./ /terminal

EXPOSE 8000

CMD ["sh", "-c", "bower install --allow-root && node index.js"]
