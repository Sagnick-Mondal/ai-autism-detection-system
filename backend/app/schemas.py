from pydantic import BaseModel

class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
