#!/bin/bash
set -e

# Create network
docker network create smart-city-net || true

# 1. MySQL
echo "Starting MySQL..."
docker rm -f mysql-container || true
docker run -d --name mysql-container \
  --network smart-city-net \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=smartcity_mobility \
  mariadb:latest

# Wait for MySQL
echo "Waiting for MySQL..."
sleep 10

# 2. Mobility Service
echo "Building and Starting Mobility Service..."
cd mobility-service
mvn clean package -DskipTests -q
docker build -t mobility-service:latest .
docker rm -f mobility-service || true
docker run -d --name mobility-service \
  --network smart-city-net \
  -p 8081:8081 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_mobility?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  mobility-service:latest
cd ..

# 3. Air Quality Service
echo "Building and Starting Air Quality Service..."
cd air-quality-service
mvn clean package -DskipTests -q
docker build -t air-quality-service:latest .
docker rm -f air-quality-service || true
docker run -d --name air-quality-service \
  --network smart-city-net \
  -p 8082:8082 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_airquality?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  air-quality-service:latest
cd ..

# 4. Emergency Service
echo "Building and Starting Emergency Service..."
cd emergency-service
mvn clean package -DskipTests -q
docker build -t emergency-service:latest .
docker rm -f emergency-service || true
docker run -d --name emergency-service \
  --network smart-city-net \
  -p 8084:8084 -p 9093:9093 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_emergency?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  -e GRPC_SERVER_PORT=9093 \
  emergency-service:latest
cd ..

# 5. Emergency Gateway
echo "Building and Starting Emergency Gateway..."
cd emergency-gateway
mvn clean package -DskipTests -q
docker build -t emergency-gateway:latest .
docker rm -f emergency-gateway || true
docker run -d --name emergency-gateway \
  --network smart-city-net \
  -p 8083:8083 \
  -e GRPC_CLIENT_EMERGENCY_SERVICE_ADDRESS=static://emergency-service:9093 \
  -e GRPC_CLIENT_EMERGENCY_SERVICE_NEGOTIATION_TYPE=PLAINTEXT \
  emergency-gateway:latest
cd ..

# 6. Citizen Engagement Service
echo "Building and Starting Citizen Engagement Service..."
cd citizen-engagement-service
mvn clean package -DskipTests -q
docker build -t citizen-engagement-service:latest .
docker rm -f citizen-engagement-service || true
docker run -d --name citizen-engagement-service \
  --network smart-city-net \
  -p 8085:8085 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-container:3306/smartcity_citizen?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  citizen-engagement-service:latest
cd ..

# 7. AI Orchestrator
echo "Building and Starting AI Orchestrator..."
cd ai-orchestrator-service
docker build -t ai-orchestrator-service:latest .
docker rm -f ai-orchestrator-service || true
docker run -d --name ai-orchestrator-service \
  --network smart-city-net \
  -p 8000:8000 \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  -e AIR_QUALITY_SERVICE_HOST=air-quality-service \
  -e AIR_QUALITY_SERVICE_PORT=8082 \
  -e MOBILITY_SERVICE_HOST=mobility-service \
  -e MOBILITY_SERVICE_PORT=8081 \
  ai-orchestrator-service:latest
cd ..

# 8. API Gateway
echo "Building and Starting API Gateway..."
cd api-gateway
mvn clean package -DskipTests -q
docker build -t api-gateway:latest .
docker rm -f api-gateway || true
docker run -d --name api-gateway \
  --network smart-city-net \
  -p 8080:8080 \
  -e MOBILITY_URI=http://mobility-service:8081 \
  -e AIR_QUALITY_URI=http://air-quality-service:8082 \
  -e EMERGENCY_URI=http://emergency-gateway:8083 \
  -e CITIZEN_URI=http://citizen-engagement-service:8085 \
  -e ORCHESTRATOR_URI=http://ai-orchestrator-service:8000 \
  api-gateway:latest
cd ..

# 9. Frontend
echo "Building and Starting Frontend..."
cd smart-city-frontend
docker build -t smart-city-frontend:latest .
docker rm -f smart-city-frontend || true
docker run -d --name smart-city-frontend \
  --network smart-city-net \
  -p 3000:80 \
  smart-city-frontend:latest
cd ..

echo "All services started!"
