#!/bin/bash
services=("mobility-service:8081" "air-quality-service:8082" "emergency-service:8084" "emergency-gateway:8083" "citizen-engagement-service:8085" "ai-orchestrator-service:8000" "api-gateway:8080")

for service in "${services[@]}"; do
  name=${service%%:*}
  port=${service##*:}
  echo "Checking $name on port $port..."
  # Try actuator health (Spring Boot) or /health (FastAPI)
  until curl -s -f "http://localhost:$port/actuator/health" > /dev/null || curl -s -f "http://localhost:$port/health" > /dev/null; do
    echo "Waiting for $name..."
    sleep 5
  done
  echo "$name is UP!"
done
