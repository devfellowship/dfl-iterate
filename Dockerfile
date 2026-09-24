# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
# Umami website id (optional). Empty = the build adds no Umami tag.
ARG VITE_UMAMI_WEBSITE_ID=
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
