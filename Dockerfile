FROM php:8.5-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application
COPY . .

# Install Laravel dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist \
    -vvv

# Install frontend dependencies
RUN npm ci

# Build React / Vite
RUN npm run build

# Laravel writable directories
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 3000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=3000"]