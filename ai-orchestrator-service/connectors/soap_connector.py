import httpx
from typing import Dict, Any, Optional
from xml.etree import ElementTree as ET

from config import AIR_QUALITY_SERVICE_URL


class SOAPConnector:
    """Connector for SOAP-based Air Quality Service."""
    
    def __init__(self, base_url: str = AIR_QUALITY_SERVICE_URL):
        self.base_url = base_url
        self.wsdl_url = f"{base_url}/ws/air-quality.wsdl"
        self.soap_url = f"{base_url}/ws"
        self.namespace = "http://smartcity.com/air-quality-service/schema"
    
    async def execute(self, operation: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute a SOAP operation.
        
        Args:
            operation: SOAP operation name (e.g., "getAirQuality", "getAllCities")
            params: Operation parameters
        
        Returns:
            Response data as dictionary
        """
        try:
            # Build SOAP envelope
            soap_body = self._build_soap_request(operation, params or {})
            
            headers = {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": f'"{self.namespace}/{operation}"'
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.soap_url,
                    content=soap_body,
                    headers=headers
                )
                
                response.raise_for_status()
                
                # Parse SOAP response
                result = self._parse_soap_response(response.text, operation)
                return {"data": result}
                
        except httpx.HTTPStatusError as e:
            return {"error": f"SOAP HTTP error: {e.response.status_code}"}
        except Exception as e:
            return {"error": f"SOAP error: {str(e)}"}
    
    def _build_soap_request(self, operation: str, params: Dict[str, Any]) -> str:
        """Build SOAP XML request envelope."""
        params_xml = ""
        for key, value in params.items():
            params_xml += f"<{key}>{value}</{key}>"
        
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:air="{self.namespace}">
    <soapenv:Header/>
    <soapenv:Body>
        <air:{operation}Request>
            {params_xml}
        </air:{operation}Request>
    </soapenv:Body>
</soapenv:Envelope>"""
    
    def _parse_soap_response(self, xml_text: str, operation: str) -> Dict[str, Any]:
        """Parse SOAP XML response."""
        try:
            root = ET.fromstring(xml_text)
            
            # Find Body element
            namespaces = {
                'soap': 'http://schemas.xmlsoap.org/soap/envelope/',
                'air': self.namespace
            }
            
            body = root.find('.//soap:Body', namespaces)
            if body is None:
                # Try without namespace
                body = root.find('.//{http://schemas.xmlsoap.org/soap/envelope/}Body')
            
            if body is not None:
                # Extract all child elements as dictionary
                result = {}
                for child in body.iter():
                    if child.text and child.text.strip():
                        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                        result[tag] = child.text.strip()
                return result
            
            return {"raw": xml_text}
            
        except ET.ParseError:
            return {"raw": xml_text}
