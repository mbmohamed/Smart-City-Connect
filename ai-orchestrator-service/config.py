import os
from dotenv import load_dotenv

load_dotenv()

# Service URLs
MOBILITY_SERVICE_URL = os.getenv("MOBILITY_SERVICE_URL", "http://localhost:8080")
AIR_QUALITY_SERVICE_URL = os.getenv("AIR_QUALITY_SERVICE_URL", "http://localhost:8081")
EMERGENCY_SERVICE_HOST = os.getenv("EMERGENCY_SERVICE_HOST", "localhost")
EMERGENCY_SERVICE_PORT = int(os.getenv("EMERGENCY_SERVICE_PORT", "9093"))
CITIZEN_ENGAGEMENT_URL = os.getenv("CITIZEN_ENGAGEMENT_URL", "http://localhost:8084/graphql")

# Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Server config
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8085"))
