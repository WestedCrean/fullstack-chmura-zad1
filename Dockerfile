FROM node:alpine as base

LABEL author="Wiktor Flis <wiktor.flis@pollub.edu.pl>"

# instalacja pakietow srodowiska nodejs
RUN apk update
RUN apk add --no-cache nodejs npm

# instalacja niezbednych modulow zdefiniowanych w pliku package.json
WORKDIR /app
COPY /app/package.json ./

RUN npm install

# minimalny obraz node - https://github.com/astefanutti/scratch-node
# wbrew nazwie jest oparty o alpine3.14.4 na ktorym skompilowano node
FROM astefanutti/scratch-node

WORKDIR /app

COPY --from=0 /app /app
COPY ./app/main.js ./

EXPOSE 3000
ENTRYPOINT [ "node", "main.js" ]