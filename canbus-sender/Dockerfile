FROM ubuntu 

WORKDIR /usr/src/app
RUN apt update && apt upgrade -y
RUN apt-get install apt-utils -y
RUN apt-get install build-essential -y
RUN apt-get install can-utils -y
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install nodejs -y
RUN apt-get install kmod -y

COPY package*.json ./
RUN npm install    
COPY ./ ./

CMD [ "npm", "start" ]