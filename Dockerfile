FROM node:22

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env

ARG VITE_API_BASE_URL
ARG VITE_WEBSOCKET_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]