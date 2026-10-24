FROM php:8.2.35-cli

# Install system dependencies, PostgreSQL driver, GD, at ZIP extension requirements
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for storage & cache
RUN chmod -R 777 storage bootstrap/cache

# Start Laravel server using Render's PORT variable
CMD php artisan serve --host=0.0.0.0 --port=$PORT