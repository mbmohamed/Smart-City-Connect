#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

GATEWAY_URL="http://localhost:8080"

echo "=========================================="
echo "   Smart City API Verification Script"
echo "=========================================="
echo "Gateway URL: $GATEWAY_URL"
echo ""

# Function to check an endpoint
check_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}

    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$response" -eq "$expected_code" ]; then
        echo -e "${GREEN}OK ($response)${NC}"
    else
        echo -e "${RED}FAILED (Expected $expected_code, Got $response)${NC}"
        echo "  -> URL: $url"
    fi
}

# 1. Check Swagger UI (HTML)
check_endpoint "Swagger UI" "$GATEWAY_URL/webjars/swagger-ui/index.html"

# 2. Check Aggregated Config
check_endpoint "Swagger Config" "$GATEWAY_URL/v3/api-docs/swagger-config"

# 3. Check Individual Service Docs (via Gateway)
echo ""
echo "--- Service Documentation ---"
check_endpoint "Mobility Service Docs" "$GATEWAY_URL/v3/api-docs/mobility"
check_endpoint "Air Quality Service Docs" "$GATEWAY_URL/v3/api-docs/air-quality"
check_endpoint "Emergency Service Docs" "$GATEWAY_URL/v3/api-docs/emergency"
check_endpoint "Citizen Service Docs" "$GATEWAY_URL/v3/api-docs/citizen"
check_endpoint "AI Orchestrator Docs" "$GATEWAY_URL/openapi.json"

# 4. Check GraphiQL (Redirects to 307 or 200 depending on browser vs curl)
echo ""
echo "--- Special Endpoints ---"
# GraphiQL usually redirects, so we accept 307 or 200
response=$(curl -s -o /dev/null -w "%{http_code}" "$GATEWAY_URL/graphiql")
if [[ "$response" == "200" || "$response" == "307" || "$response" == "302" ]]; then
    echo -e "Checking GraphiQL... ${GREEN}OK ($response)${NC}"
else
    echo -e "Checking GraphiQL... ${RED}FAILED (Got $response)${NC}"
fi

echo ""
echo "=========================================="
echo "Verification Complete."
