FROM ubuntu:22.10
RUN  apt update -yq \
     && apt install -yq software-properties-common \
     && add-apt-repository ppa:mozillateam/ppa \
     && apt-get update \
     && apt-get install -y firefox-esr \
     && rm -rf /var/lib/apt/lists/*

RUN apt update && apt install git nodejs npm -y

WORKDIR /app

COPY . .

RUN npm install

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]