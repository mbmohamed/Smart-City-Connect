from config import LLM_PROVIDER
from .gemini_client import GeminiOrchestrator
from .groq_client import GroqOrchestrator

def get_llm_orchestrator():
    """Factory function to get the configured LLM orchestrator."""
    provider = LLM_PROVIDER.lower()
    
    if provider == "groq":
        print("🚀 Using Groq (Llama 3) Orchestrator")
        return GroqOrchestrator()
    elif provider == "gemini":
        print("✨ Using Gemini Orchestrator")
        return GeminiOrchestrator()
    else:
        print(f"⚠️ Unknown provider '{provider}', defaulting to Gemini")
        return GeminiOrchestrator()
