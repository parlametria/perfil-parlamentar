FROM node:10-alpine

WORKDIR /app

COPY package* ./

RUN npm install

EXPOSE 5000

CMD npm run server