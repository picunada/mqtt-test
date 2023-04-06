FROM node:18-alpine as build
 
RUN npm install -g pnpm
 
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
 
COPY . .
RUN pnpm build
 
FROM nginx:1.18-alpine as deploy-static

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

FROM node:18-alpine as deploy-node

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/build .
RUN yarn --prod
CMD ["node", "index.js"]
