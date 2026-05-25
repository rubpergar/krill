FROM php:8.3-cli AS php-deps
RUN apt-get update && apt-get install -y \
    libicu-dev libpq-dev libzip-dev zip unzip git \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install intl pdo_pgsql zip bcmath
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /build
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

FROM node:22 AS frontend
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
COPY --from=php-deps /build/vendor ./vendor
RUN npm run build

FROM php:8.3-cli
RUN apt-get update && apt-get install -y \
    libicu-dev libpq-dev libzip-dev zip unzip git \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install intl pdo_pgsql zip bcmath
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .
COPY --from=frontend /build/public/build ./public/build
RUN composer install --no-dev --optimize-autoloader \
    && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs
EXPOSE 8000
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
