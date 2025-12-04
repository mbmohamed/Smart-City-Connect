#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Smart City Connect...${NC}"

# 1. Start MySQL
echo -e "${GREEN}1. Starting MySQL Database...${NC}"
docker start smartcity-mysql
sleep 5

# 2. Start Backend Services
echo -e "${GREEN}2. Starting Backend Services...${NC}"

# Mobility Service
echo "   - Starting Mobility Service (Port 8080)..."
nohup java -jar mobility-service/target/mobility-service-0.0.1-SNAPSHOT.jar > logs/mobility.log 2>&1 &

# Air Quality Service
echo "   - Starting Air Quality Service (Port 8081)..."
nohup java -jar air-quality-service/target/air-quality-service-0.0.1-SNAPSHOT.jar > logs/airquality.log 2>&1 &

# Emergency Service
echo "   - Starting Emergency Service (Port 9093)..."
nohup java -jar emergency-service/target/emergency-service-0.0.1-SNAPSHOT.jar > logs/emergency.log 2>&1 &

# Wait for gRPC service to be ready
echo "   - Waiting for gRPC service..."
sleep 10

# Emergency Gateway
echo "   - Starting Emergency Gateway (Port 8083)..."
nohup java -jar emergency-gateway/target/emergency-gateway-0.0.1-SNAPSHOT.jar > logs/gateway.log 2>&1 &

# Citizen Engagement Service
echo "   - Starting Citizen Engagement Service (Port 8084)..."
nohup java -jar citizen-engagement-service/target/citizen-engagement-service-0.0.1-SNAPSHOT.jar > logs/citizen.log 2>&1 &

# AI Orchestrator Service
echo "   - Starting AI Orchestrator Service (Port 8085)..."
cd ai-orchestrator-service
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
nohup python -m uvicorn main:app --host 0.0.0.0 --port 8085 > ../logs/orchestrator.log 2>&1 &
cd ..

# 3. Start Frontend
echo -e "${GREEN}3. Starting Frontend...${NC}"
cd smart-city-frontend
npm run dev
