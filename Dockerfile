FROM php:8.5-cli

# Install system dependencies & Node.js
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader -vvv

# Install Node dependencies and build frontend
RUN npm install && npm run build

# Set permissions
RUN chmod -R 777 storage bootstrap/cache

# Expose port 3000 (or the port Coolify uses)
EXPOSE 3000

# Start Laravel built-in server (or use public folder)
CMD php artisan serve --host=0.0.0.0 --port=3000