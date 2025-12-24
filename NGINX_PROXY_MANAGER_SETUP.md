# Nginx Proxy Manager Setup Guide

This guide shows how to configure the Esports Dashboard behind Nginx Proxy Manager (NPM).

## Prerequisites

- Nginx Proxy Manager installed and running
- Docker containers running on your VPS
- Domain name pointing to your VPS

## Step 1: Verify Containers Are Running

First, make sure your containers are running and accessible on localhost:

```bash
# Check containers
docker ps

# Verify ports are listening
netstat -tlnp | grep 3002  # Frontend
netstat -tlnp | grep 8001  # Backend
```

Your containers should be exposing:
- Frontend: `127.0.0.1:3002`
- Backend: `127.0.0.1:8001`

## Step 2: Create Proxy Host for Frontend

1. **Login to Nginx Proxy Manager**
   - Usually at `http://your-vps-ip:81`
   - Default login: `admin@example.com` / `changeme`

2. **Go to Hosts → Proxy Hosts → Add Proxy Host**

3. **Details Tab:**
   - **Domain Names:** `yourdomain.com` (and `www.yourdomain.com` if needed)
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `127.0.0.1` (or `localhost`)
   - **Forward Port:** `3002`
   - **Cache Assets:** ✅ (optional, recommended)
   - **Block Common Exploits:** ✅ (recommended)
   - **Websockets Support:** ✅ (required for Next.js)

4. **SSL Tab:**
   - **SSL Certificate:** Request a new SSL Certificate with Let's Encrypt
   - **Force SSL:** ✅ (recommended)
   - **HTTP/2 Support:** ✅ (recommended)
   - **HSTS Enabled:** ✅ (recommended)
   - **HSTS Subdomains:** ✅ (if using www subdomain)

5. **Advanced Tab:**
   Paste this custom configuration:

```nginx
# Increase body size for file uploads
client_max_body_size 10M;

# Frontend proxy settings
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
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

# Backend API
location /api {
    proxy_pass http://127.0.0.1:8001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

# Laravel Horizon (optional - protect with access list)
location /horizon {
    proxy_pass http://127.0.0.1:8001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

6. **Save** the proxy host

## Step 3: Update Environment Variables

Make sure your `.env` file and Portainer environment variables are set correctly:

```env
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Important:** After updating environment variables, restart your containers:

```bash
docker restart esports_backend_prod esports_frontend_prod
```

## Step 4: Test the Configuration

1. **Test Frontend:**
   - Visit `https://yourdomain.com`
   - You should see the login page

2. **Test API:**
   - Visit `https://yourdomain.com/api/v1/orgs`
   - Should return JSON (may require authentication)

3. **Test Login:**
   - Login with: `admin@esports.local` / `password`
   - Should redirect to dashboard

## Step 5: Optional - Protect Horizon Dashboard

If you want to protect the Laravel Horizon dashboard:

1. **Create Access List:**
   - Go to **Access Lists** → **Add Access List**
   - Name: `horizon-auth`
   - Add your IP addresses or use basic auth

2. **Update Proxy Host:**
   - Edit your proxy host
   - Go to **Access List** tab
   - Select your access list for `/horizon` location

## Troubleshooting

### Frontend not loading

- **Check container logs:**
  ```bash
  docker logs esports_frontend_prod
  ```

- **Verify port is accessible:**
  ```bash
  curl http://127.0.0.1:3002
  ```

- **Check NPM logs:**
  - Go to NPM → System Logs
  - Look for errors

### API not working / CORS errors

- **Verify backend is running:**
  ```bash
  docker logs esports_backend_prod
  curl http://127.0.0.1:8001/api/v1/orgs
  ```

- **Check environment variables:**
  - Verify `CORS_ALLOWED_ORIGINS` includes your domain
  - Verify `SANCTUM_STATEFUL_DOMAINS` includes your domain

- **Restart backend:**
  ```bash
  docker restart esports_backend_prod
  ```

### SSL Certificate issues

- **Check certificate status in NPM:**
  - Go to SSL Certificates
  - Verify certificate is valid and not expired

- **Request new certificate:**
  - Delete old certificate
  - Request new one with Let's Encrypt

### 502 Bad Gateway

- **Container not running:**
  ```bash
  docker ps | grep esports
  ```

- **Port not accessible:**
  ```bash
  netstat -tlnp | grep 3002
  netstat -tlnp | grep 8001
  ```

- **Check NPM proxy host configuration:**
  - Verify Forward Port matches container port
  - Verify Forward Hostname is `127.0.0.1` or `localhost`

## Configuration Summary

**Nginx Proxy Manager Settings:**

| Setting | Value |
|---------|-------|
| Domain | `yourdomain.com` |
| Scheme | `http` |
| Forward Hostname | `127.0.0.1` |
| Forward Port | `3002` |
| WebSockets | ✅ Enabled |
| SSL | Let's Encrypt |
| Force SSL | ✅ Enabled |
| HTTP/2 | ✅ Enabled |

**Container Ports:**
- Frontend: `127.0.0.1:3002`
- Backend: `127.0.0.1:8001`

**Environment Variables:**
- `APP_URL`: `https://yourdomain.com`
- `FRONTEND_URL`: `https://yourdomain.com`
- `NEXT_PUBLIC_API_URL`: `https://yourdomain.com/api`
- `SANCTUM_STATEFUL_DOMAINS`: `yourdomain.com,www.yourdomain.com`
- `CORS_ALLOWED_ORIGINS`: `https://yourdomain.com,https://www.yourdomain.com`

## Quick Reference

**View logs:**
```bash
docker logs esports_frontend_prod -f
docker logs esports_backend_prod -f
```

**Restart containers:**
```bash
docker restart esports_frontend_prod esports_backend_prod esports_worker_prod
```

**Test API directly:**
```bash
curl http://127.0.0.1:8000/api/v1/orgs
```

**Test Frontend directly:**
```bash
curl http://127.0.0.1:3002
```

---

**That's it! Your Esports Dashboard should now be accessible via Nginx Proxy Manager! 🎉**

