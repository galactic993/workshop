# バックエンド（Laravel）Dockerfile

# ベースイメージ
FROM php:8.2-fpm-alpine AS base

# システムパッケージと PHP 拡張機能のインストール
RUN apk add --no-cache \
    postgresql-dev \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    && docker-php-ext-install pdo_pgsql pgsql mbstring zip exif pcntl bcmath gd

# Composer のインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 開発環境
FROM base AS development

# 開発用の PHP 拡張機能（Xdebug など）とPostgreSQLクライアント
RUN apk add --no-cache $PHPIZE_DEPS linux-headers postgresql-client \
    && pecl install redis xdebug \
    && docker-php-ext-enable redis xdebug

# PHP 設定ファイル（開発用）
COPY docker/php/php.ini /usr/local/etc/php/php.ini
COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# パーミッション設定
RUN chown -R www-data:www-data /var/www

USER www-data

EXPOSE 9000

CMD ["php-fpm"]

# 本番環境
FROM base AS production

# Redisのみインストール
RUN apk add --no-cache $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis

# アプリケーションファイルをコピー
COPY --chown=www-data:www-data . /var/www

# 依存関係インストール（本番用）
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 最適化
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# パーミッション設定
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
