FROM php:8.4-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev \
    bash

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd zip opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies without scripts (artisan not available yet)
# Try production install first, fall back to dev if lock file is incompatible
RUN if [ -f composer.lock ]; then \
    composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts || \
    composer install --optimize-autoloader --no-interaction --prefer-dist --no-scripts || \
    composer update --no-interaction --no-scripts && composer install --optimize-autoloader --no-interaction --prefer-dist --no-scripts; \
    else \
    composer install --optimize-autoloader --no-interaction --prefer-dist --no-scripts; \
    fi

# Copy application files
COPY . .

# Run composer scripts now that artisan is available
RUN composer dump-autoload --optimize --no-interaction

# Create storage directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

