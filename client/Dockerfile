FROM node:10-alpine

WORKDIR /app/client

COPY package* ./

RUN npm install

EXPOSE 4200

CMD npm run start