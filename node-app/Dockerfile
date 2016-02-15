FROM node:5.6.0

RUN mkdir -p /usr/src/node-app

WORKDIR /usr/src/node-app

ADD . /usr/src/node-app

RUN pwd

RUN ls -l

RUN rm -r node_modules

RUN npm install httpdispatcher mysql

CMD node main.js

