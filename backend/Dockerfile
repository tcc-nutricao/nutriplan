FROM node:24-alpine

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g nodemon

COPY start.sh /start.sh
RUN chmod +x /start.sh

ENV PORT=4000
EXPOSE 4000

CMD ["/start.sh"]

