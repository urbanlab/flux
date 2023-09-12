FROM ubuntu
RUN  apt update -yq 
RUN apt install git nodejs npm -y
RUN apt install curl -y

RUN curl -LO https://freeshell.de/phd/chromium/jammy/pool/chromium_116.0.5845.96~linuxmint1+victoria/chromium_116.0.5845.96~linuxmint1+victoria_amd64.deb
RUN apt-get install -y ./chromium_116.0.5845.96~linuxmint1+victoria_amd64.deb
RUN rm ./chromium_116.0.5845.96~linuxmint1+victoria_amd64.deb

WORKDIR /app

COPY . .

RUN npm install


RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]