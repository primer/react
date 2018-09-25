FROM mhart/alpine-node:10
WORKDIR /usr/src
COPY package.json package-lock.json /usr/src/
ENV NODE_ENV=development
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run prebuild
RUN mkdir /public
RUN cp env.log /public/index.txt
