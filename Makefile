.PHONY: help build up down logs restart clean migrate seed test shell

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

restart: ## Restart all services
	docker-compose restart

clean: ## Stop and remove containers, networks, and volumes
	docker-compose down -v

migrate: ## Run database migrations
	docker-compose exec backend php artisan migrate

migrate-fresh: ## Fresh migration with seeding
	docker-compose exec backend php artisan migrate:fresh --seed

seed: ## Seed the database
	docker-compose exec backend php artisan db:seed

test: ## Run tests
	docker-compose exec backend php artisan test

shell: ## Open shell in backend container
	docker-compose exec backend sh

shell-db: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U esports -d esports

setup: ## Initial setup (build, up, migrate, seed)
	make build
	make up
	@echo "Waiting for services to be ready..."
	@sleep 5
	docker-compose exec backend php artisan key:generate || true
	make migrate
	make seed
	@echo "Setup complete! Services are running."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "Horizon: http://localhost:8000/horizon"

prod-build: ## Build production images
	docker-compose -f docker-compose.prod.yml build

prod-up: ## Start production services
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production services
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## View production logs
	docker-compose -f docker-compose.prod.yml logs -f

