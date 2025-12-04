from pydantic import BaseModel
from typing import Dict, Any, List, Optional


class WorkflowAction(BaseModel):
    step: int
    service: str
    protocol: str
    operation: str
    params: Dict[str, Any] = {}


class Workflow(BaseModel):
    intent: str
    entities: Dict[str, Any] = {}
    actions: List[WorkflowAction] = []
    error: Optional[str] = None
