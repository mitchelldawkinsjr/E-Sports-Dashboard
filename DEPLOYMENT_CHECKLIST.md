# Deployment Checklist

Use this checklist to ensure a smooth deployment to your VPS.

## Pre-Deployment

- [ ] VPS has Docker and Portainer installed
- [ ] Domain name points to VPS IP (if using domain)
- [ ] SSH access to VPS configured
- [ ] Project files ready to upload

## Step 1: Upload Files to VPS

- [ ] Created directory on VPS: `/opt/esports-dashboard`
- [ ] Uploaded all project files to VPS
- [ ] Verified file structure is correct
- [ ] Files have correct permissions

## Step 2: Environment Configuration

- [ ] Created `.env` file from `.env.production.example`
- [ ] Set `DB_PASSWORD` to strong password
- [ ] Updated `APP_URL` with your domain
- [ ] Updated `FRONTEND_URL` with your domain
- [ ] Updated `NEXT_PUBLIC_API_URL` with your domain/api
- [ ] Updated `SANCTUM_STATEFUL_DOMAINS` with your domain
- [ ] Updated `CORS_ALLOWED_ORIGINS` with your domain
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`

## Step 3: Portainer Setup

- [ ] Logged into Portainer
- [ ] Created new stack named `esports-dashboard`
- [ ] Uploaded `docker-compose.prod.yml`
- [ ] Configured all environment variables in Portainer
- [ ] Set correct build context paths
- [ ] Deployed the stack
- [ ] Verified all containers are building

## Step 4: Post-Deployment

- [ ] All containers are running (check `docker ps`)
- [ ] Ran `deploy.sh` script or manual setup commands
- [ ] Generated Laravel app key
- [ ] Ran database migrations
- [ ] (Optional) Seeded demo data
- [ ] Cleared and cached Laravel config
- [ ] Verified no errors in container logs

## Step 5: Reverse Proxy

- [ ] Installed Nginx (or Caddy)
- [ ] Created Nginx config file
- [ ] Updated config with your domain
- [ ] Enabled the site
- [ ] Tested Nginx configuration
- [ ] Reloaded Nginx

## Step 6: SSL Certificate

- [ ] Installed Certbot
- [ ] Obtained SSL certificate for your domain
- [ ] Configured auto-renewal
- [ ] Verified HTTPS is working

## Step 7: Testing

- [ ] Can access frontend at `https://yourdomain.com`
- [ ] Login page loads correctly
- [ ] Can login with demo credentials
- [ ] API endpoints are accessible
- [ ] No CORS errors in browser console
- [ ] Database operations work
- [ ] File uploads work (if applicable)

## Step 8: Security

- [ ] Changed default database password
- [ ] `APP_DEBUG=false` in production
- [ ] Using HTTPS
- [ ] Database/Redis not exposed publicly
- [ ] Firewall configured (UFW/iptables)
- [ ] Portainer secured
- [ ] Regular backups scheduled

## Step 9: Monitoring

- [ ] Set up log monitoring
- [ ] Configured container health checks
- [ ] Set up disk space monitoring
- [ ] Created backup schedule
- [ ] Documented deployment process

## Troubleshooting Notes

Document any issues encountered and their solutions:

```
Issue: 
Solution: 

Issue: 
Solution: 
```

## Quick Commands Reference

```bash
# Check containers
docker ps

# View logs
docker logs esports_backend_prod
docker logs esports_frontend_prod

# Restart services
docker restart esports_backend_prod esports_frontend_prod esports_worker_prod

# Run migrations
docker exec esports_backend_prod php artisan migrate --force

# Clear cache
docker exec esports_backend_prod php artisan config:clear
docker exec esports_backend_prod php artisan cache:clear

# Backup database
docker exec esports_postgres_prod pg_dump -U esports esports > backup.sql
```

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Domain:** _______________

