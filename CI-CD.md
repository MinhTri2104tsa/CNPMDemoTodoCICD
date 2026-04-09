# CI/CD Deployment Guide

## Automatic Docker Deployment on Push to Main

When you push code to the `main` branch, GitHub Actions automatically:
1. ✅ Runs tests on Node 18.x and 20.x
2. 🔒 Performs security audit
3. 🔨 Builds the project  
4. 📦 Builds Docker image and pushes to GitHub Container Registry (GHCR)
5. 📊 Generates pipeline summary

## GitHub Secrets Setup

To enable automatic Docker deployment, configure these secrets in your GitHub repository:

### Option 1: GitHub Container Registry (GHCR) - Recommended
✅ Uses GitHub token automatically (no setup needed)
- Docker image: `ghcr.io/your-username/todo-demo:latest`
- Token: `${{ secrets.GITHUB_TOKEN }}` (Built-in)

### Option 2: Docker Hub (Optional)
Add these secrets to GitHub repository settings:

1. Go to **Settings → Secrets and variables → Actions**
2. Create new secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token (not password)

**To create Docker Hub token:**
- Login to https://hub.docker.com
- Go to Account Settings → Security
- Create new access token
- Copy token and save as `DOCKER_PASSWORD` secret

## Workflow File

**Location:** `.github/workflows/ci-cd.yml`

**Triggers:**
- Push to `main` branch → Full pipeline + Docker push
- Push to `develop` branch → Test & Build only (no deploy)
- Pull Request to `main` → Test & Build only (no deploy)

## Pipeline Jobs

### 1. Test (Parallel)
- Runs on Node 18.x and 20.x  
- Lints code with ESLint
- Runs unit tests
- Uploads test results

### 2. Security (Parallel)
- NPM audit for vulnerabilities
- Fails on high severity issues

### 3. Build
- Waits for test + security
- Collects build artifacts
- Uploads artifacts (30 days retention)

### 4. Deploy (Main only)
- ✅ Builds Docker image with multi-stage optimization
- 📤 Pushes to GitHub Container Registry
- 🏷️ Tags with `latest` and commit SHA
- 💾 Caches build layers for faster builds

### 5. Notify
- Generates pipeline summary
- Shows deployment status and image URL

## View Docker Image

After successful deploy to main:

```bash
# List available images
docker pull ghcr.io/your-username/todo-demo:latest

# View image details
docker inspect ghcr.io/your-username/todo-demo:latest
```

## Deploy Docker Image

### From GHCR:
```bash
# Pull and run
docker run -d -p 3000:3000 ghcr.io/your-username/todo-demo:latest

# Or with specific commit
docker run -d -p 3000:3000 ghcr.io/your-username/todo-demo:<commit-sha>
```

### Using docker-compose:
```bash
# Create .env with image
echo "IMAGE=ghcr.io/your-username/todo-demo:latest" > .env

# Update docker-compose.yml to use environment variable
services:
  todo-app:
    image: ${IMAGE}
    ports:
      - "3000:3000"

# Run
docker-compose up -d
```

## Manual Trigger

To manually trigger workflow:
```bash
# Even without code changes (GitHub CLI required)
gh workflow run ci-cd.yml -b main
```

## Disable Deploy

To disable automatic deploy:
1. Edit `.github/workflows/ci-cd.yml`
2. Remove or comment deploy job
3. Push changes

Or use `if` condition to skip:
```yaml
if: github.ref == 'refs/heads/main' && false  # Temporarily disabled
```

## Troubleshooting

### Docker push fails
- Check `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
- Verify Docker Hub token is valid (not expired)
- Check repository has push access

### Build fails
- Review test output in GitHub Actions
- Check Node.js version compatibility
- Run `npm ci && npm run test:unix` locally

### Image not found
- Wait for workflow to complete (check Actions tab)
- Pull specific version: `docker pull ghcr.io/user/repo:<sha>`
- Check repository visibility (must be public or private with authentication)

## Security Best Practices

- ✅ Use GitHub token (auto-revoked)
- ✅ Limit secret access to main branch only
- ✅ Use Docker image digest instead of tags
- ✅ Scan images regularly: `trivy image ghcr.io/user/repo:latest`
- ✅ Run containers with `--read-only` and no root

## Next Steps

1. ✅ Push code to `main` branch
2. ✅ Check Actions tab for workflow execution
3. ✅ View Docker image in Packages section
4. ✅ Deploy to production server

---

**Workflow Status:** Every push to main is automatically tested, built, and deployed! 🚀
