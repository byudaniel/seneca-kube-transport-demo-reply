FROM node:8.9.4

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]