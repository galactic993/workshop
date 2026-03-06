# フロントエンド（Next.js）Dockerfile

# ベースイメージ
FROM node:20-alpine AS base

# 依存関係インストールステージ
FROM base AS deps
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# 開発環境
FROM base AS development
WORKDIR /app

# 依存関係を開発環境にコピー
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

# 開発サーバー起動（docker-compose.ymlでオーバーライド可能）
CMD ["npm", "run", "dev"]

# ビルドステージ
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js アプリケーションをビルド
RUN npm run build

# 本番環境
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# 本番用の依存関係のみインストール
COPY package*.json ./
RUN npm install --only=production

# ビルド成果物をコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
