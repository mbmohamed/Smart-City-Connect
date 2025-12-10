#!/bin/bash
mkdir -p verification_results

# Mobility
echo "Verifying Mobility..."
curl -s http://localhost:8081/api/v1/transport/lines > verification_results/mobility.json

# Air Quality
echo "Verifying Air Quality..."
curl -s -X POST -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://smartcity.com/air-quality-service/schema"><soapenv:Header/><soapenv:Body><gs:getAirQualityRequest><gs:zoneId>zone-1</gs:zoneId></gs:getAirQualityRequest></soapenv:Body></soapenv:Envelope>' \
  http://localhost:8082/ws > verification_results/air_quality.xml

# Emergency (via Gateway)
echo "Verifying Emergency..."
curl -s http://localhost:8083/api/emergency/alerts > verification_results/emergency_alerts.json

# Citizen
echo "Verifying Citizen..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{ "query": "{ getAllEvents { id title } }" }' \
  http://localhost:8085/graphql > verification_results/citizen_events.json

# Orchestrator
echo "Verifying Orchestrator..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{ "origin": "A", "destination": "B", "zone_id": "zone-1" }' \
  http://localhost:8000/trip-plan > verification_results/orchestrator_trip.json
