# GitHub Actions Deployment Setup Guide

This guide explains how to set up GitHub Actions to automatically deploy your e-sports dashboard to your VPS.

## Prerequisites

- GitHub repository with your code
- VPS with SSH access
- Docker and Docker Compose installed on VPS
- Git installed on VPS

## Step 1: Generate SSH Key for Deployment

On your local machine, generate a new SSH key pair for GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

This creates two files:
- `~/.ssh/github_actions_deploy` (private key - add to GitHub Secrets)
- `~/.ssh/github_actions_deploy.pub` (public key - add to VPS)

## Step 2: Add SSH Key to VPS

Copy the public key to your VPS:

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub your_user@your_vps_ip
```

Or manually add it to `~/.ssh/authorized_keys` on your VPS:

```bash
cat ~/.ssh/github_actions_deploy.pub | ssh your_user@your_vps_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Test the connection:

```bash
ssh -i ~/.ssh/github_actions_deploy your_user@your_vps_ip
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### SSH Connection Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address or domain | `123.45.67.89` or `vps.example.com` |
| `VPS_USER` | SSH username on VPS | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Contents of the private key file | Copy entire contents of `~/.ssh/github_actions_deploy` |

### Database Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DB_DATABASE` | Database name (optional, defaults to `esports`) | `esports` |
| `DB_USERNAME` | Database username (optional, defaults to `esports`) | `esports` |
| `DB_PASSWORD` | Database password (required) | `MyS3cur3P@ssw0rd!2024` |

### Application URL Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `APP_URL` | Your application URL with https:// | `https://esports.example.com` |
| `FRONTEND_URL` | Your frontend URL with https:// | `https://esports.example.com` |
| `NEXT_PUBLIC_API_URL` | Your API URL with https:// | `https://esports.example.com/api` |

### Sanctum & CORS Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SANCTUM_STATEFUL_DOMAINS` | Domain(s) without https://, comma-separated | `esports.example.com,www.esports.example.com` |
| `CORS_ALLOWED_ORIGINS` | Domain(s) with https://, comma-separated | `https://esports.example.com,https://www.esports.example.com` |

## Step 4: Prepare VPS Directory

The workflow will automatically create `/opt/esports-dashboard` on first run, but you can prepare it manually:

```bash
sudo mkdir -p /opt/esports-dashboard
sudo chown -R $USER:$USER /opt/esports-dashboard
```

Ensure your VPS user has:
- Docker permissions (usually requires adding user to `docker` group: `sudo usermod -aG docker $USER`)
- Write permissions to `/opt/esports-dashboard`

## Step 5: Test the Deployment

1. Push a commit to the `main` branch, or
2. Go to Actions tab → Deploy to VPS → Run workflow → Run workflow

The workflow will:
1. SSH into your VPS
2. Clone/pull the repository to `/opt/esports-dashboard`
3. Create `.env` file from GitHub secrets
4. Run `docker compose -f docker-compose.prod.yml up -d --build`
5. Verify all containers are running

## Workflow Details

### Triggers

- **Automatic**: Pushes to `main` branch
- **Manual**: Workflow dispatch from Actions tab

### What It Does

1. **Configure SSH**: Sets up SSH connection using the private key
2. **Setup Repository**: Clones or pulls latest code to `/opt/esports-dashboard`
3. **Create .env**: Generates `.env` file from GitHub secrets
4. **Deploy**: Builds and starts containers using Docker Compose
5. **Health Check**: Verifies all containers are running

### Deployment Directory

All files are deployed to `/opt/esports-dashboard` on your VPS.

## Troubleshooting

### SSH Connection Fails

- Verify `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY` are correct
- Test SSH connection manually: `ssh -i ~/.ssh/github_actions_deploy your_user@your_vps_ip`
- Check VPS firewall allows SSH (port 22)

### Containers Fail to Start

- Check workflow logs in GitHub Actions
- SSH into VPS and check: `docker compose -f docker-compose.prod.yml logs`
- Verify all required secrets are set in GitHub
- Check disk space: `df -h`

### Permission Denied

- Ensure VPS user is in `docker` group: `sudo usermod -aG docker $USER`
- Log out and back in for group changes to take effect
- Check directory permissions: `ls -la /opt/esports-dashboard`

### Environment Variables Not Working

- Verify all secrets are set in GitHub (no typos in secret names)
- Check `.env` file on VPS: `cat /opt/esports-dashboard/.env`
- Ensure secrets match the format expected (e.g., URLs with `https://`)

## Security Best Practices

1. **Never commit secrets**: All sensitive data is in GitHub Secrets
2. **Use strong passwords**: Especially for `DB_PASSWORD`
3. **Rotate SSH keys**: Periodically regenerate deployment keys
4. **Limit SSH access**: Use firewall rules to restrict SSH to trusted IPs
5. **Monitor deployments**: Review GitHub Actions logs regularly

## Manual Deployment

If you need to deploy manually on the VPS:

```bash
cd /opt/esports-dashboard
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## Next Steps

After successful deployment:

1. Set up reverse proxy (Nginx/Caddy) to expose your application
2. Configure SSL certificates (Let's Encrypt)
3. Set up monitoring and logging
4. Configure backups for database

---

**Need help?** Check the workflow logs in GitHub Actions → Deploy to VPS → Latest run

