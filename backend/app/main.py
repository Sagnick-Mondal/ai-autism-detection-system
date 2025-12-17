from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from app.model import get_model
from app.utils import preprocess_image
from app.schemas import PredictionResponse
from app.config import EMOTIONS

app = FastAPI(title="AutiSense AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    try:
        image = preprocess_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        model = get_model()
        predictions = model.predict(image, verbose=0)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    idx = int(np.argmax(predictions))
    confidence = float(predictions[idx] * 100)

    return PredictionResponse(
        emotion=EMOTIONS[idx],
        confidence=confidence,
    )
