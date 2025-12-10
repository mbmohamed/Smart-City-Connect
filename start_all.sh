#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Smart City Connect (Docker Edition - Robust Mode)...${NC}"

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

# 2. Start Database
echo -e "${GREEN}2. Starting Database...${NC}"
docker rm -f mysql-container || true
docker run -d --name mysql-container \
  --network smart-city-net \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=smartcity_mobility \
  mariadb:latest

echo -n "   - Waiting for MySQL..."
sleep 10
echo -e " ${GREEN}OK${NC}"

# 3. Build and Start Services
echo -e "${GREEN}3. Building and Starting Services...${NC}"

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
    
    if [ "$service" == "mobility-service" ]; then
        docker run -d --name $service --network smart-city-net -p $port:$port \
          -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_mobility?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
          -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=root \
          $service:latest > /dev/null
    elif [ "$service" == "air-quality-service" ]; then
        docker run -d --name $service --network smart-city-net -p $port:$port \
          -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_airquality?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
          -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=root \
          $service:latest > /dev/null
    elif [ "$service" == "emergency-service" ]; then
        docker run -d --name $service --network smart-city-net -p $port:$port -p 9093:9093 \
          -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_emergency?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
          -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=root \
          -e GRPC_SERVER_PORT=9093 \
          $service:latest > /dev/null
    elif [ "$service" == "emergency-gateway" ]; then
        docker run -d --name $service --network smart-city-net -p $port:$port \
          -e GRPC_CLIENT_EMERGENCY_SERVICE_ADDRESS=static://emergency-service:9093 \
          -e GRPC_CLIENT_EMERGENCY_SERVICE_NEGOTIATION_TYPE=PLAINTEXT \
          $service:latest > /dev/null
    elif [ "$service" == "citizen-engagement-service" ]; then
        docker run -d --name $service --network smart-city-net -p $port:$port \
          -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_citizen?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
          -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=root \
          $service:latest > /dev/null
    elif [ "$service" == "api-gateway" ]; then
         docker run -d --name $service --network smart-city-net -p $port:$port \
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
build_and_run "emergency-gateway" 8083
build_and_run "citizen-engagement-service" 8085
build_and_run "api-gateway" 8080

# AI Orchestrator (Python)
echo -e "   - Processing ${BLUE}ai-orchestrator-service${NC}..."
cd ai-orchestrator-service
docker build -t ai-orchestrator-service:latest . > /dev/null
docker rm -f ai-orchestrator-service || true
docker run -d --name ai-orchestrator-service --network smart-city-net -p 8000:8000 \
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

# 4. Seed Database
echo -e "${GREEN}4. Seeding Database...${NC}"
# Wait for tables to be initialized
echo -n "   - Waiting for tables to be initialized..."
retries=60
while [ $retries -gt 0 ]; do
    if docker exec -i mysql-container mariadb -u root -proot -e "USE smartcity_mobility; SHOW TABLES LIKE 'transport_line';" 2>/dev/null | grep "transport_line" > /dev/null; then
        echo -e " ${GREEN}OK${NC}"
        break
    fi
    echo -n "."
    sleep 2
    ((retries--))
done

if [ $retries -eq 0 ]; then
    echo -e " ${RED}TIMEOUT${NC}"
    echo "Tables were not created in time. Seeding might fail."
fi

if [ -f "docker/seed_tunisia_data.sql" ]; then
    if cat docker/seed_tunisia_data.sql | docker exec -i mysql-container mariadb -u root -proot; then
        echo -e "   - Data seeded ${GREEN}successfully${NC}."
    else
        echo -e "${RED}Error: Failed to seed database (Check if file exists or DB is ready).${NC}"
    fi
else
     echo -e "${RED}Warning: Seed file docker/seed_tunisia_data.sql not found.${NC}"
fi

# 5. Final Summary
echo -e "\n${BLUE}🎉 Application Ready!${NC}"
echo -e "------------------------------------------------"
echo -e "Frontend:       ${GREEN}http://localhost:3000${NC}"
echo -e "API Gateway:    ${GREEN}http://localhost:8080${NC}"
echo -e "AI Docs:        ${GREEN}http://localhost:8000/docs${NC}"
echo -e "------------------------------------------------"
