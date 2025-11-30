# Frontend Deployment Checklist - Fly.io

Quick reference for deploying the frontend to Fly.io.

## ✅ Pre-Deployment Checklist

- [x] Backend deployed at `https://hotel-inteligente.fly.dev` ✅
- [x] Fly CLI installed
- [x] Logged into Fly.io
- [x] In the `frontend/` directory

## 🚀 Deployment Steps

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Create Fly.io app (first time only)
fly apps create hotel-inteligente-frontend --region gru

# 3. Deploy!
fly deploy

# 4. Check status
fly status

# 5. Open in browser
fly open
```

## 📋 What Gets Deployed

**Files:**
- ✅ `fly.toml` - Fly.io configuration
- ✅ `Dockerfile` - Multi-stage Docker build
- ✅ `next.config.ts` - Standalone output enabled
- ✅ `.dockerignore` - Build optimization

**Configuration:**
- ✅ Region: São Paulo, Brazil (`gru`)
- ✅ VM: shared-cpu-1x (512MB RAM)
- ✅ Port: 3000
- ✅ Backend API: `https://hotel-inteligente.fly.dev`
- ✅ Auto-scaling: Enabled

## 🌐 URLs

After deployment:
- **Frontend**: `https://hotel-inteligente-frontend.fly.dev`
- **Backend API**: `https://hotel-inteligente.fly.dev`
- **API Docs**: `https://hotel-inteligente.fly.dev/docs`

## ⚡ Quick Commands

```bash
# Deploy
fly deploy

# View logs
fly logs

# Restart
fly apps restart hotel-inteligente-frontend

# Scale
fly scale memory 1024

# SSH
fly ssh console
```

## 🐛 Troubleshooting

### Build fails?
```bash
# Test build locally
npm run build
```

### Can't connect to backend?
```bash
# Test backend
curl https://hotel-inteligente.fly.dev/

# Check frontend logs
fly logs
```

### Health check failing?
```bash
# Increase grace period in fly.toml
grace_period = "40s"
```

## ✨ Post-Deployment

1. **Test the application**: Visit the deployed URL
2. **Upload a file**: Verify backend connection works
3. **Check profiles**: Ensure data is fetched from PostgreSQL
4. **Monitor**: Use `fly dashboard` to watch metrics

## 📝 Notes

- First deployment takes ~2-3 minutes
- Subsequent deployments are faster (~1-2 minutes)
- App suspends after inactivity (free tier)
- First request after sleep takes 2-3 seconds (cold start)

## 🎯 Expected Output

```bash
$ fly deploy

✓ Configuration is valid
==> Building image
--> Building image done
image: registry.fly.io/hotel-inteligente-frontend:deployment-xxx
image size: ~150 MB

==> Pushing image to fly
--> Pushing image done

==> Creating release
--> release v1 created

==> Monitoring deployment
✓ [1/1] Machine xxx [app] update succeeded

Visit your newly deployed app at
https://hotel-inteligente-frontend.fly.dev/
```

## 🎉 Success Criteria

- ✅ Build completes without errors
- ✅ Health checks pass
- ✅ Frontend loads in browser
- ✅ Can upload files
- ✅ Backend API calls work
- ✅ Profiles display from database

---

For detailed instructions, see `FLY_DEPLOYMENT.md`
