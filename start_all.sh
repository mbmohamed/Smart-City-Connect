#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Smart City Connect (H2 Edition)...${NC}"

# 1. Check Prerequisites
echo -e "${GREEN}1. Checking Prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: docker is not installed.${NC}"
    exit 1
fi
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: mvn (Maven) is not installed.${NC}"
    exit 1
fi

# Create network
docker network create smart-city-net || true

# 2. Build and Start Services
echo -e "${GREEN}2. Building and Starting Services...${NC}"

# Function to build and start a service
build_and_run() {
    service=$1
    port=$2
    echo -e "   - Processing ${BLUE}$service${NC}..."
    
    cd $service
    # Build
    if mvn clean package -DskipTests -q; then
        echo -e "     Build: ${GREEN}OK${NC}"
    else
        echo -e "     Build: ${RED}FAILED${NC}"
        exit 1
    fi
    
    # Docker Build
    docker build -t $service:latest . > /dev/null
    
    # Docker Run (Custom logic per service)
    docker rm -f $service || true
    
    # Common H2 Env Vars
    H2_URL="jdbc:h2:file:/data/db;DB_CLOSE_ON_EXIT=FALSE"
    H2_DRIVER="org.h2.Driver"
    H2_USER="sa"
    H2_PASS=""

    # Determine if port should be exposed (only for gateway)
    PORT_MAPPING=""
    if [ "$service" == "api-gateway" ]; then
        PORT_MAPPING="-p $port:$port"
    fi

    if [ "$service" == "mobility-service" ]; then
        docker run -d --name $service --network smart-city-net $PORT_MAPPING \
          -v $(pwd)/../data/mobility:/data \
          -e SPRING_DATASOURCE_URL="$H2_URL" \
          -e SPRING_DATASOURCE_DRIVER_CLASS_NAME="$H2_DRIVER" \
          -e SPRING_DATASOURCE_USERNAME="$H2_USER" \
          -e SPRING_DATASOURCE_PASSWORD="$H2_PASS" \
          $service:latest > /dev/null
    elif [ "$service" == "air-quality-service" ]; then
        docker run -d --name $service --network smart-city-net $PORT_MAPPING \
          -v $(pwd)/../data/air-quality:/data \
          -e SPRING_DATASOURCE_URL="$H2_URL" \
          -e SPRING_DATASOURCE_DRIVER_CLASS_NAME="$H2_DRIVER" \
          -e SPRING_DATASOURCE_USERNAME="$H2_USER" \
          -e SPRING_DATASOURCE_PASSWORD="$H2_PASS" \
          $service:latest > /dev/null
    elif [ "$service" == "emergency-service" ]; then
        docker run -d --name $service --network smart-city-net $PORT_MAPPING \
          -v $(pwd)/../data/emergency:/data \
          -e SPRING_DATASOURCE_URL="$H2_URL" \
          -e SPRING_DATASOURCE_DRIVER_CLASS_NAME="$H2_DRIVER" \
          -e SPRING_DATASOURCE_USERNAME="$H2_USER" \
          -e SPRING_DATASOURCE_PASSWORD="$H2_PASS" \
          -e GRPC_SERVER_PORT=9093 \
          $service:latest > /dev/null
    elif [ "$service" == "emergency-gateway" ]; then
        docker run -d --name $service --network smart-city-net $PORT_MAPPING \
          -e GRPC_CLIENT_EMERGENCY_SERVICE_ADDRESS=static://emergency-service:9093 \
          -e GRPC_CLIENT_EMERGENCY_SERVICE_NEGOTIATION_TYPE=PLAINTEXT \
          $service:latest > /dev/null
    elif [ "$service" == "citizen-engagement-service" ]; then
        docker run -d --name $service --network smart-city-net $PORT_MAPPING \
          -v $(pwd)/../data/citizen:/data \
          -e SPRING_DATASOURCE_URL="$H2_URL" \
          -e SPRING_DATASOURCE_DRIVER_CLASS_NAME="$H2_DRIVER" \
          -e SPRING_DATASOURCE_USERNAME="$H2_USER" \
          -e SPRING_DATASOURCE_PASSWORD="$H2_PASS" \
          $service:latest > /dev/null
    elif [ "$service" == "api-gateway" ]; then
         docker run -d --name $service --network smart-city-net $PORT_MAPPING \
          -e MOBILITY_URI=http://mobility-service:8081 \
          -e AIR_QUALITY_URI=http://air-quality-service:8082 \
          -e EMERGENCY_URI=http://emergency-gateway:8083 \
          -e CITIZEN_URI=http://citizen-engagement-service:8085 \
          -e ORCHESTRATOR_URI=http://ai-orchestrator-service:8000 \
          $service:latest > /dev/null
    fi
    
    cd ..
    echo -e "     Start: ${GREEN}OK${NC}"
}

build_and_run "mobility-service" 8081
build_and_run "air-quality-service" 8082
build_and_run "emergency-service" 8084
build_and_run "citizen-engagement-service" 8085
build_and_run "api-gateway" 8080

# AI Orchestrator (Python)
echo -e "   - Processing ${BLUE}ai-orchestrator-service${NC}..."
cd ai-orchestrator-service
docker build -t ai-orchestrator-service:latest . > /dev/null
docker rm -f ai-orchestrator-service || true
docker run -d --name ai-orchestrator-service --network smart-city-net \
  -e PORT=8000 -e HOST=0.0.0.0 \
  -e AIR_QUALITY_SERVICE_HOST=air-quality-service -e AIR_QUALITY_SERVICE_PORT=8082 \
  -e MOBILITY_SERVICE_HOST=mobility-service -e MOBILITY_SERVICE_PORT=8081 \
  ai-orchestrator-service:latest > /dev/null
cd ..
echo -e "     Start: ${GREEN}OK${NC}"

# Frontend
echo -e "   - Processing ${BLUE}smart-city-frontend${NC}..."
cd smart-city-frontend
docker build -t smart-city-frontend:latest . > /dev/null
docker rm -f smart-city-frontend || true
docker run -d --name smart-city-frontend --network smart-city-net -p 3000:80 \
  smart-city-frontend:latest > /dev/null
cd ..
echo -e "     Start: ${GREEN}OK${NC}"

# 3. Final Summary
echo -e "\n${BLUE}🎉 Application Ready!${NC}"
echo -e "------------------------------------------------"
echo -e "Frontend:       ${GREEN}http://localhost:3000${NC}"
echo -e "API Gateway:    ${GREEN}http://localhost:8080${NC}"
echo -e "AI Docs:        ${GREEN}http://localhost:8000/docs${NC}"
echo -e "------------------------------------------------"
