from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn

from config import HOST, PORT
from llm.gemini_client import GeminiOrchestrator
from workflow.executor import WorkflowExecutor

app = FastAPI(
    title="AI Orchestrator - Smart City Connect",
    description="Service d'orchestration intelligent basé sur LLM pour les microservices Smart City",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
orchestrator = GeminiOrchestrator()
executor = WorkflowExecutor()


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
    workflow: Optional[Dict[str, Any]] = None
    results: Optional[List[Dict[str, Any]]] = None
    success: bool


class ServiceInfo(BaseModel):
    name: str
    protocol: str
    port: int
    description: str


@app.get("/")
async def root():
    return {"service": "AI Orchestrator", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/services", response_model=List[ServiceInfo])
async def list_services():
    return [
        ServiceInfo(
            name="Mobility Service",
            protocol="REST",
            port=8080,
            description="Transport et mobilité urbaine"
        ),
        ServiceInfo(
            name="Air Quality Service",
            protocol="SOAP",
            port=8081,
            description="Qualité de l'air et pollution"
        ),
        ServiceInfo(
            name="Emergency Service",
            protocol="gRPC",
            port=9093,
            description="Gestion des alertes d'urgence"
        ),
        ServiceInfo(
            name="Citizen Engagement",
            protocol="GraphQL",
            port=8084,
            description="Événements et signalements citoyens"
        )
    ]


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Step 1: Generate workflow from user message
        workflow = await orchestrator.generate_workflow(request.message, request.context)
        
        if not workflow or "actions" not in workflow:
            return ChatResponse(
                response="Je n'ai pas pu comprendre votre demande. Pouvez-vous reformuler ?",
                success=False
            )
        
        # Step 2: Execute the workflow
        results = await executor.execute(workflow)
        
        # Step 3: Generate human-readable response
        response = await orchestrator.generate_response(request.message, results)
        
        return ChatResponse(
            response=response,
            workflow=workflow,
            results=results,
            success=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



class TripPlanRequest(BaseModel):
    origin: str
    destination: str
    zone_id: str  # To check air quality

@app.post("/trip-plan")
async def plan_trip(request: TripPlanRequest):
    try:
        # 1. Check Air Quality (SOAP via Zeep or simple HTTP XML if easier, using mock logic for now or direct call)
        # For simplicity in this demo, we'll use a direct HTTP call to the Air Quality Service
        # In a real scenario, we'd use a SOAP client like Zeep
        
        air_quality_status = "UNKNOWN"
        try:
            # Construct SOAP Envelope
            soap_envelope = f"""
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://smartcity.com/air-quality-service/schema">
               <soapenv:Header/>
               <soapenv:Body>
                  <gs:getAirQualityRequest>
                     <gs:zoneId>{request.zone_id}</gs:zoneId>
                  </gs:getAirQualityRequest>
               </soapenv:Body>
            </soapenv:Envelope>
            """
            
            # Call Air Quality Service (assuming it's on port 8082 as per new plan)
            # Note: In Docker, hostname will be 'air-quality-service'
            import httpx
            import xml.etree.ElementTree as ET
            
            # Use localhost for local dev, service name for Docker. 
            import os
            aq_host = os.getenv("AIR_QUALITY_SERVICE_HOST", "localhost")
            aq_port = os.getenv("AIR_QUALITY_SERVICE_PORT", "8082")
            aq_url = f"http://{aq_host}:{aq_port}/ws" 
            
            async with httpx.AsyncClient() as client:
                response = await client.post(aq_url, content=soap_envelope, headers={"Content-Type": "text/xml"})
                
                if response.status_code == 200:
                    root = ET.fromstring(response.text)
                    # Namespace map might be needed
                    namespaces = {'ns2': 'http://smartcity.com/air-quality-service/schema'}
                    aqi_elem = root.find(".//ns2:aqi", namespaces)
                    if aqi_elem is not None:
                        aqi = int(aqi_elem.text)
                        if aqi > 100:
                            air_quality_status = "POLLUTED"
                        else:
                            air_quality_status = "GOOD"
        except Exception as e:
            print(f"Error checking air quality: {e}")
            air_quality_status = "ERROR"


        # 2. Fetch Transport Options
        transport_options = []
        try:
            # Use env var for Mobility Service URL, default to localhost
            import os
            mobility_host = os.getenv("MOBILITY_SERVICE_HOST", "localhost")
            mobility_port = os.getenv("MOBILITY_SERVICE_PORT", "8081")
            mobility_url = f"http://{mobility_host}:{mobility_port}/api/v1/transport/lines"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(mobility_url)
                if response.status_code == 200:
                    transport_options = response.json()
        except Exception as e:
             print(f"Error fetching transport: {e}")


        # 3. Logic: If Polluted, filter for "Clean" transport (e.g., Metro/Tram only, no Bus if diesel)
        # For demo, we'll just add a recommendation message.
        recommendation = "Standard route."
        if air_quality_status == "POLLUTED":
            recommendation = "⚠️ Air Quality is POOR. We recommend using Metro or Tram to reduce exposure."
            # Filter options (mock logic)
            transport_options = [t for t in transport_options if t.get('type') in ['METRO', 'TRAM']]
        
        return {
            "origin": request.origin,
            "destination": request.destination,
            "air_quality_status": air_quality_status,
            "recommendation": recommendation,
            "available_transport": transport_options
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
