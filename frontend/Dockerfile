FROM node:24-alpine

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000 

CMD ["npm", "run", "dev"]
