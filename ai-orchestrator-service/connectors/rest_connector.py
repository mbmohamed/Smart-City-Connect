import httpx
from typing import Dict, Any, Optional

from config import MOBILITY_SERVICE_URL


class RESTConnector:
    """Connector for REST-based Mobility Service."""
    
    def __init__(self, base_url: str = MOBILITY_SERVICE_URL):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def execute(self, operation: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute a REST operation.
        
        Args:
            operation: REST operation in format "METHOD /path"
            params: Query parameters or request body
        
        Returns:
            Response data as dictionary
        """
        try:
            # Parse operation
            parts = operation.split(" ", 1)
            method = parts[0].upper() if len(parts) > 0 else "GET"
            path = parts[1] if len(parts) > 1 else operation
            
            url = f"{self.base_url}{path}"
            
            if method == "GET":
                response = await self.client.get(url, params=params)
            elif method == "POST":
                response = await self.client.post(url, json=params)
            elif method == "PUT":
                response = await self.client.put(url, json=params)
            elif method == "DELETE":
                response = await self.client.delete(url, params=params)
            else:
                return {"error": f"Unsupported HTTP method: {method}"}
            
            response.raise_for_status()
            return {"data": response.json(), "status": response.status_code}
            
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP error: {e.response.status_code}", "details": str(e)}
        except httpx.RequestError as e:
            return {"error": f"Request failed: {str(e)}"}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}
    
    async def close(self):
        await self.client.aclose()
