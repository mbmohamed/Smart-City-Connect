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
    return {
        "service": "AI Orchestrator",
        "status": "running",
        "endpoints": ["/chat", "/health", "/services"]
    }


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


if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
