# Frontend Deployment Guide - Fly.io

This guide will help you deploy the Hotel Intelligence Frontend (Next.js) to Fly.io.

## Prerequisites

1. **Fly CLI installed**
   ```bash
   brew install flyctl
   ```

2. **Logged into Fly.io**
   ```bash
   fly auth login
   ```

3. **Backend already deployed**
   - Backend URL: `https://hotel-inteligente.fly.dev`

## Quick Deployment

### From the frontend directory:

```bash
cd frontend

# Create the app (first time only)
fly apps create hotel-inteligente-frontend --region gru

# Deploy
fly deploy
```

That's it! Your frontend will be available at:
```
https://hotel-inteligente-frontend.fly.dev
```

## Configuration Details

### fly.toml Configuration

The `fly.toml` file is pre-configured with:

- **App name**: `hotel-inteligente-frontend`
- **Region**: `gru` (São Paulo, Brazil)
- **VM**: shared-cpu-1x with 512MB RAM
- **Auto-scaling**: Suspends when idle, auto-starts on request
- **Backend API**: Points to `https://hotel-inteligente.fly.dev`

### Environment Variables

The backend API URL is configured in `fly.toml`:

```toml
[env]
  NEXT_PUBLIC_API_URL = "https://hotel-inteligente.fly.dev"
```

To change it:

```bash
# Option 1: Edit fly.toml
# Change the NEXT_PUBLIC_API_URL value

# Option 2: Set as secret (overrides fly.toml)
fly secrets set NEXT_PUBLIC_API_URL="https://your-backend-url.fly.dev"
```

## Dockerfile

The frontend uses a **multi-stage Docker build** for optimal size and performance:

1. **Stage 1 (deps)**: Installs production dependencies
2. **Stage 2 (builder)**: Builds the Next.js application
3. **Stage 3 (runner)**: Runs the optimized production server

**Features:**
- Alpine Linux base (minimal size)
- Standalone output mode (self-contained)
- Non-root user for security
- Health checks enabled

## Deployment Commands

### Deploy the Application

```bash
cd frontend
fly deploy
```

### Monitor Deployment

```bash
# Check app status
fly status

# View logs
fly logs

# Open in browser
fly open
```

### Scale the Application

```bash
# Change VM size
fly scale vm shared-cpu-2x

# Change memory
fly scale memory 1024

# Add more instances
fly scale count 2
```

## Useful Commands

### View Application Info

```bash
# Get app details
fly info

# Check secrets
fly secrets list

# View dashboard
fly dashboard
```

### Restart Application

```bash
fly apps restart hotel-inteligente-frontend
```

### SSH into Container

```bash
fly ssh console
```

### View Real-time Logs

```bash
fly logs -a hotel-inteligente-frontend
```

## Environment Variables

The frontend uses these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3000` | Internal port |
| `NODE_ENV` | `production` | Node environment |
| `NEXT_PUBLIC_API_URL` | `https://hotel-inteligente.fly.dev` | Backend API URL |

## Troubleshooting

### Build Fails

```bash
# Check build logs
fly logs

# Try local build first
npm run build

# Check Dockerfile syntax
docker build -t test-build .
```

### Application Won't Start

```bash
# View startup logs
fly logs

# Check health checks
fly checks list

# SSH into container
fly ssh console
node -v
npm -v
```

### Can't Connect to Backend

1. Verify backend is running:
   ```bash
   curl https://hotel-inteligente.fly.dev/
   ```

2. Check NEXT_PUBLIC_API_URL:
   ```bash
   fly ssh console
   echo $NEXT_PUBLIC_API_URL
   ```

3. Check browser console for CORS errors

## Custom Domain (Optional)

To use a custom domain:

```bash
# Add domain
fly certs add yourdomain.com

# Add www subdomain
fly certs add www.yourdomain.com

# Check certificate status
fly certs list
```

Then update your DNS:
- Add CNAME record: `yourdomain.com` → `hotel-inteligente-frontend.fly.dev`

## Cost Optimization

**Free Tier Includes:**
- 3 shared-cpu VMs
- 3GB outbound data transfer

**This deployment uses:**
- 1 VM (512MB RAM) - ~$5-10/month if exceeding free tier
- Auto-scaling keeps costs low (suspends when idle)

**To minimize costs:**
- Keep auto-scaling enabled
- Use shared-cpu VMs
- Monitor with `fly dashboard`

## Local Development

For local development with deployed backend:

```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=https://hotel-inteligente.fly.dev" > .env.local

# Run dev server
npm run dev
```

## CI/CD Setup (Optional)

To automate deployments:

1. Get a Fly.io deploy token:
   ```bash
   fly tokens create deploy
   ```

2. Add to GitHub Secrets: `FLY_API_TOKEN`

3. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to Fly.io
   on:
     push:
       branches: [main]
       paths:
         - 'frontend/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: superfly/flyctl-actions/setup-flyctl@master
         - run: flyctl deploy --remote-only
           working-directory: ./frontend
           env:
             FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
   ```

## Architecture

```
User Browser
    ↓
https://hotel-inteligente-frontend.fly.dev (Next.js)
    ↓
https://hotel-inteligente.fly.dev (FastAPI Backend)
    ↓
PostgreSQL Database (Fly.io)
```

## Next Steps

1. Deploy the frontend: `fly deploy`
2. Test the application: Visit `https://hotel-inteligente-frontend.fly.dev`
3. Set up custom domain (optional)
4. Configure CI/CD (optional)
5. Monitor with Fly.io dashboard

## Support

- Fly.io Docs: https://fly.io/docs/
- Fly.io Community: https://community.fly.io/
- Next.js Docs: https://nextjs.org/docs
