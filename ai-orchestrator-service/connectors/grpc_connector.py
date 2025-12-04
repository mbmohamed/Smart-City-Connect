import grpc
from typing import Dict, Any, Optional
from google.protobuf.json_format import MessageToDict

from config import EMERGENCY_SERVICE_HOST, EMERGENCY_SERVICE_PORT

# Import generated protobuf modules (will be generated from .proto file)
try:
    from . import emergency_pb2
    from . import emergency_pb2_grpc
    GRPC_AVAILABLE = True
except ImportError:
    GRPC_AVAILABLE = False
    print("⚠️ gRPC stubs not available. Run 'python -m grpc_tools.protoc ...' to generate them.")


class GRPCConnector:
    """Connector for gRPC-based Emergency Service."""
    
    def __init__(self, host: str = EMERGENCY_SERVICE_HOST, port: int = EMERGENCY_SERVICE_PORT):
        self.host = host
        self.port = port
        self.address = f"{host}:{port}"
    
    async def execute(self, operation: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute a gRPC operation.
        
        Args:
            operation: gRPC method name (e.g., "GetAllAlerts", "CreateAlert")
            params: Method parameters
        
        Returns:
            Response data as dictionary
        """
        if not GRPC_AVAILABLE:
            return self._mock_response(operation, params)
        
        try:
            # Create channel and stub
            channel = grpc.insecure_channel(self.address)
            stub = emergency_pb2_grpc.EmergencyServiceStub(channel)
            
            if operation == "GetAllAlerts":
                request = emergency_pb2.GetAllAlertsRequest()
                response = stub.GetAllAlerts(request)
                
            elif operation == "CreateAlert":
                request = emergency_pb2.CreateAlertRequest(
                    type=params.get("type", "INFO"),
                    title=params.get("title", ""),
                    description=params.get("description", ""),
                    latitude=params.get("latitude", 0.0),
                    longitude=params.get("longitude", 0.0)
                )
                response = stub.CreateAlert(request)
            
            else:
                return {"error": f"Unknown gRPC operation: {operation}"}
            
            # Convert protobuf to dict
            result = MessageToDict(response)
            channel.close()
            
            return {"data": result}
            
        except grpc.RpcError as e:
            return {"error": f"gRPC error: {e.code()} - {e.details()}"}
        except Exception as e:
            return {"error": f"gRPC error: {str(e)}"}
    
    def _mock_response(self, operation: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Mock response when gRPC stubs are not available."""
        if operation == "GetAllAlerts":
            return {
                "data": {
                    "alerts": [
                        {
                            "id": "1",
                            "type": "CRITICAL",
                            "title": "Inondation - Avenue Habib Bourguiba",
                            "description": "Route inondée, circulation perturbée",
                            "status": "ACTIVE"
                        },
                        {
                            "id": "2",
                            "type": "WARNING",
                            "title": "Travaux - Rue de la Liberté",
                            "description": "Travaux en cours, déviation recommandée",
                            "status": "ACTIVE"
                        }
                    ]
                },
                "note": "Mock data - gRPC stubs not generated"
            }
        elif operation == "CreateAlert":
            return {
                "data": {
                    "id": "new-alert-123",
                    "status": "CREATED"
                },
                "note": "Mock response - gRPC stubs not generated"
            }
        
        return {"error": f"Unknown operation: {operation}"}
