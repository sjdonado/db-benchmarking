FROM node:lts-jessie
WORKDIR /usr/src/app
COPY app/package.json .
COPY app/package-lock.json .
RUN npm install