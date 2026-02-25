# app/schemas.py

from pydantic import BaseModel


class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    heatmap: str


class ASDResponse(BaseModel):
    is_autistic: bool
    autism_probability: float
    non_autism_probability: float