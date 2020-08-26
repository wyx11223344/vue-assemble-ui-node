FROM alpine/git

FROM node:alpine

COPY . /home/app

RUN cd /home/app\
 && npm install forever -g --registry=https://registry.npm.taobao.org\
 && npm install --registry=https://registry.npm.taobao.org\
 && npm install -g typescript --registry=https://registry.npm.taobao.org\
 && tsc

WORKDIR /home/app

CMD ["forever", "./dist/bin/www.js"]
