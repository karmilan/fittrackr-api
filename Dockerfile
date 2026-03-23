FROM node:20

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]

# docker run -p 5000:5000 --name fittrackr-api-cont2 --env-file .env fittrackr-api