# Portainer Quick Start Guide

Quick reference for deploying via Portainer.

## Quick Steps

### 1. Upload Files to VPS

```bash
# On your VPS
mkdir -p /opt/esports-dashboard
cd /opt/esports-dashboard

# Upload files (via git, scp, or file manager)
```

### 2. Create .env File

```bash
cp .env.production.example .env
nano .env  # Edit with your values
```

**Required values:**
- `DB_PASSWORD` - Strong password
- `APP_URL` - Your domain (https://yourdomain.com)
- `FRONTEND_URL` - Your domain (https://yourdomain.com)
- `NEXT_PUBLIC_API_URL` - Your domain/api (https://yourdomain.com/api)
- `SANCTUM_STATEFUL_DOMAINS` - yourdomain.com,www.yourdomain.com
- `CORS_ALLOWED_ORIGINS` - https://yourdomain.com,https://www.yourdomain.com

### 3. Deploy in Portainer

1. **Open Portainer** → Stacks → Add Stack
2. **Name:** `esports-dashboard`
3. **Build method:** Web editor
4. **Paste** contents of `docker-compose.prod.yml`
5. **Add environment variables:**
   - Copy all variables from your `.env` file
   - Add them in Portainer's environment variables section
6. **Deploy the stack**

### 4. Run Post-Deployment

```bash
cd /opt/esports-dashboard
chmod +x deploy.sh
./deploy.sh
```

### 5. Set Up Reverse Proxy

**Option A: Nginx Proxy Manager (Recommended)**
- See `NGINX_PROXY_MANAGER_SETUP.md` for detailed instructions
- Create proxy host pointing to `127.0.0.1:3002`
- Enable WebSockets support
- Request SSL certificate via Let's Encrypt

**Option B: Traditional Nginx**
```bash
# Copy nginx config
sudo cp nginx.example.conf /etc/nginx/sites-available/esports-dashboard

# Edit with your domain
sudo nano /etc/nginx/sites-available/esports-dashboard

# Enable site
sudo ln -s /etc/nginx/sites-available/esports-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 6. Test

Visit `https://yourdomain.com` and login with:
- Email: `admin@esports.local`
- Password: `password`

## Portainer Environment Variables

Add these in Portainer stack configuration:

```
DB_DATABASE=esports
DB_USERNAME=esports
DB_PASSWORD=your_secure_password
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
APP_ENV=production
APP_DEBUG=false
```

## Troubleshooting

**Containers not starting?**
- Check logs in Portainer
- Verify environment variables
- Check disk space: `df -h`

**Can't access application?**
- Verify Nginx is running: `sudo systemctl status nginx`
- Check container ports: `docker ps`
- Check Nginx config: `sudo nginx -t`

**Database errors?**
- Verify PostgreSQL container is running
- Check database credentials
- Run migrations: `docker exec esports_backend_prod php artisan migrate --force`

## Useful Commands

```bash
# View all containers
docker ps

# View logs
docker logs esports_backend_prod -f

# Restart containers
docker restart esports_backend_prod esports_frontend_prod esports_worker_prod

# Access backend shell
docker exec -it esports_backend_prod sh

# Run artisan commands
docker exec esports_backend_prod php artisan [command]
```

---

For detailed instructions, see `VPS_DEPLOYMENT.md`

