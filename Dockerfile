FROM node:16-alpine3.11
WORKDIR /usr/app
COPY package.json .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN apk --no-cache add \
     	gcc \
	musl-dev \
      	autoconf \
	automake \
	 make \
	   libtool \
	   nasm \
	   tiff \
	       jpeg \
		    zlib \
	        zlib-dev \
		    file \
	        pkgconf

RUN npm install

COPY src src
COPY gulpfile.js .
COPY gulp gulp
RUN npm install -g gulp-cli
RUN npm run build
