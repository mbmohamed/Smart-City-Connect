import json
import google.generativeai as genai
from typing import Dict, Any, Optional, List

from config import GEMINI_API_KEY
from .prompts import SYSTEM_PROMPT, RESPONSE_PROMPT


class GeminiOrchestrator:
    def __init__(self):
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        else:
            self.model = None
            print("⚠️ GEMINI_API_KEY not set. Using mock responses.")
    
    async def generate_workflow(self, user_message: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """Generate a workflow JSON from user's natural language request."""
        
        if not self.model:
            # Mock response for testing without API key
            return self._mock_workflow(user_message)
        
        try:
            prompt = f"{SYSTEM_PROMPT}\n\nDemande utilisateur: {user_message}"
            
            if context:
                prompt += f"\nContexte: {json.dumps(context, ensure_ascii=False)}"
            
            response = self.model.generate_content(prompt)
            
            # Extract JSON from response
            text = response.text.strip()
            
            # Handle markdown code blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            workflow = json.loads(text)
            return workflow
            
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            return {"intent": "error", "actions": [], "error": "Failed to parse LLM response"}
        except Exception as e:
            print(f"LLM error: {e}")
            return {"intent": "error", "actions": [], "error": str(e)}
    
    async def generate_response(self, user_message: str, results: List[Dict[str, Any]]) -> str:
        """Generate a human-readable response from service results."""
        
        if not self.model:
            return self._mock_response(results)
        
        try:
            prompt = RESPONSE_PROMPT.format(
                user_message=user_message,
                results=json.dumps(results, ensure_ascii=False, indent=2)
            )
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            print(f"Response generation error: {e}")
            return f"Voici les résultats de votre demande : {json.dumps(results, ensure_ascii=False)}"
    
    def _mock_workflow(self, user_message: str) -> Dict[str, Any]:
        """Generate mock workflow for testing without API key."""
        message_lower = user_message.lower()
        
        if "air" in message_lower or "pollution" in message_lower or "qualité" in message_lower:
            return {
                "intent": "check_air_quality",
                "entities": {"city": "Tunis"},
                "actions": [
                    {
                        "step": 1,
                        "service": "air_quality",
                        "protocol": "SOAP",
                        "operation": "getAirQuality",
                        "params": {"city": "Tunis"}
                    }
                ]
            }
        elif "transport" in message_lower or "bus" in message_lower or "metro" in message_lower:
            return {
                "intent": "check_transport",
                "entities": {},
                "actions": [
                    {
                        "step": 1,
                        "service": "mobility",
                        "protocol": "REST",
                        "operation": "GET /api/transport/lines",
                        "params": {}
                    }
                ]
            }
        elif "urgence" in message_lower or "alerte" in message_lower or "emergency" in message_lower:
            return {
                "intent": "check_emergencies",
                "entities": {},
                "actions": [
                    {
                        "step": 1,
                        "service": "emergency",
                        "protocol": "gRPC",
                        "operation": "GetAllAlerts",
                        "params": {}
                    }
                ]
            }
        elif "événement" in message_lower or "event" in message_lower or "signalement" in message_lower:
            return {
                "intent": "check_citizen_engagement",
                "entities": {},
                "actions": [
                    {
                        "step": 1,
                        "service": "citizen_engagement",
                        "protocol": "GraphQL",
                        "operation": "getAllEvents",
                        "params": {}
                    }
                ]
            }
        else:
            return {
                "intent": "city_status",
                "entities": {},
                "actions": [
                    {
                        "step": 1,
                        "service": "air_quality",
                        "protocol": "SOAP",
                        "operation": "getAirQuality",
                        "params": {"city": "Tunis"}
                    },
                    {
                        "step": 2,
                        "service": "citizen_engagement",
                        "protocol": "GraphQL",
                        "operation": "getAllEvents",
                        "params": {}
                    }
                ]
            }
    
    def _mock_response(self, results: List[Dict[str, Any]]) -> str:
        """Generate mock response for testing without API key."""
        if not results:
            return "Je n'ai pas pu obtenir de résultats. Veuillez réessayer."
        
        response_parts = ["Voici les informations demandées :\n"]
        
        for result in results:
            service = result.get("service", "unknown")
            data = result.get("data", {})
            error = result.get("error")
            
            if error:
                response_parts.append(f"❌ {service}: Erreur - {error}")
            else:
                response_parts.append(f"✅ {service}: {json.dumps(data, ensure_ascii=False)[:200]}")
        
        return "\n".join(response_parts)
