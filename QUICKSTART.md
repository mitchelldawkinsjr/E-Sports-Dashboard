# Quick Start Guide

## Prerequisites

- Docker and Docker Compose
- PHP 8.3+ and Composer (for local development)
- Node.js 20+ and npm (for local development)

## Initial Setup

1. **Run the setup script:**
   ```bash
   ./start.sh
   ```

   This will:
   - Start Docker services (Postgres, Redis)
   - Install dependencies
   - Run migrations
   - Seed demo data

2. **Start the development servers:**

   **Terminal 1 - Backend API:**
   ```bash
   cd backend
   php artisan serve
   ```
   API will be available at: http://localhost:8000

   **Terminal 2 - Queue Worker:**
   ```bash
   cd backend
   php artisan horizon
   ```
   Horizon dashboard: http://localhost:8000/horizon

   **Terminal 3 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at: http://localhost:4000

## Demo Credentials

- **Email:** admin@esports.local
- **Password:** password

## API Testing

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@esports.local","password":"password"}'
```

### Create Organization
```bash
curl -X POST http://localhost:8000/api/v1/orgs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"My Org","slug":"my-org"}'
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild containers
docker-compose build
```

## Database

- **Host:** localhost (or `postgres` in Docker)
- **Port:** 5433 (mapped from container port 5432)
- **Database:** esports
- **Username:** esports
- **Password:** password
- **Note:** Port 5433 is used to avoid conflicts with local PostgreSQL

## Troubleshooting

### Port 5432 already in use
If you have Postgres running locally, either:
- Stop local Postgres, or
- Change `DB_PORT` in docker-compose.yml to a different port

### Migrations fail
Make sure the database is running:
```bash
docker-compose up -d postgres
```

### Frontend can't connect to API
Check that `NEXT_PUBLIC_API_URL` in frontend/.env.local matches your backend URL.

## Next Steps

1. Explore the API endpoints in `backend/routes/api.php`
2. Check out the domain models in `backend/app/Domains/`
3. Review the database schema in `backend/database/migrations/`
4. Start building frontend components in `frontend/app/`

