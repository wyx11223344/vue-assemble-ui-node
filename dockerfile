FROM node:alpine

MAINTAINER wanyixin <962717593@qq.com>

COPY . /home/app

RUN cd /home/app\
 && apk add git\
 && npm install forever -g --registry=https://registry.npm.taobao.org\
 && npm install --registry=https://registry.npm.taobao.org\
 && npm install -g typescript --registry=https://registry.npm.taobao.org\
 && tsc

WORKDIR /home/app

CMD ["forever", "./dist/bin/www.js"]
