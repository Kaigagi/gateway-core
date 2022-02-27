FROM node:16.14.0-alpine3.15
WORKDIR  /gateway-backend
COPY ./package.json /gateway-backend/
RUN npm install 
COPY . /gateway-backend/
CMD ["node", "app.js"]