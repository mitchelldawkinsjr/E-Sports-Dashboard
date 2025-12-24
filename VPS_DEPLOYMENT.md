# VPS Deployment Guide via Portainer

This guide will walk you through deploying the Esports Dashboard to your VPS using Portainer.

## Prerequisites

- VPS with Docker and Portainer installed
- Domain name pointing to your VPS (optional but recommended)
- SSH access to your VPS
- Basic knowledge of Docker and Portainer

## Step 1: Prepare Your VPS

### 1.1 SSH into your VPS

```bash
ssh user@your-vps-ip
```

### 1.2 Create project directory

```bash
mkdir -p /opt/esports-dashboard
cd /opt/esports-dashboard
```

### 1.3 Upload project files

You can use one of these methods:

**Option A: Using Git (Recommended)**
```bash
git clone <your-repo-url> /opt/esports-dashboard
cd /opt/esports-dashboard
```

**Option B: Using SCP from your local machine**
```bash
# From your local machine
scp -r /path/to/e-sports-dashboard user@your-vps-ip:/opt/
```

**Option C: Using SFTP or File Manager**
Upload the entire project directory to `/opt/esports-dashboard`

## Step 2: Configure Environment Variables

### 2.1 Create production .env file

```bash
cd /opt/esports-dashboard
cp .env.production.example .env
nano .env  # or use your preferred editor
```

### 2.2 Fill in the environment variables

Edit the `.env` file with your production values:

```env
# Database Configuration
DB_DATABASE=esports
DB_USERNAME=esports
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE

# Application URLs (replace with your domain)
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Application Settings
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_APP_KEY_WILL_BE_GENERATED
```

**Important:**
- Replace `yourdomain.com` with your actual domain
- Use a strong password for `DB_PASSWORD`
- The `APP_KEY` will be generated automatically on first run

## Step 3: Deploy via Portainer

### 3.1 Access Portainer

1. Open your browser and navigate to `http://your-vps-ip:9000` (or your Portainer URL)
2. Login to Portainer

### 3.2 Create a New Stack

1. Click on **Stacks** in the left sidebar
2. Click **Add stack**
3. Name the stack: `esports-dashboard`

### 3.3 Upload docker-compose.prod.yml

**Option A: Web Editor**
1. Select **Web editor**
2. Copy the contents of `docker-compose.prod.yml` from your project
3. Paste into the editor

**Option B: Upload File**
1. Select **Upload**
2. Upload the `docker-compose.prod.yml` file

### 3.4 Configure Environment Variables

1. Scroll down to **Environment variables** section
2. Click **Add environment variable** for each variable from your `.env` file:

```
DB_DATABASE=esports
DB_USERNAME=esports
DB_PASSWORD=your_secure_password
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**OR** use the `.env` file:

1. In Portainer, you can also reference the `.env` file path if Portainer has access to it
2. Or manually add each variable in the Portainer UI

### 3.5 Set Build Path

Make sure the build context is set correctly:
- The stack should be able to access `/opt/esports-dashboard/backend` and `/opt/esports-dashboard/frontend`
- If using Portainer's file system, ensure it can access these directories

### 3.6 Deploy the Stack

1. Click **Deploy the stack**
2. Wait for the build process to complete (this may take several minutes)
3. Monitor the logs in Portainer

## Step 4: Post-Deployment Setup

### 4.1 Run deployment script

SSH into your VPS and run:

```bash
cd /opt/esports-dashboard
chmod +x deploy.sh
./deploy.sh
```

This script will:
- Generate Laravel app key
- Run database migrations
- Optionally seed demo data
- Cache configuration
- Restart services

### 4.2 Manual setup (if script doesn't work)

```bash
# Generate app key
docker exec esports_backend_prod php artisan key:generate --force

# Run migrations
docker exec esports_backend_prod php artisan migrate --force

# Seed database (optional)
docker exec esports_backend_prod php artisan db:seed --force

# Optimize
docker exec esports_backend_prod php artisan config:cache
docker exec esports_backend_prod php artisan route:cache
docker exec esports_backend_prod php artisan view:cache

# Restart containers
docker restart esports_backend_prod esports_frontend_prod esports_worker_prod
```

## Step 5: Set Up Reverse Proxy

The containers expose ports only on localhost (127.0.0.1), so you need a reverse proxy.

### Option A: Nginx Proxy Manager (Recommended)

If you're using Nginx Proxy Manager, see `NGINX_PROXY_MANAGER_SETUP.md` for detailed instructions.

**Quick setup:**
1. Login to Nginx Proxy Manager (usually at `http://your-vps-ip:81`)
2. Go to **Hosts → Proxy Hosts → Add Proxy Host**
3. Configure:
   - Domain: `yourdomain.com`
   - Forward to: `127.0.0.1:3002`
   - Enable WebSockets
   - Request SSL certificate
4. Add custom configuration for `/api` location (see `NGINX_PROXY_MANAGER_SETUP.md`)

### Option B: Traditional Nginx

### 5.1 Nginx Configuration

Create `/etc/nginx/sites-available/esports-dashboard`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Laravel Horizon (optional, protect with auth)
    location /horizon {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/esports-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.2 Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Step 6: Verify Deployment

### 6.1 Check container status

```bash
docker ps
```

All containers should be running:
- `esports_postgres_prod`
- `esports_redis_prod`
- `esports_backend_prod`
- `esports_worker_prod`
- `esports_frontend_prod`

### 6.2 Check logs

```bash
# Backend logs
docker logs esports_backend_prod

# Frontend logs
docker logs esports_frontend_prod

# Worker logs
docker logs esports_worker_prod
```

### 6.3 Test the application

1. Visit `https://yourdomain.com` in your browser
2. You should see the login page
3. Login with demo credentials:
   - Email: `admin@esports.local`
   - Password: `password`

## Step 7: Maintenance

### 7.1 Viewing logs in Portainer

1. Go to **Containers** in Portainer
2. Click on a container
3. Click **Logs** tab

### 7.2 Updating the application

```bash
cd /opt/esports-dashboard

# Pull latest changes (if using git)
git pull

# Rebuild and restart in Portainer
# Or use docker-compose:
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations if needed
docker exec esports_backend_prod php artisan migrate --force

# Clear caches
docker exec esports_backend_prod php artisan config:clear
docker exec esports_backend_prod php artisan cache:clear
```

### 7.3 Backing up the database

```bash
# Create backup
docker exec esports_postgres_prod pg_dump -U esports esports > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i esports_postgres_prod psql -U esports esports < backup_file.sql
```

## Troubleshooting

### Containers won't start

1. Check logs in Portainer
2. Verify environment variables are set correctly
3. Check disk space: `df -h`
4. Check Docker resources: `docker system df`

### Database connection errors

1. Verify PostgreSQL container is running
2. Check database credentials in `.env`
3. Test connection: `docker exec esports_backend_prod php artisan tinker`

### Frontend not loading

1. Check frontend container logs
2. Verify `NEXT_PUBLIC_API_URL` is set correctly
3. Check reverse proxy configuration
4. Verify ports are accessible: `netstat -tlnp | grep 3002`

### API errors

1. Check backend logs
2. Verify CORS settings match your domain
3. Check Sanctum configuration
4. Verify API routes: `docker exec esports_backend_prod php artisan route:list`

## Security Checklist

- [ ] Changed default database password
- [ ] Set `APP_DEBUG=false`
- [ ] Using HTTPS with valid SSL certificate
- [ ] Database and Redis not exposed publicly
- [ ] Firewall configured (UFW/iptables)
- [ ] Regular backups scheduled
- [ ] Strong passwords for all services
- [ ] Portainer secured with authentication

## Support

For issues or questions:
1. Check container logs in Portainer
2. Review the troubleshooting section
3. Check the main README.md for more information

---

**Congratulations! Your Esports Dashboard should now be running on your VPS! 🎉**

