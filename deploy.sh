#!/bin/bash
set -e

echo "Starting deployment..."

# Pull latest images (if using GHCR)
# docker compose -f compose.prod.yaml pull

# Rebuild and start
docker compose -f compose.prod.yaml up -d --build

echo "Waiting for services to be ready..."
sleep 10

# Show service status
docker compose -f compose.prod.yaml ps

echo "Deployment complete"
