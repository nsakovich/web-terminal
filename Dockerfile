FROM node:alpine

COPY ./package.json /terminal/package.json
COPY ./bower.json /terminal/bower.json
COPY ./.bowerrc /terminal/.bowerrc

WORKDIR /terminal

RUN apt-get install -y python python-dev python-pip python-virtualenv
RUN npm install -g bower
RUN npm install

COPY ./app /terminal/app

EXPOSE 8000

CMD ["sh", "-c", "bower install --allow-root && node app/index.js"]
