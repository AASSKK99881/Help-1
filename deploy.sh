#!/bin/bash
set -e

echo "Starting deployment to Alibaba Cloud ECS..."

# Rebuild and start all services
docker compose -f compose.server.yaml up -d --build

echo "Waiting for services to be ready..."
sleep 15

# Show service status
docker compose -f compose.server.yaml ps

# Quick health check
echo ""
echo "Health check:"
curl -s http://localhost:8080/health || echo "Backend not ready yet"

echo ""
echo "Deployment complete!"
echo "Frontend: http://$(curl -s ifconfig.me)"
echo "Backend:  http://$(curl -s ifconfig.me):8080/health"
