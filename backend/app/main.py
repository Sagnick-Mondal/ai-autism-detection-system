from fastapi import FastAPI, UploadFile, File, HTTPException
import numpy as np

from app.model import get_model
from app.utils import preprocess_image, EMOTIONS

app = FastAPI()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image")

    image_bytes = await file.read()
    img = preprocess_image(image_bytes)

    model = get_model()
    preds = model.predict(img)

    idx = int(np.argmax(preds[0]))

    return {
        "emotion": EMOTIONS[idx],
        "confidence": float(preds[0][idx])
    }
