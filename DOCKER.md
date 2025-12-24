# Docker Setup Guide

This application is fully containerized and ready to run in Docker.

## Quick Start

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Services

### Backend (Laravel API)
- **Container:** `esports_backend`
- **Port:** 8000
- **Health:** http://localhost:8000/up
- **Horizon:** http://localhost:8000/horizon

### Frontend (Next.js)
- **Container:** `esports_frontend`
- **Port:** 4000 (mapped from container port 3000)
- **URL:** http://localhost:4000

### Worker (Laravel Horizon)
- **Container:** `esports_worker`
- Runs background jobs and queue processing

### PostgreSQL
- **Container:** `esports_postgres`
- **Port:** 5433 (mapped from container port 5432)
- **Database:** esports
- **User:** esports
- **Password:** password (change in production!)
- **Note:** Using port 5433 to avoid conflicts with local PostgreSQL

### Redis
- **Container:** `esports_redis`
- **Port:** 6380 (mapped from container port 6379)
- Used for cache, sessions, and queue
- **Note:** Using port 6380 to avoid conflicts with local Redis

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_DATABASE=esports
DB_USERNAME=esports
DB_PASSWORD=password
DB_PORT=5433

# Redis
REDIS_PORT=6380

# Application
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Sanctum (for API auth)
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,frontend:3000
```

## Docker Commands

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
```

### Run Commands in Containers

```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Run seeders
docker-compose exec backend php artisan db:seed

# Access backend shell
docker-compose exec backend sh

# Access database (from host, use port 5433)
docker-compose exec postgres psql -U esports -d esports

# Or connect from host machine
psql -h localhost -p 5433 -U esports -d esports

# View Horizon dashboard
# Open http://localhost:8000/horizon in browser
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Development Workflow

### First Time Setup

1. **Copy environment file:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

3. **Generate app key:**
   ```bash
   docker-compose exec backend php artisan key:generate
   ```

4. **Run migrations:**
   ```bash
   docker-compose exec backend php artisan migrate
   ```

5. **Seed database:**
   ```bash
   docker-compose exec backend php artisan db:seed
   ```

### Daily Development

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run tests
docker-compose exec backend php artisan test

# Clear cache
docker-compose exec backend php artisan cache:clear
```

## Production Deployment

### Prerequisites

1. Set strong passwords in `.env`
2. Set `APP_ENV=production`
3. Set `APP_DEBUG=false`
4. Configure proper `APP_URL` and `FRONTEND_URL`
5. Set up SSL/TLS certificates
6. Configure reverse proxy (Nginx/Caddy)

### Build and Deploy

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force

# Seed initial data (if needed)
docker-compose -f docker-compose.prod.yml exec backend php artisan db:seed --class=DemoDataSeeder
```

### Reverse Proxy Setup (Nginx Example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Port Already in Use

If you get "port is already allocated" errors:

```bash
# Find what's using the port
lsof -i :8000
lsof -i :3000
lsof -i :5432

# Stop the conflicting service or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec backend php artisan db:monitor
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Rebuild container
docker-compose up -d --build backend

# Remove and recreate
docker-compose rm -f backend
docker-compose up -d backend
```

### Permission Issues

```bash
# Fix storage permissions
docker-compose exec backend chmod -R 775 storage bootstrap/cache
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

### Clear Everything and Start Fresh

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## Health Checks

All services include health checks:

- **Backend:** http://localhost:8000/up
- **Frontend:** http://localhost:3000 (returns 200)
- **PostgreSQL:** `pg_isready`
- **Redis:** `redis-cli ping`

## Volumes

Data is persisted in Docker volumes:

- `postgres_data` - Database data
- `redis_data` - Redis data
- `backend_vendor` - Composer dependencies (cached)

To backup:

```bash
# Backup database
docker-compose exec postgres pg_dump -U esports esports > backup.sql

# Restore database
docker-compose exec -T postgres psql -U esports esports < backup.sql
```

## Security Notes

⚠️ **For Production:**

1. Change all default passwords
2. Use strong database passwords
3. Set `APP_DEBUG=false`
4. Configure proper CORS domains
5. Use HTTPS with reverse proxy
6. Regularly update Docker images
7. Use secrets management for sensitive data
8. Enable firewall rules
9. Monitor logs for suspicious activity
10. Keep dependencies updated

