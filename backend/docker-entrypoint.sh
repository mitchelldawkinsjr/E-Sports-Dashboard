#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database..."
max_attempts=30
attempt=0

until php -r "
try {
    \$pdo = new PDO(
        'pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}',
        '${DB_USERNAME}',
        '${DB_PASSWORD}'
    );
    \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    \$pdo->query('SELECT 1');
    exit(0);
} catch (Exception \$e) {
    exit(1);
}
" 2>/dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "Database connection failed after $max_attempts attempts"
        exit 1
    fi
    echo "Database is unavailable - sleeping (attempt $attempt/$max_attempts)"
    sleep 2
done

echo "Database is ready!"

# Generate app key if not set
if ! grep -q "APP_KEY=base64" .env 2>/dev/null; then
    echo "Generating application key..."
    php artisan key:generate --force || true
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force || true

# Clear and cache config
php artisan config:clear
php artisan cache:clear

# Execute the main command
exec "$@"

