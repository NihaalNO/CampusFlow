import random

class AIService:
    """
    A mock AI service for tone analysis.
    In a real application, this would use a pre-trained NLP model.
    """
    
    TONE_CATEGORIES = [
        "urgent",
        "frustrated", 
        "neutral",
        "polite",
        "angry",
        "confused"
    ]
    
    RECOMMENDATIONS = {
        "urgent": "This disruption appears to be urgent. Consider prioritizing for quick response.",
        "frustrated": "This disruption appears to be frustrated. Consider prioritizing for quick response.",
        "neutral": "This disruption appears to be neutral. Standard handling procedure applies.",
        "polite": "This disruption appears to be polite. Standard handling procedure applies.",
        "angry": "This disruption appears to be angry. Consider careful handling with immediate response.",
        "confused": "This disruption appears to be confused. Consider reaching out for clarification."
    }
    
    def analyze_tone(self, text):
        """
        Analyze the tone of the given text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            dict: A dictionary containing the tone, confidence, and recommendation
        """
        # In a real application, this would use an NLP model
        # For now, we'll randomly select a tone with a random confidence
        tone = random.choice(self.TONE_CATEGORIES)
        confidence = round(random.uniform(0.7, 0.95), 2)
        recommendation = self.RECOMMENDATIONS.get(tone, "No specific recommendation available.")
        
        return {
            "tone": tone,
            "confidence": confidence,
            "recommendation": recommendation
        }

# Singleton instance
ai_service = AIService()