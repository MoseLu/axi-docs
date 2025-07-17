# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 设置npm镜像源解决网络问题
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
# 设置pnpm镜像源
RUN pnpm config set registry https://registry.npmmirror.com
# 安装依赖
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm docs:build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 