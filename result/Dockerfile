FROM node:12-alpine

WORKDIR /home/node/result

COPY --chown=node:node . /home/node/result

RUN npm install

EXPOSE 80

CMD [ "npm", "start" ]