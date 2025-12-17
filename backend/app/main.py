from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from app.model import get_model
from app.utils import preprocess_image, EMOTIONS

app = FastAPI(title="AutiSense AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image")

    image_bytes = await file.read()

    try:
        img = preprocess_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image error: {e}")

    model = get_model()

    preds = model.predict(img, verbose=0)[0]
    idx = int(np.argmax(preds))

    return {
        "emotion": EMOTIONS[idx],
        "confidence": round(float(preds[idx]) * 100, 2),
    }
