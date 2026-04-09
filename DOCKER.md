# Docker Deployment Guide

## Production Deployment

### Build and Run with Docker Compose (Production)

```bash
# Build image
docker-compose build

# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

### Build and Run Docker Manually (Production)

```bash
# Build image
docker build -t todo-app:latest .

# Run container
docker run -d \
  --name todo-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  todo-app:latest

# View logs
docker logs -f todo-app

# Stop and remove
docker stop todo-app
docker rm todo-app
```

## Development Deployment

### Using Docker Compose (Development with auto-reload)

```bash
# Build development image
docker-compose -f docker-compose.dev.yml build

# Start development container
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop container
docker-compose -f docker-compose.dev.yml down
```

## Access Application

- **Production**: http://localhost:3000
- **Development**: http://localhost:3000

## File Structure

- `Dockerfile` - Production-optimized multi-stage build
- `Dockerfile.dev` - Development build with nodemon for hot-reload
- `docker-compose.yml` - Production compose configuration
- `docker-compose.dev.yml` - Development compose configuration
- `.dockerignore` - Files to exclude from Docker build

## Docker Image Details

### Production Image (Multi-stage)
- Base: Node.js 18-alpine (minimal size ~200MB)
- Stages: Builder (install) → Runtime (copy)
- Health check enabled
- Automatic restart on failure

### Development Image
- Base: Node.js 18-alpine
- Nodemon for automatic file watch and reload
- Volume mounted for live development
- Auto-restart enabled

## Push to Registry

```bash
# Push to Docker Hub
docker tag todo-app:latest your-username/todo-app:latest
docker push your-username/todo-app:latest

# Push to GitHub Container Registry
docker tag todo-app:latest ghcr.io/your-username/todo-app:latest
docker push ghcr.io/your-username/todo-app:latest
```

## Docker Networking

Both compose files use named networks:
- Production: `todo-network`
- Development: `todo-network-dev`

This allows multiple services to communicate if needed in the future.

## Environment Variables

### Production
- `NODE_ENV=production`

### Development
- `NODE_ENV=development`

Custom environment variables can be added to `.env` file and referenced in compose files.
