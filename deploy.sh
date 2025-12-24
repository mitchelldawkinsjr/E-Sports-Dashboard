#!/bin/bash

# Esports Dashboard Deployment Script
# Run this script on your VPS after deploying via Portainer

set -e

echo "🚀 Esports Dashboard Deployment Script"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in production
if [ "$APP_ENV" != "production" ]; then
    echo -e "${YELLOW}Warning: APP_ENV is not set to 'production'${NC}"
fi

# Container names
BACKEND_CONTAINER="esports_backend_prod"
FRONTEND_CONTAINER="esports_frontend_prod"
WORKER_CONTAINER="esports_worker_prod"

echo ""
echo "📦 Checking containers..."

# Check if containers are running
if ! docker ps | grep -q "$BACKEND_CONTAINER"; then
    echo -e "${RED}Error: $BACKEND_CONTAINER is not running${NC}"
    exit 1
fi

if ! docker ps | grep -q "$FRONTEND_CONTAINER"; then
    echo -e "${RED}Error: $FRONTEND_CONTAINER is not running${NC}"
    exit 1
fi

if ! docker ps | grep -q "$WORKER_CONTAINER"; then
    echo -e "${RED}Error: $WORKER_CONTAINER is not running${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All containers are running${NC}"

echo ""
echo "🔑 Generating application key..."
docker exec $BACKEND_CONTAINER php artisan key:generate --force || echo -e "${YELLOW}Key already exists or failed to generate${NC}"

echo ""
echo "🗄️  Running database migrations..."
docker exec $BACKEND_CONTAINER php artisan migrate --force

echo ""
echo "🌱 Seeding database (optional)..."
read -p "Do you want to seed the database with demo data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker exec $BACKEND_CONTAINER php artisan db:seed --force
    echo -e "${GREEN}✓ Database seeded${NC}"
else
    echo "Skipping database seeding"
fi

echo ""
echo "⚡ Optimizing application..."
docker exec $BACKEND_CONTAINER php artisan config:cache
docker exec $BACKEND_CONTAINER php artisan route:cache
docker exec $BACKEND_CONTAINER php artisan view:cache

echo ""
echo "🔄 Restarting services..."
docker restart $BACKEND_CONTAINER $FRONTEND_CONTAINER $WORKER_CONTAINER || true

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify containers are running: docker ps"
echo "2. Check logs: docker logs $BACKEND_CONTAINER"
echo "3. Test the application at your configured domain"
echo "4. Set up reverse proxy (Nginx/Caddy) if not already done"

