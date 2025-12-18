import json
import os
from typing import Dict, Any, Optional, List
from groq import Groq

from config import GROQ_API_KEY, GROQ_MODEL
from .prompts import SYSTEM_PROMPT, RESPONSE_PROMPT

class GroqOrchestrator:
    def __init__(self):
        if GROQ_API_KEY:
            self.client = Groq(api_key=GROQ_API_KEY)
            self.model = GROQ_MODEL
        else:
            self.client = None
            print("⚠️ GROQ_API_KEY not set. Using mock responses.")
    
    async def generate_workflow(self, user_message: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """Generate a workflow JSON from user's natural language request using Groq."""
        
        if not self.client:
            # Mock response for testing without API key - reusing the logic from Gemini client would be better but for now simple mock
            from .gemini_client import GeminiOrchestrator
            return GeminiOrchestrator()._mock_workflow(user_message)
        
        try:
            prompt = f"{SYSTEM_PROMPT}\n\nDemande utilisateur: {user_message}"
            
            if context:
                prompt += f"\nContexte: {json.dumps(context, ensure_ascii=False)}"
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that outputs only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            text = completion.choices[0].message.content
            
            # Groq with json_object format should return valid JSON, but let's be safe
            workflow = json.loads(text)
            return workflow
            
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            return {"intent": "error", "actions": [], "error": "Failed to parse LLM response"}
        except Exception as e:
            print(f"LLM error: {e}")
            return {"intent": "error", "actions": [], "error": str(e)}
    
    async def generate_response(self, user_message: str, results: List[Dict[str, Any]]) -> str:
        """Generate a human-readable response from service results using Groq."""
        
        if not self.client:
            from .gemini_client import GeminiOrchestrator
            return GeminiOrchestrator()._mock_response(results)
        
        try:
            prompt = RESPONSE_PROMPT.format(
                user_message=user_message,
                results=json.dumps(results, ensure_ascii=False, indent=2)
            )
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            return completion.choices[0].message.content
            
        except Exception as e:
            print(f"Response generation error: {e}")
            return f"Voici les résultats de votre demande : {json.dumps(results, ensure_ascii=False)}"
