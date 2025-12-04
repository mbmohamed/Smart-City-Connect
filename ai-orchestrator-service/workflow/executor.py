from typing import Dict, Any, List
import asyncio

from connectors.rest_connector import RESTConnector
from connectors.soap_connector import SOAPConnector
from connectors.graphql_connector import GraphQLConnector
from connectors.grpc_connector import GRPCConnector


class WorkflowExecutor:
    """Execute workflows by calling the appropriate service connectors."""
    
    def __init__(self):
        self.rest_connector = RESTConnector()
        self.soap_connector = SOAPConnector()
        self.graphql_connector = GraphQLConnector()
        self.grpc_connector = GRPCConnector()
    
    async def execute(self, workflow: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute a workflow and return results from all actions.
        
        Args:
            workflow: Workflow dictionary with 'actions' list
        
        Returns:
            List of results from each action
        """
        actions = workflow.get("actions", [])
        
        if not actions:
            return [{"error": "No actions in workflow"}]
        
        results = []
        
        # Sort by step number
        sorted_actions = sorted(actions, key=lambda x: x.get("step", 0))
        
        for action in sorted_actions:
            service = action.get("service", "")
            protocol = action.get("protocol", "").upper()
            operation = action.get("operation", "")
            params = action.get("params", {})
            
            result = await self._execute_action(service, protocol, operation, params)
            result["service"] = service
            result["step"] = action.get("step")
            results.append(result)
        
        return results
    
    async def _execute_action(
        self,
        service: str,
        protocol: str,
        operation: str,
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute a single action using the appropriate connector."""
        
        try:
            if protocol == "REST":
                return await self.rest_connector.execute(operation, params)
            
            elif protocol == "SOAP":
                return await self.soap_connector.execute(operation, params)
            
            elif protocol == "GRAPHQL":
                return await self.graphql_connector.execute(operation, params)
            
            elif protocol == "GRPC":
                return await self.grpc_connector.execute(operation, params)
            
            else:
                return {"error": f"Unknown protocol: {protocol}"}
                
        except Exception as e:
            return {"error": f"Execution error: {str(e)}"}
