# Esports Dashboard MVP

A production-ready modular monolith for esports competition management, built with Laravel and Next.js.

## Architecture

This application follows a **modular monolith** architecture with clear domain boundaries:

- **IdentityAccess**: Users, organizations, roles, permissions, invites, audit logging
- **Competition**: Game titles, rulesets, seasons, divisions, conferences, teams, rosters, eligibility
- **MatchOps**: Matches, participants, games, result submissions/confirmations, disputes, rulings
- **Communications**: Announcements, notifications, email deliveries
- **Reporting**: Standings snapshots, export jobs

## Tech Stack

- **Backend**: Laravel 12 + PHP 8.3
- **Frontend**: Next.js 14 (App Router) + React + Tailwind
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Job Queue**: Laravel Horizon
- **Auth**: Laravel Sanctum

## Setup

### Prerequisites

- Docker and Docker Compose
- Make (optional, for convenience commands)

### Quick Start with Docker (Recommended)

The easiest way to get started:

```bash
# One command setup
make setup

# Or manually:
docker-compose up -d
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
```

This will:
- Build Docker images
- Start all services (Postgres, Redis, Backend, Worker, Frontend)
- Run migrations
- Seed demo data

Access the application:
- **Frontend:** http://localhost:4000
- **Backend API:** http://localhost:8000
- **Horizon Dashboard:** http://localhost:8000/horizon

### Docker Services

The application runs in Docker with the following services:

- `postgres`: PostgreSQL database (port 5433, mapped from container 5432)
- `redis`: Redis for cache and queue (port 6380, mapped from container 6379)
- `backend`: Laravel API server (port 8000)
- `worker`: Laravel Horizon worker
- `frontend`: Next.js development server (port 3000)

### Local Development (Without Docker)

If you prefer to run locally:

1. Install PHP 8.3+, Composer, Node.js 20+, PostgreSQL, Redis
2. Copy `.env.example` to `.env` in the backend directory
3. Install dependencies and setup:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed

cd ../frontend
npm install
```

4. Start services:

```bash
# Terminal 1 - Backend
cd backend && php artisan serve

# Terminal 2 - Worker
cd backend && php artisan horizon

# Terminal 3 - Frontend
cd frontend && npm run dev
```

See [DOCKER.md](DOCKER.md) for detailed Docker documentation.

## Database Schema

The application uses a single database with multi-tenant architecture. All tenant-scoped tables include an `organization_id` column, and queries are automatically scoped via middleware and traits.

### Key Tables

- `organizations`: Top-level tenant entities
- `organization_members`: User membership in organizations
- `roles` & `role_permissions`: RBAC system
- `seasons`, `divisions`, `conferences`: Competition structure
- `teams`, `roster_entries`, `player_profiles`: Team management
- `matches`, `match_participants`, `match_games`: Match operations
- `result_submissions`, `result_confirmations`: Result workflow
- `disputes`, `rulings`: Dispute resolution
- `standings_snapshots`: Computed standings
- `audit_events`: Audit logging

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

### Authentication
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

### Organizations
- `POST /orgs` - Create organization
- `GET /orgs/{orgId}` - Get organization
- `PUT /orgs/{orgId}` - Update organization
- `POST /orgs/{orgId}/invites` - Send invite
- `POST /orgs/{orgId}/members/{memberId}/roles` - Update member roles

### Competition
- `GET /orgs/{orgId}/seasons` - List seasons
- `POST /orgs/{orgId}/seasons` - Create season
- `POST /orgs/{orgId}/divisions` - Create division
- `POST /orgs/{orgId}/teams` - Create team
- `POST /orgs/{orgId}/teams/{teamId}/roster` - Add to roster

### Matches
- `GET /orgs/{orgId}/matches` - List matches
- `POST /orgs/{orgId}/matches` - Create match
- `GET /orgs/{orgId}/matches/{matchId}` - Get match
- `POST /orgs/{orgId}/matches/{matchId}/submit-result` - Submit result
- `POST /orgs/{orgId}/matches/{matchId}/confirm-result` - Confirm result
- `POST /orgs/{orgId}/matches/{matchId}/disputes` - Create dispute

### Standings
- `GET /orgs/{orgId}/seasons/{seasonId}/standings` - Get standings
- `POST /orgs/{orgId}/seasons/{seasonId}/recompute-standings` - Recompute standings

### Communications
- `POST /orgs/{orgId}/announcements` - Create announcement
- `GET /orgs/{orgId}/announcements` - List announcements
- `GET /me/notifications` - Get user notifications

## Match State Machine

Matches follow this state flow:

1. `draft` → `scheduled` → `awaiting_results` → `results_submitted` → `results_confirmed`
2. Any state can transition to `disputed` → `resolved`
3. Any state can transition to `canceled`

## Multi-Tenancy

The application enforces multi-tenancy through:

1. **Middleware**: `SetOrganizationContext` sets organization context from route parameters
2. **Traits**: `HasOrganizationScope` automatically scopes queries
3. **Policies**: Laravel Policies enforce organization-level permissions

## RBAC

Role-based access control is capability-based:

- Roles are scoped to organizations
- Permissions are stored as strings (e.g., `teams.create`, `matches.submit_result`)
- Policies check permissions, not role names

## Events & Jobs

### Internal Events
- `OrgMemberInvited`
- `MatchScheduled`
- `ResultSubmitted`
- `ResultConfirmed`
- `DisputeOpened`
- `DisputeResolved`
- `StandingsRecomputed`

### Background Jobs
- `SendEmail`
- `RecomputeStandingsForSeason`
- `GenerateExport`
- `CleanupExpiredInvites`
- `DailyDigestNotifications`

## Deployment

### Docker Production Deployment

1. Set production environment variables in `.env`
2. Build and start production services:

```bash
make prod-build
make prod-up
```

Or manually:

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force
```

3. Set up reverse proxy (Nginx/Caddy) to route traffic to containers

See [DOCKER.md](DOCKER.md) for detailed deployment instructions.

## Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests (when added)
cd frontend
npm test
```

## Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Comprehensive user guide with step-by-step instructions for all features
- **[SCREENSHOTS_GUIDE.md](SCREENSHOTS_GUIDE.md)** - Guide for capturing screenshots for the user documentation
- **[QUICKSTART.md](QUICKSTART.md)** - Quick setup instructions
- **[DOCKER.md](DOCKER.md)** - Detailed Docker documentation

## License

MIT

