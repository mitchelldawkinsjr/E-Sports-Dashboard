# Port Reference

This document lists all ports used by the Esports Dashboard services.

## Production Ports

The application uses non-standard ports to avoid conflicts with other services:

| Service | Container Port | Host Port | Access |
|---------|---------------|-----------|--------|
| **Frontend** | 3000 | 3002 | localhost only |
| **Backend API** | 8000 | 8001 | localhost only |
| **PostgreSQL** | 5432 | - | internal only |
| **Redis** | 6379 | - | internal only |

## Port Configuration

### Frontend
- **Container Port:** 3000 (internal)
- **Host Port:** 3002 (mapped to localhost)
- **Access:** Only accessible from `127.0.0.1:3002`
- **Use:** Access via reverse proxy (Nginx Proxy Manager or Nginx)

### Backend API
- **Container Port:** 8000 (internal)
- **Host Port:** 8001 (mapped to localhost)
- **Access:** Only accessible from `127.0.0.1:8001`
- **Use:** Access via reverse proxy at `/api` path

### PostgreSQL
- **Container Port:** 5432 (internal)
- **Host Port:** Not exposed (internal only)
- **Access:** Only accessible from other containers
- **Use:** Database connections from backend container

### Redis
- **Container Port:** 6379 (internal)
- **Host Port:** Not exposed (internal only)
- **Access:** Only accessible from other containers
- **Use:** Cache, sessions, and queue from backend container

## Reverse Proxy Configuration

When configuring your reverse proxy (Nginx Proxy Manager or Nginx), use:

- **Frontend:** `http://127.0.0.1:3002`
- **Backend API:** `http://127.0.0.1:8001`

## Testing Ports

To verify ports are accessible:

```bash
# Check if ports are listening
netstat -tlnp | grep 3002  # Frontend
netstat -tlnp | grep 8001  # Backend

# Test frontend
curl http://127.0.0.1:3002

# Test backend
curl http://127.0.0.1:8001/api/v1/orgs
```

## Changing Ports

If you need to use different ports, update:

1. **docker-compose.prod.yml:**
   ```yaml
   backend:
     ports:
       - "127.0.0.1:YOUR_BACKEND_PORT:8000"
   
   frontend:
     ports:
       - "127.0.0.1:YOUR_FRONTEND_PORT:3000"
   ```

2. **Reverse proxy configuration:**
   - Update Nginx Proxy Manager forward port
   - Update Nginx config proxy_pass URLs

3. **Documentation:**
   - Update all references in documentation files

## Security Notes

- All ports are bound to `127.0.0.1` (localhost only)
- No ports are exposed to the public internet
- Access is only through reverse proxy
- PostgreSQL and Redis are not exposed externally

---

**Current Configuration:**
- Frontend: `127.0.0.1:3002`
- Backend: `127.0.0.1:8001`

