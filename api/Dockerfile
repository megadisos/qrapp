FROM node

ENV NODE_ENV=development
WORKDIR /api

RUN npm install -g npm
RUN npm install express pg

COPY api.js /api
COPY config.js /api

CMD ["node","api.js"]