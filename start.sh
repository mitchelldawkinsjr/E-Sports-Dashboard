#!/bin/bash

echo "🚀 Starting Esports Dashboard..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "📝 Creating .env file..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "⚠️  Please create backend/.env manually"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Install backend dependencies if needed
if [ ! -d backend/vendor ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && composer install && cd ..
fi

# Generate app key if needed
cd backend
if ! grep -q "APP_KEY=base64" .env 2>/dev/null; then
    echo "🔑 Generating application key..."
    php artisan key:generate
fi

# Run migrations
echo "🗄️  Running migrations..."
php artisan migrate --force

# Seed database
echo "🌱 Seeding database..."
php artisan db:seed --class=DemoDataSeeder

cd ..

# Install frontend dependencies if needed
if [ ! -d frontend/node_modules ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start backend: cd backend && php artisan serve"
echo "   2. Start worker: cd backend && php artisan horizon"
echo "   3. Start frontend: cd frontend && npm run dev"
echo ""
echo "🔐 Demo login: admin@esports.local / password"

