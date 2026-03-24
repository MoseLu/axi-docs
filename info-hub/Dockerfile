# Info-Hub Dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 5173

# 启动服务
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
