FROM node:18.12.1-bullseye-slim

RUN npm install -g npm@9.1.3

ADD package.json .
ADD app.mjs .
ADD data/car_records.json .
COPY . .
RUN npm install

EXPOSE 3050

CMD [ "node", "app.mjs" ]