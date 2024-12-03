#!/bin/bash
# scripts/deploy.sh

# Load environment variables
set -a
source .env.${ENVIRONMENT:-production}
set +a

# Build and deploy services
if [ "$ENVIRONMENT" = "production" ]; then
    docker-compose -f docker-compose.prod.yml build
    docker-compose -f docker-compose.prod.yml up -d
else
    docker-compose up -d --build
fi

# Health check
./scripts/health-check.sh

# Monitor logs
docker-compose logs -f