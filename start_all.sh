#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Smart City Connect (Docker Edition)...${NC}"

# 1. Check Prerequisites
echo -e "${GREEN}1. Checking Prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: docker is not installed.${NC}"
    exit 1
fi
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: mvn (Maven) is not installed.${NC}"
    echo "Please install Maven to build the microservices."
    exit 1
fi

# 2. Build Microservices
echo -e "${GREEN}2. Building Microservices (Maven)...${NC}"
services=("mobility-service" "air-quality-service" "emergency-service" "emergency-gateway" "citizen-engagement-service" "api-gateway")

for service in "${services[@]}"; do
    echo -n "   - Building $service..."
    if (cd "$service" && mvn clean package -DskipTests > /dev/null 2>&1); then
        echo -e " ${GREEN}OK${NC}"
    else
        echo -e " ${RED}FAILED${NC}"
        echo "Check $service/target/ for logs or run 'mvn clean package' manually."
        exit 1
    fi
done

# 3. Start Docker Stack
echo -e "${GREEN}3. Starting Docker Stack...${NC}"
echo "   - Stopping any existing containers..."
docker-compose down > /dev/null 2>&1

echo "   - Building and starting containers..."
if docker-compose up -d --build; then
    echo -e "   - Docker stack started ${GREEN}successfully${NC}."
else
    echo -e "${RED}Error: Failed to start Docker stack.${NC}"
    exit 1
fi

# 4. Wait for Database
echo -e "${GREEN}4. Waiting for Database...${NC}"
echo -n "   - Waiting for MySQL to be healthy..."
retries=30
while [ $retries -gt 0 ]; do
    if docker ps | grep mysql-container | grep "(healthy)" > /dev/null; then
        echo -e " ${GREEN}OK${NC}"
        break
    fi
    echo -n "."
    sleep 2
    ((retries--))
done

if [ $retries -eq 0 ]; then
    echo -e " ${RED}TIMEOUT${NC}"
    echo "MySQL did not become healthy in time."
    exit 1
fi

# 5. Seed Database
echo -e "${GREEN}5. Seeding Database...${NC}"
if cat docker/seed_tunisia_data.sql | docker exec -i mysql-container mariadb -u root -proot; then
    echo -e "   - Data seeded ${GREEN}successfully${NC}."
else
    echo -e "${RED}Error: Failed to seed database.${NC}"
    # Don't exit, app might still work partially
fi

# 6. Final Summary
echo -e "\n${BLUE}🎉 Application Ready!${NC}"
echo -e "------------------------------------------------"
echo -e "Frontend:       ${GREEN}http://localhost:3000${NC}"
echo -e "API Gateway:    ${GREEN}http://localhost:8080${NC}"
echo -e "AI Docs:        ${GREEN}http://localhost:8000/docs${NC}"
echo -e "------------------------------------------------"
echo "Use 'docker-compose down' to stop the application."
