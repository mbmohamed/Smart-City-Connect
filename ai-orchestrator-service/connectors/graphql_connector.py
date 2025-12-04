import httpx
from typing import Dict, Any, Optional

from config import CITIZEN_ENGAGEMENT_URL


class GraphQLConnector:
    """Connector for GraphQL-based Citizen Engagement Service."""
    
    def __init__(self, url: str = CITIZEN_ENGAGEMENT_URL):
        self.url = url
        self.queries = {
            "getAllEvents": """
                query {
                    getAllEvents {
                        id
                        title
                        description
                        date
                        location
                        category
                    }
                }
            """,
            "getAllIssues": """
                query {
                    getAllIssues {
                        id
                        title
                        description
                        status
                        reportedBy
                        dateReported
                    }
                }
            """,
            "reportIssue": """
                mutation ReportIssue($title: String!, $description: String!, $reportedBy: String!) {
                    reportIssue(title: $title, description: $description, reportedBy: $reportedBy) {
                        id
                        title
                        status
                    }
                }
            """
        }
    
    async def execute(self, operation: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute a GraphQL operation.
        
        Args:
            operation: GraphQL operation name
            params: Variables for the operation
        
        Returns:
            Response data as dictionary
        """
        try:
            query = self.queries.get(operation)
            if not query:
                return {"error": f"Unknown GraphQL operation: {operation}"}
            
            payload = {
                "query": query,
                "variables": params or {}
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                response.raise_for_status()
                result = response.json()
                
                if "errors" in result:
                    return {"error": result["errors"]}
                
                return {"data": result.get("data", {})}
                
        except httpx.HTTPStatusError as e:
            return {"error": f"GraphQL HTTP error: {e.response.status_code}"}
        except Exception as e:
            return {"error": f"GraphQL error: {str(e)}"}
