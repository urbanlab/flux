FROM node:lts as deps
WORKDIR /app
COPY package.json .
RUN npm install


FROM debian
RUN  apt update -yq 
RUN apt install git nodejs npm -y
RUN apt install curl -y

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules


ENTRYPOINT ["node", "index.js"] 