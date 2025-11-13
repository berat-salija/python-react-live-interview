FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 5173

# Start dev server with host binding
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 5173"]